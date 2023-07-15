import type { Auth } from "@/types";
export function store(auth: Auth) {
  sessionStorage["store/auth"] = JSON.stringify(auth);
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
