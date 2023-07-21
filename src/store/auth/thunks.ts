import { createAsyncThunk, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import * as users from "@/services/users"
import * as auth from "@/services/auth"

import { storeAuth, cleanupAuth, storeUser, cleanupUser } from "@/store/auth/utils";

import type {
  AuthState,
  AuthPayload,
  RecoverPayload,
  ProfilePayload
} from "@/store/auth/types";

import type { Auth, User } from "@/types";

export const login = createAsyncThunk<
  { auth: Auth; user?: User },
  AuthPayload,
  { rejectValue: string }
>("auth/login", async (payload: AuthPayload) => {
  const userAuth = await auth.login(
    payload.email,
    payload.password
  );

  const fetchAccess = () => {
    return users.fechAccess(userAuth.uid || '')
  };
  const fetchUser = () => {
    return users.findWithUid(userAuth.uid || '')
  };
  const [access, user] = await Promise.all([fetchAccess(), fetchUser()]);
  if (user) {
    return { auth: { ...userAuth, access }, user };
  }
  return { auth: { ...userAuth, access } };
  
});

export const register = createAsyncThunk(
  "auth/register",
  async (payload: AuthPayload) => {
    return await auth.register(
      payload.email,
      payload.password
    );
  }
);

export const forgot = createAsyncThunk(
  "auth/forgot",
  async (payload: RecoverPayload) => {
    return auth.forgot(payload.email);
  }
);

export const updateProfile = createAsyncThunk(
  "auth/update",
  async (payload: ProfilePayload) => {
    const profile = payload.profile;

    const user = await users.findWithUid(profile.uid)
    if (user) {
      await users.update(profile)
      return profile
    } else {
      return await users.create(profile)
    }
  }
);

export default function (builder: ActionReducerMapBuilder<AuthState>) {
  builder
    .addCase(login.pending, (state: AuthState) => {
      state.busy = true;
      state.auth = undefined;
      state.error = undefined;
    })
    .addCase(login.fulfilled, (state: AuthState, action) => {
      state.busy = false;
      const { auth, user } = action.payload;
      state.auth = auth as unknown as Auth;
      state.user = user as unknown as User;
      storeAuth(state.auth);
      storeUser(state.user)
    })
    .addCase(login.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
      cleanupAuth();
      cleanupUser()
    })
    .addCase(register.pending, (state: AuthState) => {
      state.busy = true;
      state.auth = undefined;
      state.error = undefined;
    })
    .addCase(register.fulfilled, (state: AuthState, action) => {
      state.busy = false;
      state.auth = action.payload as unknown as Auth;
      storeAuth(state.auth);
    })
    .addCase(register.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
      cleanupAuth();
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
    })
    .addCase(updateProfile.pending, (state: AuthState) => {
      state.busy = true;
      state.error = undefined;
    })
    .addCase(updateProfile.fulfilled, (state: AuthState, action) => {
      state.user = action.payload as unknown as User;
      state.busy = false;
      storeUser(state.user)
    })
    .addCase(updateProfile.rejected, (state: AuthState, action) => {
      state.busy = false;
      state.error = action.error.message;
    })
    ;
}
