import { ReactElement, useState } from "react";
import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
export default function HomePage(): ReactElement {
  console.log("dom rendered");
  const [count, setCount] = useState(0);
  const alert = useAlert()
  const busy = useBusy()
  const raiseDefault = () => {
    alert(`Hello ${count}`)
    setCount(count + 1);
  }
  const raiseBusy = () => {
    busy(true)
    setTimeout(() => busy(false), 2000)
  }
  return (
    <>
      <h1>HOME</h1>
      <button onClick={raiseDefault}>Raise</button>
      <button onClick={raiseBusy}>Busy</button>
    </>
  );
}
