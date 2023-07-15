import type { AuthState } from "@/store/auth/types";
import { cleanup } from "@/store/auth/utils";
export default {
  logout: (state: AuthState) => {
    state.auth = undefined;
    cleanup();
  },
};
