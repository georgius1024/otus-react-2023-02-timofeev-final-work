import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "@/store/auth/types";
import reducers from "@/store/auth/reducers";
import thunks, { login, register, forgot, updateProfile } from "@/store/auth/thunks";
import { restoreAuth, restoreUser } from "@/store/auth/utils";
const initialState: AuthState = { auth: restoreAuth(), user: restoreUser() };

export const authSlice = createSlice({
  name: "store/auth",
  initialState,
  reducers,
  extraReducers: thunks,
});

const { logout } = authSlice.actions;

export { logout, login, register, forgot, updateProfile };
export default authSlice.reducer;
