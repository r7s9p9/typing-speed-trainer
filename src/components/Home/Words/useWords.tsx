import { useEffect, useState, useRef, MutableRefObject } from "react";
import { punctuationList, wordList } from "./constants";
import { getRandomInt } from "../../../shared/lib/random";
import { getRandomBoolean } from "../../../shared/lib/number";

export function useWords() {
  const [text, setText] = useState([] as JSX.Element[]);
  const letter = useRef() as MutableRefObject<HTMLLIElement>;

  function letterDetector() {
    if (!letter.current) {
      // First letter
      letter.current = document.getElementById("0") as HTMLLIElement;
    } else {
      // Next letter
      const nextId = Number(letter.current.id) + 1;
      letter.current = document.getElementById(
        nextId.toString()
      ) as HTMLLIElement;
    }

    return letter.current.innerText;
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const actualLetter = letterDetector();

    console.log(actualLetter);
  }

  useEffect(() => {
    const { words } = wordsGenerator(20);
    setText(words);
  }, []);

  return { text, onKeyDown };
}

function lettersGenerator({
  wordIndex,
  letterIndex,
}: {
  wordIndex: number;
  letterIndex: number;
}) {
  const isPunctuation = getRandomBoolean(0.25);
  const isCapitalize = getRandomBoolean(0.25) || wordIndex === 0; // always capitalize the first word
  const word = wordList[getRandomInt(0, wordList.length - 1)];
  const result = [];

  for (let i = 0; i < word.length; i++) {
    if (isCapitalize && i === 0) {
      // is the first letter capitalized
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

  if (isPunctuation) {
    // adding punctuation mark
    const punctuation =
      punctuationList[getRandomInt(0, punctuationList.length)];
    result.push(
      <li id={letterIndex.toString()} key={letterIndex}>
        {punctuation}
      </li>
    );
    letterIndex++;
  }

  // add a space between words
  result.push(
    <li id={letterIndex.toString()} key={letterIndex}>
      &nbsp;
    </li>
  );
  letterIndex++;

  // putting letters together into a list
  return {
    word: (
      <ul key={`word_${wordIndex}`} className="flex">
        {result}
      </ul>
    ),
    letterCount: result.length,
  };
}

function wordsGenerator(count: number) {
  let result: JSX.Element[] = [];

  let letterIndex = 0;
  for (let wordIndex = 0; wordIndex <= count; wordIndex++) {
    const { word, letterCount } = lettersGenerator({ wordIndex, letterIndex });
    result.push(word);
    letterIndex += letterCount;
  }

  return { words: result, lastIndex: letterIndex };
}
