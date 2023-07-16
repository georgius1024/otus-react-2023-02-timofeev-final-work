import { useCallback, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

import classNames from "classnames";

import WordActivityDispatcher from "@/pages/Learning/components/WordActivityDispatcher";
import PhraseActivityDispatcher from "@/pages/Learning/components/PhraseActivityDispatcher";

import type { RepetitionStep } from "@/pages/Learning/components/ActivityTypes";

type ContextType = {
  step: RepetitionStep;
  onDone: () => void;
  onFail: () => void;
};

export default function RepetitionStepPage() {

  const [enabled, setEnabled] = useState<boolean>(false);
  const [correct, setCorrect] = useState<boolean>(false);
  const [rejected, setRejected] = useState<boolean>(false);

  const { step, onDone, onFail } = useOutletContext<ContextType>();
  const { t } = useTranslation();

  const onSolved = useCallback((correct: boolean) => {
    setCorrect(correct)
    setEnabled(true);
  }, [])

  const submit = useCallback((correct: boolean) => {
    setEnabled(false);
    if (correct) {
      onDone()
    } else {
      onFail()
      const timer = setTimeout(() => setRejected(false), 1000);
      setRejected(true);
      return () => clearTimeout(timer);
    }
  }, [onDone, onFail])

  const skip = useCallback(() => {
    onFail()
    onDone()
  }, [onDone, onFail])

  if (!step) {
    return (
      <div className="alert alert-danger" role="alert">
        Activity is missed
      </div>
    );
  }


  function RepetitionStepDispatcher() {
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

  return (
    <div className={classNames("card", `${step.activity.type}-activity`)}>
      {RepetitionStepDispatcher()}
      <div className="card-footer d-flex justify-content-between">
        <button
          className={classNames("btn btn-primary", {
            "animated-rejected": rejected,
          })}
          onClick={() => submit(correct)}
          disabled={!enabled}
        >
          {t("RepetitionPage.buttons.continue")}
          
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={skip}
        >
          {t("RepetitionPage.buttons.forgot")}
        </button>

      </div>

    </div>
  );
}
