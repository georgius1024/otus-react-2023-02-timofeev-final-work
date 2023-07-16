import { useState, useEffect } from "react";

import { WordActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function WordPuzzleStep(props: WordActivityStepProps) {
  const [letters, setLetters] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<string[]>([]);

  useEffect(() => {
    setLetters(props.activity.word.split("").sort(() => Math.random() - 0.5));
    setPuzzle([])
  }, [props.activity.word]);

  useEffect(() => {
    if (puzzle.length && !letters.length) {
      const solved = puzzle.join('') === props.activity.word
      props.onSolved(solved)
    }
  }, [props, letters, puzzle])

  function typeLetter(letter: string) {
    setPuzzle([...puzzle, letter]);
    const letterIndex = letters.indexOf(letter);
    // @ts-ignore
    setLetters(letters.toSpliced(letterIndex, 1));
  }
  function backspace() {
    const letter = puzzle.slice(-1);
    setPuzzle(puzzle.slice(0, -1));
    setLetters([...letters, ...letter]);
  }
  const keyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (letters.includes(e.key)) {
      typeLetter(e.key);
    }
    if (e.key === "Backspace") {
      backspace();
    }
  };
  const len = letters.length + puzzle.length;
  const plottable = [...puzzle, ...Array(len).fill('')].slice(0, len)
  return (
    <>
      <h5 className="card-title">
        Please spell the word "{props.activity.translation}"
      </h5>
      <div className="card-text keyboard-catcher" tabIndex={0} onKeyDown={keyDown}>
        <ul className="puzzle">
          {plottable.map((letter, index) => (
            <li onClick={backspace} key={`${letter}-${index}`}>
              {letter}
            </li>
          ))}
        </ul>
        <ul className="letters">
          {letters.map((letter, index) => (
            <li onClick={() => typeLetter(letter)} key={`${letter}-${index}`}>
              {letter}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
