import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import {
  StepType,
  WordActivityProps,
  WordActivityDispatcherProps,
} from "./WordActivityTypes";

import WordLearnStep from "@/pages/Learning/components/WordLearnStep";
import WordDirectTranslationStep from "@/pages/Learning/components/WordDirectTranslationStep";
import WordReverseTranslationStep from "@/pages/Learning/components/WordReverseTranslationStep";
import WordPuzzleStep from "@/pages/Learning/components/WordPuzzleStep";

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

function WordActivityDispatcher(props: WordActivityDispatcherProps) {
  switch (props.step) {
    case "learn":
      return (
        <WordLearnStep activity={props.activity} onSolved={props.onSolved} />
      );
    case "translate-direct":
      return (
        <WordDirectTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "translate-reverse":
      return (
        <WordReverseTranslationStep
          activity={props.activity}
          onSolved={props.onSolved}
        />
      );
    case "puzzle":
      return (
        <WordPuzzleStep activity={props.activity} onSolved={props.onSolved} />
      );
  }
  return null;
}
export default function WordActivityWidget(props: WordActivityProps) {
  const [enabled, setEnabled] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [rejected, setRejected] = useState<boolean>(false);
  const [step, setStep] = useState<StepType>("learn");
  useEffect(() => {
    setEnabled(false);
    setStep("learn");
  }, [props]);

  const goNext = useCallback(() => {
    if (correct) {
      const next = nextStep(step);
      if (next) {
        setStep(next);
      } else {
        props.onDone();
      }
      setEnabled(false);
    } else {
      const timer = setTimeout(() => setRejected(false), 1000);
      setRejected(true);
      return () => clearTimeout(timer);
    }
  }, [props, step, correct]);

  const solvedHandler = useCallback((correct: boolean) => {
    setEnabled(true);
    setCorrect(correct);
  }, []);
  return (
    <div className="card word-activty">
      <div className={classNames("card-body", `${step}-step`)}>
        {step}
        <WordActivityDispatcher
          activity={props.activity}
          step={step}
          key={step}
          onSolved={solvedHandler}
        />
        <hr />
        <button
          className={classNames("btn btn-primary", {
            "animated-rejected": rejected,
          })}
          onClick={goNext}
          disabled={!enabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
