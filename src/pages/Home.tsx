import { ReactElement, useState } from "react";
import useAlert from "@/utils/AlertHook";
export default function HomePage(): ReactElement {
  console.log("dom rendered");
  const [count, setCount] = useState(0);
  const alert = useAlert()
  const raiseDefault = () => {
    alert(`Hello ${count}`)
    setCount(count + 1);
  }
  return (
    <>
      <h1>HOME</h1>
      <button onClick={raiseDefault}>Raise</button>
    </>
  );
}
