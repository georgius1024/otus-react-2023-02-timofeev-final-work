import {
  createAsyncThunk,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { collection, query, limit, getDocs, where } from "firebase/firestore";

import { auth } from "@/firebase";
import { db } from "@/firebase";

import type { AuthState, AuthPayload, RecoverPayload } from "@/store/auth/types";
import type { User } from "@/types";

export const login = createAsyncThunk<
  User,
  AuthPayload,
  { rejectValue: string }
>("auth/login", async (payload: AuthPayload) => {
  const user = await signInWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  ).then((userCredentials) => {
    const { uid, email, providerData } = userCredentials.user;
    return { uid, email, providerData } as User;
  });
  const accessRef = collection(db, "access");
  const response = await getDocs(
    query(accessRef, where("uid", "==", user.uid), limit(1))
  );
  const access = response.docs.at(0)?.data()?.access;
  return { ...user, access };
});

export const register = createAsyncThunk(
  "auth/register",
  async (payload: AuthPayload) => {
    return createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    ).then((userCredentials) => {
      const { uid, email, providerData } = userCredentials.user;
      return { uid, email, providerData };
    });
  }
);

export const forgot = createAsyncThunk("auth/forgot", async (payload: RecoverPayload) => {
  return sendPasswordResetEmail(auth, payload.email);
});

export default function (builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(login.pending, (state: AuthState) => {
      state.busy = true;
      state.user = undefined;
      state.error = undefined;
    })
    .addCase(login.fulfilled, (state: AuthState, action) => {
      state.busy = false;
      state.user = action.payload as unknown as User;
    })
    .addCase(login.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
    })
    .addCase(register.pending, (state: AuthState) => {
      state.busy = true;
      state.user = undefined;
      state.error = undefined;
    })
    .addCase(register.fulfilled, (state: AuthState, action) => {
      state.busy = false;
      state.user = action.payload as unknown as User;
    })
    .addCase(register.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
    })
    .addCase(forgot.pending, (state: AuthState) => {
      state.busy = true;
      state.error = undefined;
    })
    .addCase(forgot.fulfilled, (state: AuthState) => {
      state.busy = false;
    })
    .addCase(forgot.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
    });
}
