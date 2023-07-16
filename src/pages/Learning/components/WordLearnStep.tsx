import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { WordActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function WordLearnStep(props: WordActivityStepProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => props.onSolved(true), 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">
        {t("Activities.word.learn.title", {word: props.activity.word})}
      </h5>
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
