import { createSlice } from "@reduxjs/toolkit";
import type { BusyState } from "@/store/busy/types";
import reducers from "@/store/busy/reducers";
const initialState: BusyState = { busy: false };

export const busySlice = createSlice({
  name: "store/busy",
  initialState,
  reducers,
});

const { set } = busySlice.actions;
export default busySlice.reducer;
export { set }
