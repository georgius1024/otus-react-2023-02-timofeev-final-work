import SidePanel from "./SidePanel"
import { useState } from "react";

export default {
  component: SidePanel,
  title: 'SidePanel',
  argTypes: {
    onClose: {
      table: {
        disable: true,
      },
    },
    show: {
      table: {
        disable: true,
      },
    },
    clickClose: {
      table: {
        disable: true,
      },
    },
  },  
};

export function Left () {
  const [show, setShow] = useState(false)
  return (
    <div>
    <button onClick={() => setShow(true)}>Click me</button>
    <SidePanel show={show} onClose={() => setShow(false)} position="left">
      <h1>Side panel content</h1>
    </SidePanel>
  </div>
  )
}


export function Right () {
  const [show, setShow] = useState(false)
  return (
    <div>
    <button onClick={() => setShow(true)}>Click me</button>
    <SidePanel show={show} onClose={() => setShow(false)} position="right">
      <h1>Side panel content</h1>
    </SidePanel>
  </div>
  )
}

