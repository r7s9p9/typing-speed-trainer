import { useEffect, useState, useRef, MutableRefObject } from "react";
import { punctuationList, wordList } from "./constants";
import { getRandomInt } from "../../../shared/lib/random";
import { getRandomBoolean } from "../../../shared/lib/number";
import { useStore } from "../../../shared/store/StoreProvider";
import {
  PUNCTUATION_CHANCE,
  CAPITALIZE_CHANCE,
  WORDS_COUNT,
} from "../../../constants";

function lettersGenerator({
  wordIndex,
  letterIndex,
  isLast,
}: {
  wordIndex: number;
  letterIndex: number;
  isLast: boolean;
}) {
  const isPunctuation = getRandomBoolean(PUNCTUATION_CHANCE);
  const isCapitalize = getRandomBoolean(CAPITALIZE_CHANCE) || wordIndex === 0; // always capitalize the first word
  const word = wordList[getRandomInt(0, wordList.length - 1)];
  const result = [];

  for (let i = 0; i < word.length; i++) {
    // Is the first letter capitalized
    if (isCapitalize && i === 0) {
      result.push(
        <li id={letterIndex.toString()} key={letterIndex}>
          {word[i].toUpperCase()}
        </li>
      );
    } else {
      result.push(
        <li id={letterIndex.toString()} key={letterIndex}>
          {word[i]}
        </li>
      );
    }
    letterIndex++;
  }

  // Adding punctuation mark
  if (isPunctuation) {
    const punctuation =
      punctuationList[getRandomInt(0, punctuationList.length)];
    result.push(
      <li id={letterIndex.toString()} key={letterIndex}>
        {punctuation}
      </li>
    );
    letterIndex++;
  }

  // Add a space between words
  if (!isLast) {
    result.push(
      <li id={letterIndex.toString()} key={letterIndex}>
        &nbsp;
      </li>
    );
    letterIndex++;
  }

  // Putting letters together into a list
  //
  // Randomization is needed so that after a restart there
  // are no matches by key and nesting among the list elements
  return {
    word: (
      <ul key={`word_${wordIndex}_${Math.random()}`} className="flex">
        {result}
      </ul>
    ),
    letterCount: result.length,
  };
}

function wordsGenerator() {
  const result: JSX.Element[] = [];

  let letterIndex = 0;
  for (let wordIndex = 0; wordIndex <= WORDS_COUNT; wordIndex++) {
    const { word, letterCount } = lettersGenerator({
      wordIndex,
      letterIndex,
      isLast: wordIndex === WORDS_COUNT,
    });
    result.push(word);
    letterIndex += letterCount;
  }

  return { words: result, wordCount: letterIndex + 1 };
}

function letterHandler(
  letterRef: MutableRefObject<HTMLLIElement>,
  userLetter: string,
  lastIndex: number
) {
  let letterId = 0;
  if (!letterRef.current) {
    // First letter
    letterRef.current = document.getElementById("0") as HTMLLIElement;
  } else {
    // Next letter
    letterId = Number(letterRef.current.id) + 1;
    console.log(letterId);
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
  cursorRef: MutableRefObject<HTMLDivElement>
) {
  const nextLetter = document.getElementById(letterId.toString());

  cursorRef.current.style.left = `${nextLetter?.offsetLeft}px`;
  cursorRef.current.style.top = `${nextLetter?.offsetTop}px`;
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
      timer: { ...store.timer, isStarted: false, countdown: timer.countdown },
    });
    timer.ref.current.style.opacity = "0";
  }

  function startTimer() {
    if (!timer.ref) return;
    updateStore({
      timer: { ...store.timer, isStarted: true, countdown: timer.countdown },
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
  };
}

export function useWords() {
  const { store, updateStore, resetStore } = useStore();
  const timerRef = (store.timer.ref =
    useRef() as MutableRefObject<HTMLDivElement>);

  const letterRef = useRef() as MutableRefObject<HTMLLIElement>;
  const cursorRef = useRef() as MutableRefObject<HTMLDivElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const isTimerStopped = !store.timer.isStarted && store.timer.countdown !== 0;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Ignore Shift key
    const isShiftKey = e.key === "Shift" && e.shiftKey;
    if (isShiftKey) return;

    // Start timer only once
    if (isTimerStopped) startTimer();

    const { letterId, isCorrectLetter, isComplete } = letterHandler(
      letterRef,
      e.key,
      store.count.all - 1
    );

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

  const { startTimer, stopTimer } = useTimer({
    onTimerTimeout: onFinish,
  });

  function onFinish() {
    stopTimer();
  }

  function getWords() {
    const { words, wordCount } = wordsGenerator();
    updateStore({ words, count: { ...store.count, all: wordCount } });
  }

  function onRestart() {
    stopTimer();
    resetStore();
    getWords();
    cursorHandler(0, cursorRef);
    letterRef.current = document.getElementById("0") as HTMLLIElement;
    inputRef.current.focus();
  }

  useEffect(() => {
    getWords();
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
