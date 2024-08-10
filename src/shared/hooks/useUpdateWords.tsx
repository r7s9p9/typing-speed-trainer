import { punctuationList, wordList } from "../../constants";
import { getRandomInt } from "../../shared/lib/random";
import { getRandomBoolean } from "../../shared/lib/random";
import { useStore } from "../store/StoreProvider";
import {
  PUNCTUATION_CHANCE,
  CAPITALIZE_CHANCE,
  WORDS_COUNT,
} from "../../constants";

export function useUpdateWords() {
  const { updateStore } = useStore();
  const { words, letterCount } = wordsGenerator();

  const updateWords = () => {
    updateStore({
      words,
      count: { correct: 0, error: 0, all: letterCount },
    });
  };

  return { updateWords };
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

  return { words: result, letterCount: letterIndex + 1 };
}

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
