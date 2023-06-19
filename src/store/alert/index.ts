import { createSlice } from "@reduxjs/toolkit";
import type { AlertState } from "@/store/alert/types";
import reducers from "@/store/alert/reducers";
const initialState: AlertState = { alerts: [] };

export const alertSlice = createSlice({
  name: "store/alert",
  initialState,
  reducers,
});

const { raise, cleanup } = alertSlice.actions;
export default alertSlice.reducer;
export { raise, cleanup }
