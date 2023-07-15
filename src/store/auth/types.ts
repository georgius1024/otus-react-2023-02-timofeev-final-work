import type { Auth } from "@/types";

export interface AuthState {
  auth?: Auth;
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