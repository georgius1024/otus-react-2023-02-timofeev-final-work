import { useDispatch } from "react-redux";
import { raise } from "@/store/alert";

export default function useAlert() {
  const dispatch = useDispatch();
  return function (text: string, severity = 'info') {
    dispatch(raise({ text, severity}));
  }
}
