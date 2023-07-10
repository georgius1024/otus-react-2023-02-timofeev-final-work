import { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { cleanup } from "@/store/alert";
import "@/components/AlertsPanel.scss";

export default function AlertsPanel(): ReactElement {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.alert?.alerts);

  useEffect(() => {
    setTimeout(() => dispatch(cleanup(2)), 2000);
  }, [alerts, dispatch]);
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
