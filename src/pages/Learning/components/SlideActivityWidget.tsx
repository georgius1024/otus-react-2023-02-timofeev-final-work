import { useState, useEffect } from "react";
import type { SlideActivity } from "@/types";

type OnDone = () => void;

type SlideActivityWidgetProps = {
  activity: SlideActivity;
  onDone: OnDone;
};

export default function SlideActivityWidget(props: SlideActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnabled(true), 1000);
  }, []);
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{props.activity.header}</h5>
        <p>{props.activity.slide}</p>
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
