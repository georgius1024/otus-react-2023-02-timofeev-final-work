import type { User } from "@/types";
export function store(user: User) {
  sessionStorage["store/auth"] = JSON.stringify(user);
}
export function restore(): User | undefined {
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
