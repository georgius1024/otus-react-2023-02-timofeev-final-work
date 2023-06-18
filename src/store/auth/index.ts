import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "@/store/auth/types";
import reducers from "@/store/auth/reducers";
import thunks, { login, register, forgot } from "@/store/auth/thunks";
const initialState: AuthState = {};

export const authSlice = createSlice({
  name: "store/auth",
  initialState,
  reducers,
  extraReducers: thunks,
});

const { logout, store, restore } = authSlice.actions;

export { logout, store, restore, login, register, forgot };
export default authSlice.reducer;
