import { useState, useEffect } from "react";
import classNames from "classnames";

import type { WordActivity } from "@/types";
import * as modules from "@/services/modules";
import useBusy from "@/utils/BusyHook";

type OnDone = (force?: boolean) => void;

type StepType =
  | "learn"
  | "translate-direct"
  | "translate-reverse"
  | "assemble"
  | "spell";

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
      return "assemble";
    case "assemble":
      return "spell";
    case "spell":
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
  const busy = useBusy();
  const [translations, setTranslations] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [rejected, setRejected] = useState<boolean>(false);
  useEffect(() => {
    busy(true);
    modules
      .findTranslations(6)
      .then(setTranslations)
      .catch(console.error)
      .finally(() => busy(false));
  }, [busy]);

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
        Please select proper translationfor the word
      </h5>
      <p>{props.activity.word}</p>
      <ul
        className={classNames("list-group", "list-group-flush", { "animated-rejected": rejected })}
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
        <WordActivityTranslateDirectStep
          activity={props.activity}
          onDone={props.onDone}
        />
      );
  }
}
export default function WordActivityWidget(props: WordActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  const [step, setStep] = useState<StepType>("learn");
  useEffect(() => {
    setEnabled(false);
    setStep('learn');
  }, [props])
  const goNext = () => {
    const next = nextStep(step);
    if (next) {
      setStep(next);
    } else {
      props.onDone();
    }
    setEnabled(false);
  };
  const doneHandler = (force?: boolean) => {
    setEnabled(true);
    if (force) {
      setTimeout(goNext, 300);
    }
  };
  return (
    <div className="card">
      <div className="card-body">
        {step}
        <WordActivityDispatcher
          activity={props.activity}
          step={step}
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
