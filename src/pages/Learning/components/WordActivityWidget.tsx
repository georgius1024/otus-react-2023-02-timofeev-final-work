import { useState, useEffect } from "react";
import type { WordActivity } from "@/types";

type OnDone = () => void;

type WordActivityWidgetProps = {
  activity: WordActivity;
  onDone: OnDone;
};

type StepType =
  | "learn"
  | "translate-direct"
  | "translate-reverse"
  | "assemble"
  | "spell";

const nextStep = (step: StepType): StepType | null => {
  switch (step) {
    case "learn":
      return "translate-direct";
    case "translate-direct":
      return "translate-reverse";
    case "translate-reverse":
      return "assemble";
    case "assemble":
      return "spell";
    case "spell":
    default:
      return null;
  }
};

export default function WordActivityWidget(props: WordActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<StepType>("learn");
  const goNext = () => {
    const next = nextStep(step) 
    if (next) {
      setStep(next)
    } else {
      props.onDone()
    }

  }

  useEffect(() => {
    setTimeout(() => setEnabled(true), 100);
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Please remember meaning of the word</h5>
        <blockquote className="blockquote mb-0">
          <p>{props.activity.word}</p>
          <footer className="blockquote-footer">
            {props.activity.translation}
          </footer>
        </blockquote>
        <p className="card-text"><cite>{props.activity.context}</cite></p>
        {step}

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
