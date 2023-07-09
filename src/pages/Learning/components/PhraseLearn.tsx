import { useEffect } from "react";

import type { PhraseActivity } from "@/types";

type OnDone = (force?: boolean) => void;

type PhraseActivityProps = {
  activity: PhraseActivity;
  onDone: OnDone;
};

export default function PhraseLearn(props: PhraseActivityProps) {
  useEffect(() => {
    const timeout = setTimeout(props.onDone, 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">
        Please remember translation of the phrase "{props.activity.phrase}"
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
