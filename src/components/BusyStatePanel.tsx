import { ReactElement } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import "@/components/BusyPanel.scss";

export default function BusyStatePanel(): ReactElement | null {
  const busy = useSelector((state: RootState) => state.busy.busy);
  if (busy) {
    return (
      <div className="busy-state-panel"><div className="spinner"></div></div>
    );
  }
  return null;
}
