import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";

import { StepType, PhraseActivityProps } from "@/pages/Learning/components/ActivityTypes";

import PhraseActivityDispatcher from "@/pages/Learning/components/PhraseActivityDispatcher";

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

export default function PhraseActivityWidget(props: PhraseActivityProps) {
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
    <div className="card phrase-activity">
      <div className={classNames("card-body", `${step}-step`)}>
        <PhraseActivityDispatcher
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
