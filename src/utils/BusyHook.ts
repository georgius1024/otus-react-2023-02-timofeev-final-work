import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { set } from "@/store/busy";

export default function useBusy() {
  const dispatch = useDispatch();
  return useCallback(function (busy: boolean) {
    dispatch(set(busy));
  }, [dispatch])
}
