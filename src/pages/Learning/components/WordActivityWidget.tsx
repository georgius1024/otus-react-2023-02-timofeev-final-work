import { useState, useEffect } from "react";
import type { WordActivity } from "@/types";
import * as modules from "@/services/modules";

type OnDone = () => void;

type StepType =
  | "learn"
  | "translate-direct"
  | "translate-reverse"
  | "assemble"
  | "spell";

type WordActivityProps = {
  activity: WordActivity;
};

type WordActivityWidgetProps = WordActivityProps & {
  onDone: OnDone;
};

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
      return "assemble";
    case "assemble":
      return "spell";
    case "spell":
    default:
      return null;
  }
};

function WordActivityLearnStep(props: WordActivityProps) {
  return (
    <>
      <h5 className="card-title">Please remember meaning of the word</h5>
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

function WordActivityTranslateDirectStep(props: WordActivityProps) {
  const [translations, setTranslations] = useState<string[]>([]);
  useEffect(() => {
    modules.findTranslations(6).then(setTranslations).catch(console.error);
  }, []);
  return (
    <>
      <h5 className="card-title">
        Please select proper translationfor the word
      </h5>
      <p>{props.activity.word}</p>
      <p className="card-text">
        <ul className="list-group">
          {translations.map((translation) => (
            <li className="list-group-item" key={translation}>{translation}</li>
          ))}
        </ul>
      </p>
    </>
  );
}

function WordActivityDispatcher(props: WordActivityDispatcherProps) {
  switch (props.step) {
    case "learn":
      return <WordActivityLearnStep activity={props.activity} />;
    case "translate-direct":
      return <WordActivityTranslateDirectStep activity={props.activity} />;
  }
}
export default function WordActivityWidget(props: WordActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<StepType>("learn");
  const goNext = () => {
    const next = nextStep(step);
    if (next) {
      setStep(next);
    } else {
      props.onDone();
    }
  };

  useEffect(() => {
    setTimeout(() => setEnabled(true), 100);
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        {step}
        <WordActivityDispatcher activity={props.activity} step={step} />
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
