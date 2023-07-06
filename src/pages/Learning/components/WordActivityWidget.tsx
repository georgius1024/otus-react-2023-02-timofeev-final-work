import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import type { WordActivity } from "@/types";

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

import WordLearn from "@/pages/Learning/components/WordLearn";
import WordPuzzle from "@/pages/Learning/components/WordPuzzle";
import WordDirectTranslation from "@/pages/Learning/components/WordDirectTranslation";
import WordReverseTranslation from "@/pages/Learning/components/WordReverseTranslation";

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
        <WordLearn
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "translate-direct":
      return (
        <WordDirectTranslation
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "translate-reverse":
      return (
        <WordReverseTranslation
          activity={props.activity}
          onDone={props.onDone}
        />
      );
    case "puzzle":
      return (
        <WordPuzzle
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
    setStep("learn");
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
