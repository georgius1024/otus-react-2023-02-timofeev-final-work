import { useOutletContext } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import type { LessonStep } from "@/pages/Learning/components/ActivityTypes";

type ContextType = {
  step: LessonStep;
  onDone: () => void;
};

import WordActivityDispatcher from "@/pages/Learning/components/WordActivityDispatcher";
import PhraseActivityDispatcher from "@/pages/Learning/components/PhraseActivityDispatcher";

export default function LessonPageStep() {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(false);
  const [skippable, setSkippable] = useState<boolean>(false);
  const { t } = useTranslation();

  const { step, onDone } = useOutletContext<ContextType>();

  const onSolved = useCallback((correct: boolean) => {
    setCorrect(correct);
    setEnabled(true);
  }, []);

  const submit = useCallback(
    (correct: boolean) => {
      setEnabled(false);
      if (correct) {
        onDone();
      } else {
        const timer = setTimeout(() => setRejected(false), 1000);
        setRejected(true);
        return () => clearTimeout(timer);
      }
    },
    [onDone]
  );

  const skip = useCallback(() => {
    onDone();
  }, [onDone]);

  useEffect(() => {
    setEnabled(false);
    setCorrect(false);
    setRejected(false);
    setSkippable(step.type !== "learn");
    if (step.activity.type === "slide") {
      const timer = setTimeout(() => {
        setEnabled(true);
        setCorrect(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  function LessonStepDispatcher() {
    if (step.activity.type === "slide") {
      return (
        <div className={classNames("card-body", `${step.type}-step`)}>
          <h5 className="card-title">{step.activity.header}</h5>
          <p>{step.activity.slide}</p>
        </div>
      );
    }
    if (step.activity.type === "word") {
      return (
        <div className={classNames("card-body", `${step.type}-step`)}>
          <WordActivityDispatcher
            activity={step.activity}
            step={step.type}
            key={step.id}
            onSolved={onSolved}
          />
        </div>
      );
    }

    if (step.activity.type === "phrase") {
      return (
        <div className={classNames("card-body", `${step.type}-step`)}>
          <PhraseActivityDispatcher
            activity={step.activity}
            step={step.type}
            key={step.id}
            onSolved={onSolved}
          />
        </div>
      );
    }

    return null;
  }

  if (!step) {
    return (
      <div className="alert alert-danger" role="alert">
        Activity is missed
      </div>
    );
  }

  return (
    <div className={classNames("card", `${step.activity.type}-activity`)}>
      {LessonStepDispatcher()}
      <div className="card-footer d-flex justify-content-between">
        <button
          className={classNames("btn btn-primary", {
            "animated-rejected": rejected,
          })}
          onClick={() => submit(correct)}
          disabled={!enabled}
        >
          {t("LessonPage.buttons.continue")}
        </button>
        <button
          className={classNames("btn btn-outline-danger", {
            "d-none": !skippable,
          })}
          onClick={skip}
        >
          {t("LessonPage.buttons.forgot")}
        </button>
      </div>
    </div>
  );
}
