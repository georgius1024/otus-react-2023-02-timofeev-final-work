import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "@/store/auth/types";
import reducers from "@/store/auth/reducers";
import thunks, { login, register, forgot } from "@/store/auth/thunks";
import { restore } from "@/store/auth/utils";
const initialState: AuthState = { user: restore() };

export const authSlice = createSlice({
  name: "store/auth",
  initialState,
  reducers,
  extraReducers: thunks,
});

const { logout } = authSlice.actions;

export { logout, login, register, forgot };
export default authSlice.reducer;
