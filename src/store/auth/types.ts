import type { User } from "@/types";

export interface AuthState {
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