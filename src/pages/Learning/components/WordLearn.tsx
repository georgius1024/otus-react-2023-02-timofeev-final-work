import { useEffect } from "react";

import type { WordActivity } from "@/types";

type OnDone = (force?: boolean) => void;

type WordActivityProps = {
  activity: WordActivity;
  onDone: OnDone;
};

export default function WordLearn(props: WordActivityProps) {
  useEffect(() => {
    const timeout = setTimeout(props.onDone, 1000);
    return () => clearTimeout(timeout);
  }, [props]);
  return (
    <>
      <h5 className="card-title">Please remember translation of the word "{props.activity.word}"</h5>
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
