import { ReactElement, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { cleanup } from "@/store/alert";
import "@/components/AlertsPanel.scss";

export default function AlertsPanel(): ReactElement {
  console.log("dom rendered");
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alert?.alerts);

  const cleanUpCallback = useCallback(() => dispatch(cleanup(2)), [dispatch]);

  useEffect(() => {
    setTimeout(cleanUpCallback, 2000);
  }, [alerts, cleanUpCallback]);
  return (
    <div className="alerts-panel">
      {alerts.map((alert, index) => (
        <div
          className={`alert alert-${alert.severity}`}
          key={index}
          role="alert"
        >
          {alert.text}
        </div>
      ))}
    </div>
  );
}
