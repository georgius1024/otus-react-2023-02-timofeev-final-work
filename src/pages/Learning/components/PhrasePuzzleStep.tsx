import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { PhraseActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function PhrasePuzzleStep(props: PhraseActivityStepProps) {
  const [words, setWords] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<string[]>([]);

  const { t } = useTranslation();

  useEffect(() => {
    setWords(props.activity.phrase.split(" ").sort(() => Math.random() - 0.5));
    setPuzzle([]);
  }, [props.activity.phrase]);

  useEffect(() => {
    if (puzzle.length && !words.length) {
      const solved = puzzle.join(" ") === props.activity.phrase;
      props.onSolved(solved);
    }
  }, [props, words, puzzle]);

  function typeWord(word: string) {
    setPuzzle([...puzzle, word]);
    const index = words.indexOf(word);
    // @ts-ignore
    setWords(words.toSpliced(index, 1));
  }

  function backspace() {
    const letter = puzzle.slice(-1);
    setPuzzle(puzzle.slice(0, -1));
    setWords([...words, ...letter]);
  }
  const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.key === "Backspace") {
      backspace();
    }
  };
  return (
    <>
      <h5 className="card-title">
        {t("Activities.phrase.puzzle.title", {
          translation: props.activity.translation,
        })}
      </h5>
      <div
        className="card-text keyboard-catcher"
        tabIndex={0}
        onKeyDown={keyDown}
      >
        <ul className="puzzle">
          {puzzle.map((word, index) => (
            <li onClick={backspace} key={`${word}-${index}`}>
              {word}
            </li>
          ))}
        </ul>
        <ul className="words">
          {words.map((word, index) => (
            <li onClick={() => typeWord(word)} key={`${word}-${index}`}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
