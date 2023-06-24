import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { raise } from "@/store/alert";

export default function useAlert() {
  const dispatch = useDispatch();
  return useCallback(function (text: string, severity = 'info') {
    dispatch(raise({ text, severity}));
  }, [dispatch])
}
