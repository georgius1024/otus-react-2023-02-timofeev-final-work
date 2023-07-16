import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { PhraseActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function PhraseLearnStep(props: PhraseActivityStepProps) {

  const { t } = useTranslation();
  
  useEffect(() => {
    const timeout = setTimeout(() => props.onSolved(true), 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">
        {t("Activities.phrase.learn.title")}
      </h5>
      <blockquote className="blockquote mb-0">
        <p>{props.activity.phrase}</p>
        <footer className="blockquote-footer">
          {props.activity.translation}
        </footer>
      </blockquote>
    </>
  );
}
