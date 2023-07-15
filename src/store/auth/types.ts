import type { Auth, User } from "@/types";

export interface AuthState {
  auth?: Auth;
  user?: User;
  busy?: boolean;
  error?: string;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RecoverPayload {
  email: string;
}
export interface ProfilePayload {
  profile: User
}