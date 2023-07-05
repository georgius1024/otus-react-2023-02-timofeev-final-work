import { useState, useEffect } from "react";
import type { PhraseActivity } from "@/types";

type OnDone = () => void;

type PhraseActivityWidgetProps = {
  activity: PhraseActivity;
  onDone: OnDone;
};

export default function PhraseActivityWidget(props: PhraseActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnabled(true), 1000);
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Please remember meaning of the phrase</h5>
        <blockquote className="blockquote mb-0">
          <p>{props.activity.phrase}</p>
          <footer className="blockquote-footer">
            {props.activity.translation}
          </footer>
        </blockquote>
        <hr />
        <button
          className="btn btn-primary"
          onClick={props.onDone}
          disabled={!enabled}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
