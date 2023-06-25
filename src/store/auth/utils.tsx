import type { User } from "@/types";
export function store(user: User) {
  localStorage["store/auth"] = JSON.stringify(user);
}
export function restore(): User | undefined {
  if ("store/auth" in localStorage) {
    try {
      return JSON.parse(localStorage["store/auth"]) || {};
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
}
export function cleanup(): void {
  localStorage.removeItem("store/auth")
}
