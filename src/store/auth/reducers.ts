import type { AuthState } from "@/store/auth/types";
import { cleanupAuth, cleanupUser } from "@/store/auth/utils";
export default {
  logout: (state: AuthState) => {
    state.auth = undefined;
    cleanupAuth();
    cleanupUser();
  },
};
