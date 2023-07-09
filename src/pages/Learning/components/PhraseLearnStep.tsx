import { useEffect } from "react";

import { PhraseActivityStepProps } from "@/pages/Learning/components/ActivityTypes";

export default function PhraseLearnStep(props: PhraseActivityStepProps) {
  useEffect(() => {
    const timeout = setTimeout(() => props.onSolved(true), 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">Please remember translation of the phrase</h5>
      <blockquote className="blockquote mb-0">
        <p>{props.activity.phrase}</p>
        <footer className="blockquote-footer">
          {props.activity.translation}
        </footer>
      </blockquote>
    </>
  );
}
