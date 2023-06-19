import type { PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import type { AlertState, AlertPayload } from "@/store/alert/types";

export default {
  raise: (state: AlertState, action: PayloadAction<AlertPayload>) => {
    state.alerts.push({
      ...action.payload,
      severity: action.payload?.severity || "info",
      raisedAt: dayjs().valueOf(),
    });
  },
  cleanup: (state: AlertState, action: PayloadAction<number>) => {
    const limit = dayjs().subtract(action.payload, "seconds");
    if (state.alerts.find((alert) => dayjs(alert.raisedAt).isBefore(limit))) {
      state.alerts = state.alerts.filter((alert) =>
        dayjs(alert.raisedAt).isAfter(limit)
      );
    }
  },
};
