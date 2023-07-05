import { useState, useEffect } from "react";
import type { WordActivity } from "@/types";

type OnDone = () => void;

type WordActivityWidgetProps = {
  activity: WordActivity;
  onDone: OnDone;
};

export default function WordActivityWidget(props: WordActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnabled(true), 1000);
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Please remember meaning of the word</h5>
        <blockquote className="blockquote mb-0">
          <p>{props.activity.word}</p>
          <footer className="blockquote-footer">
            {props.activity.translation}
          </footer>
        </blockquote>
        <p className="card-text"><cite>{props.activity.context}</cite></p>
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
