import type { Auth, User } from "@/types";

export function storeAuth(auth: Auth) {
  sessionStorage["store/auth"] = JSON.stringify(auth);
}

export function restoreAuth(): Auth | undefined {
  if ("store/auth" in sessionStorage) {
    try {
      return JSON.parse(sessionStorage["store/auth"]) || {};
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
}

export function cleanupAuth(): void {
  sessionStorage.removeItem("store/auth")
}

export function storeUser(user: User) {
  sessionStorage["store/user"] = JSON.stringify(user);
}

export function restoreUser(): User | undefined {
  if ("store/user" in sessionStorage) {
    try {
      return JSON.parse(sessionStorage["store/user"]) || {};
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
}

export function cleanupUser(): void {
  sessionStorage.removeItem("store/user")
}
