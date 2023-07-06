import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import type { WordActivity } from "@/types";
import * as modules from "@/services/modules";
import useBusy from "@/utils/BusyHook";
import uniq from "lodash.uniq";

type OnDone = (force?: boolean) => void;

type StepType = "learn" | "translate-direct" | "translate-reverse" | "puzzle";

type WordActivityProps = {
  activity: WordActivity;
  onDone: OnDone;
};

type WordActivityWidgetProps = WordActivityProps;

type WordActivityDispatcherProps = WordActivityProps & {
  step: StepType;
};

const nextStep = (step: StepType): StepType | null => {
  switch (step) {
    case "learn":
      return "translate-direct";
    case "translate-direct":
      return "translate-reverse";
    case "translate-reverse":
      return "puzzle";
    case "puzzle":
    default:
      return null;
  }
};

function WordActivityLearnStep(props: WordActivityProps) {
  useEffect(() => {
    const timeout = setTimeout(props.onDone, 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">Please remember translation of the word "{props.activity.word}"</h5>
      <blockquote className="blockquote mb-0">
        <p>{props.activity.word}</p>
        <footer className="blockquote-footer">
          {props.activity.translation}
        </footer>
      </blockquote>
      <p className="card-text">
        <cite>{props.activity.context}</cite>
      </p>
    </>
  );
}

function WordActivityDirectTranslateDirectStep(props: WordActivityProps) {
  const busy = useBusy();
  const [translations, setTranslations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean>(false);
  useEffect(() => {
    busy(true);
    modules
      .findTranslations()
      .then((list) => {
        const translations = uniq([
          props.activity.translation,
          ...modules.similarWords(props.activity.translation, list, 100),
        ]).slice(0, 6);
        setTranslations(modules.shuffle<string>(translations));
      })
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, props.activity.translation]);

  const listSelectHandler = (selection: string) => {
    if (selection === props.activity.translation) {
      setSelected(selection);
      props.onDone(true);
    } else {
      const timer = setTimeout(() => setRejected(false), 1000);
      setRejected(true);
      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      <h5 className="card-title">
        Please select proper translation for the word "{props.activity.word}"
      </h5>
      <ul
        className={classNames("list-group", "list-group-flush", {
          "animated-rejected": rejected,
        })}
      >
        {translations.map((translation) => (
          <li
            className={classNames("list-group-item", "list-group-item-action", {
              active: selected === translation,
            })}
            key={translation}
            onClick={() => listSelectHandler(translation)}
          >
            {translation}
          </li>
        ))}
      </ul>
    </>
  );
}

function WordActivityReverseTranslateDirectStep(props: WordActivityProps) {
  const busy = useBusy();
  const [words, setWords] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean>(false);
  useEffect(() => {
    busy(true);
    modules
      .findWords()
      .then((list) => {
        const words = uniq([
          props.activity.word,
          ...modules.similarWords(props.activity.word, list, 100),
        ]).slice(0, 6);

        setWords(modules.shuffle<string>(words));
      })
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy, props.activity.word]);

  const listSelectHandler = (selection: string) => {
    if (selection === props.activity.word) {
      setSelected(selection);
      props.onDone(true);
    } else {
      const timer = setTimeout(() => setRejected(false), 1000);
      setRejected(true);
      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      <h5 className="card-title">Please select proper translation for the word "{props.activity.translation}"</h5>
      <ul
        className={classNames("list-group", "list-group-flush", {
          "animated-rejected": rejected,
        })}
      >
        {words.map((word) => (
          <li
            className={classNames("list-group-item", "list-group-item-action", {
              active: selected === word,
            })}
            key={word}
            onClick={() => listSelectHandler(word)}
          >
            {word}
          </li>
        ))}
      </ul>
    </>
  );
}

function WordActivityPuzzleStep(props: WordActivityProps) {
  const [letters, setLetters] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState<string[]>([]);
  useEffect(() => {
    setLetters(props.activity.word.split("").sort(() => Math.random() - 0.5));
    setPuzzle([])
  }, [props.activity.word]);

  useEffect(() => {
    if (puzzle.length && !letters.length) {
      props.onDone()
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
    console.log(letters, letter)
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
function WordActivityDispatcher(props: WordActivityDispatcherProps) {
  switch (props.step) {
    case "learn":
      return (
        <WordActivityLearnStep
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "translate-direct":
      return (
        <WordActivityDirectTranslateDirectStep
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "translate-reverse":
      return (
        <WordActivityReverseTranslateDirectStep
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "puzzle":
      return (
        <WordActivityPuzzleStep
          activity={props.activity}
          onDone={props.onDone}
        />
      );
  }
  return null;
}
export default function WordActivityWidget(props: WordActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<StepType>("learn");
  useEffect(() => {
    setEnabled(false);
    setStep("puzzle");
  }, [props]);
  const goNext = useCallback(() => {
    const next = nextStep(step);
    if (next) {
      setStep(next);
    } else {
      props.onDone();
    }
    setEnabled(false);
  }, [props, step]);
  const doneHandler = useCallback((force?: boolean) => {
    setEnabled(true);
    if (force) {
      setTimeout(goNext, 300);
    }
  }, [goNext]);
  return (
    <div className="card word-activty">
      <div className={classNames("card-body", `${step}-step`)}>
        {step}
        <WordActivityDispatcher
          activity={props.activity}
          step={step}
          key={step}
          onDone={doneHandler}
        />
        <hr />
        <button
          className="btn btn-primary"
          onClick={goNext}
          disabled={!enabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
