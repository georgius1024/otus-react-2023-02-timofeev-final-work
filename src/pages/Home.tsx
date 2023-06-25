import { ReactElement, useState } from "react";
import { Link } from "react-router-dom";
import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import SidePanel from "@/components/SidePanel";

export default function HomePage(): ReactElement {
  console.log("dom rendered");
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false)
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
      <button className="btn btn-secondary" onClick={() => setShow(true)}>Show</button>
      <Link className="btn btn-secondary" to="/module">Modules</Link>
      <SidePanel position="left" show={show} onClose={() => setShow(false)}>

        <h1>Side panel contenss</h1>
      </SidePanel>
    </>
  );
}
