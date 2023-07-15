import type { Auth } from "@/types";
export function store(user: Auth) {
  sessionStorage["store/auth"] = JSON.stringify(user);
}
export function restore(): Auth | undefined {
  if ("store/auth" in sessionStorage) {
    try {
      return JSON.parse(sessionStorage["store/auth"]) || {};
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
}
export function cleanup(): void {
  sessionStorage.removeItem("store/auth")
}
