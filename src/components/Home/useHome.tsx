import { useEffect, useRef, MutableRefObject } from "react";
import { useStore } from "../../shared/store/StoreProvider";
import { useUpdateWords } from "../../shared/hooks/useUpdateWords";
import { useNavigate } from "react-router-dom";
import { routes, TIMER_SECONDS_COUNT } from "../../constants";

function letterHandler({
  letterRef,
  userLetter,
  lastIndex,
}: {
  letterRef: MutableRefObject<HTMLLIElement>;
  userLetter: string;
  lastIndex: number;
}) {
  let letterId = 0;
  if (!letterRef?.current) {
    // First letter
    letterRef.current = document.getElementById("0") as HTMLLIElement;
  } else {
    // Next letter
    letterId = Number(letterRef.current.id) + 1;
    letterRef.current = document.getElementById(
      letterId.toString()
    ) as HTMLLIElement;
  }

  const isCorrectLetter = isSameLetter(letterRef.current.innerText, userLetter);
  changeLetterColor({ letterRef, isCorrectLetter });

  return {
    letterId,
    // Last letter written
    isCorrectLetter,
    isComplete: letterId === lastIndex - 1,
  };
}

function changeLetterColor({
  letterRef,
  isCorrectLetter,
}: {
  letterRef: MutableRefObject<HTMLLIElement>;
  isCorrectLetter: boolean;
}) {
  if (isCorrectLetter) {
    letterRef.current.style.color = "black";
  } else {
    letterRef.current.style.color = "red";
  }
}

function cursorHandler(
  letterId: number,
  cursorRef?: MutableRefObject<HTMLDivElement>
) {
  const letter = document.getElementById(letterId.toString());
  if (!cursorRef) return;
  cursorRef.current.style.left = `${letter?.offsetLeft}px`;
  cursorRef.current.style.top = `${letter?.offsetTop}px`;
}

function isSameLetter(storedLetter: string, userLetter: string) {
  const isSpaceKey = userLetter.includes(" ") && storedLetter === " ";
  if (storedLetter === userLetter || isSpaceKey) return true;
  return false;
}

function useTimer({
  onTimerTimeout,
}: {
  onTimerTimeout: ReturnType<typeof Function>;
}) {
  const { store, updateStore } = useStore();
  const timer = store.timer;

  function handleTime() {
    if (timer.countdown > 0) {
      updateStore({
        timer: {
          ...store.timer,
          isStarted: true,
          countdown: timer.countdown - 1,
        },
      });
    } else {
      stopTimer();
      onTimerTimeout();
    }
  }

  function stopTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: false,
        countdown: timer.countdown,
      },
    });
    timer.ref.current.style.opacity = "0";
  }

  function resetTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: false,
        countdown: TIMER_SECONDS_COUNT,
      },
    });
    timer.ref.current.style.opacity = "0";
  }

  function startTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: {
        ref: store.timer.ref,
        isStarted: true,
        countdown: timer.countdown,
      },
    });
    timer.ref.current.style.opacity = "1";
  }

  useEffect(() => {
    if (timer.isStarted) {
      const interval = setInterval(() => handleTime(), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return {
    startTimer,
    stopTimer,
    resetTimer,
  };
}

export function useHome() {
  const navigate = useNavigate();
  const { store, updateStore, resetStore } = useStore();
  const { updateWords } = useUpdateWords();

  store.timer.ref = useRef() as MutableRefObject<HTMLDivElement> | undefined;
  store.letterRef = useRef() as MutableRefObject<HTMLLIElement> | undefined;
  store.cursorRef = useRef() as MutableRefObject<HTMLDivElement> | undefined;
  store.inputRef = useRef() as MutableRefObject<HTMLInputElement> | undefined;

  const isTimerStopped = !store.timer.isStarted && store.timer.countdown !== 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Ignore Shift key
    const isShiftKey = e.key === "Shift" && e.shiftKey;
    if (isShiftKey) return;

    // Start timer only once
    if (isTimerStopped) startTimer();

    const { letterId, isCorrectLetter, isComplete } = letterHandler({
      letterRef: store.letterRef as MutableRefObject<HTMLLIElement>,
      userLetter: e.key,
      lastIndex: store.count.all - 1,
    });

    if (isCorrectLetter) {
      updateStore({
        count: { ...store.count, correct: store.count.correct + 1 },
      });
    } else {
      updateStore({ count: { ...store.count, error: store.count.error + 1 } });
    }

    cursorHandler(letterId + 1, store.cursorRef);

    if (isComplete) onFinish();
  }

  const { startTimer, stopTimer, resetTimer } = useTimer({
    onTimerTimeout: onFinish,
  });

  function onFinish() {
    stopTimer();
    if (store.letterRef) {
      store.letterRef.current = document.getElementById("0") as HTMLLIElement;
    }
    if (store.inputRef) {
      store.inputRef.current.blur();
      store.inputRef.current.disabled = true;
    }
    if (store.cursorRef) {
      store.cursorRef.current.style.opacity = "0";
      store.cursorRef.current.style.left = "0px";
      store.cursorRef.current.style.top = "0px";
    }
    navigate(routes.score.path);
  }

  function onRestart() {
    resetStore();
    resetTimer();
    cursorHandler(0, store.cursorRef);
    updateWords();
    if (store.letterRef) {
      store.letterRef.current = document.getElementById("-1") as HTMLLIElement;
    }
    if (store.inputRef) {
      store.inputRef.current.disabled = false;
      store.inputRef.current.focus();
    }
    if (store.cursorRef) {
      store.cursorRef.current.style.opacity = "1";
    }
  }

  useEffect(() => {
    updateWords();
  }, []);

  return {
    words: store.words,
    onKeyDown,
    inputRef: store.inputRef as MutableRefObject<HTMLInputElement>,
    cursorRef: store.cursorRef as MutableRefObject<HTMLDivElement>,
    timerRef: store.timer.ref as MutableRefObject<HTMLDivElement>,
    timerSeconds: store.timer.countdown,
    onRestart,
  };
}
