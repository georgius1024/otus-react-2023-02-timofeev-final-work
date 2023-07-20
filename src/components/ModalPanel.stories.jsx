import ModalPanel from "./ModalPanel"
import { useState } from "react";

export default {
  component: ModalPanel,
  title: 'ModalPanel',
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

export function Default () {
  const [show, setShow] = useState(false)
  return (
    <div>
    <button onClick={() => setShow(true)}>Click me</button>
    <ModalPanel show={show} onClose={() => setShow(false)}>
      <h1>Modal content</h1>
    </ModalPanel>
  </div>
  )
}

