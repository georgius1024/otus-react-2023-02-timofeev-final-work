import type { PayloadAction } from "@reduxjs/toolkit";

import type { BusyState } from "@/store/busy/types";

export default {
  set: (state: BusyState, action: PayloadAction<boolean>) => {
    state.busy = action.payload;
  },
};
