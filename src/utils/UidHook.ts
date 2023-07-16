import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function useUid() {
  const uid = useSelector((state: RootState) => state.auth?.auth?.uid);
  return useCallback(
    function (): string {
      return uid || "";
    },
    [uid]
  );
}
