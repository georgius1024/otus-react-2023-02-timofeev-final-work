import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/store/auth";
import alertReducer from "@/store/alert";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    alert: alertReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
