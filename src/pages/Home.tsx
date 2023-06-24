import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
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
      <button className="btn btn-secondary" onClick={raiseDefault}>Raise</button>
      <button className="btn btn-secondary" onClick={raiseBusy}>Busy</button>
      <Link className="btn btn-secondary" to="/module">Modules</Link>
    </>
  );
}
