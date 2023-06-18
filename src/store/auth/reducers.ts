import type { AuthState } from "@/store/auth/types";
import { restore } from ".";

export default {
  logout: (state: AuthState) => {
    state.user = undefined;
  },
  store: (state: AuthState) => {
    localStorage["store/auth"] = JSON.stringify(state);
  },
  restore: (state: AuthState) => {
    if ("store/auth" in localStorage) {
      try {
        const restored = JSON.parse(localStorage["store/auth"]);
        state.user = restored.user
        state.busy = undefined;
        state.error = undefined;
      } catch (error) {
        console.error(error);
      }
    }
  },
};
