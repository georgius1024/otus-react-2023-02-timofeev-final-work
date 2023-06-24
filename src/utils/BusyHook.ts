import { useDispatch } from "react-redux";
import { set } from "@/store/busy";

export default function useBusy() {
  const dispatch = useDispatch();
  return function (busy: boolean) {
    dispatch(set(busy));
  }
}
