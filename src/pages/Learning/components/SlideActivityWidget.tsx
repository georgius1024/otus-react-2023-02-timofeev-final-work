import { useState, useEffect } from "react";
import type { SlideActivity } from "@/types";
import { useTranslation } from "react-i18next";

type OnDone = () => void;

type SlideActivityWidgetProps = {
  activity: SlideActivity;
  onDone: OnDone;
};

export default function SlideActivityWidget(props: SlideActivityWidgetProps) {
  const [enabled, setEnabled] = useState(false);

  const { t } = useTranslation();
  
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
          {t("Activities.buttons.continue")}
        </button>
      </div>
    </div>
  );
}
