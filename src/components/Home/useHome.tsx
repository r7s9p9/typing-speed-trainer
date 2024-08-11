import { useEffect, useRef, MutableRefObject } from "react";
import { useStore } from "../../shared/store/StoreProvider";
import { useUpdateWords } from "../../shared/hooks/useUpdateWords";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants";
import { useTimer } from "../../shared/hooks/useTimer";

export function useHome() {
  const navigate = useNavigate();
  const { store, updateStore, resetStore } = useStore();
  const { updateWords } = useUpdateWords();

  const timerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const letterRef = useRef() as MutableRefObject<HTMLLIElement>;
  const cursorRef = useRef() as MutableRefObject<HTMLDivElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const isTimerStopped = !store.timer.isStarted && store.timer.countdown !== 0;

  const { startTimer, stopTimer, resetTimer } = useTimer({
    onTimerTimeout: onFinish,
    timerRef,
  });

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Ignore Shift key
    const isShiftKey = e.key === "Shift" && e.shiftKey;
    if (isShiftKey) return;

    // Start timer only once
    if (isTimerStopped) startTimer();

    const { letterId, isCorrectLetter, isComplete } = letterHandler({
      letterRef,
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

    cursorHandler(letterId + 1, cursorRef);

    if (isComplete) onFinish();
  }

  function onFinish() {
    stopTimer();
    if (letterRef) {
      letterRef.current = document.getElementById("0") as HTMLLIElement;
    }
    inputRef.current.blur();
    inputRef.current.disabled = true;
    cursorRef.current.style.opacity = "0";
    cursorRef.current.style.left = "0px";
    cursorRef.current.style.top = "0px";
    navigate(routes.score.path);
  }

  function onRestart() {
    resetStore();
    resetTimer();
    cursorHandler(0, cursorRef);
    updateWords();
    letterRef.current = document.getElementById("-1") as HTMLLIElement;
    inputRef.current.disabled = false;
    inputRef.current.focus();
    cursorRef.current.style.opacity = "1";
  }

  useEffect(() => {
    updateWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    words: store.words,
    onKeyDown,
    inputRef,
    cursorRef,
    timerRef,
    timerSeconds: store.timer.countdown,
    onRestart,
  };
}

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
