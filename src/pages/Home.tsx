import { ReactElement } from "react";
// import { ReactElement, useState } from "react";
// import { Link } from "react-router-dom";
// import { ReactSortable } from "react-sortablejs";
// import useAlert from "@/utils/AlertHook";
// import useBusy from "@/utils/BusyHook";
// import SidePanel from "@/components/SidePanel";
// import ModalPanel from "@/components/ModalPanel";
// type Item = {
//   id: number;
//   name: string;
// };
export default function HomePage(): ReactElement {
  return <p>Just home page</p>
  // const [items, setItems] = useState<Item[]>([
  //   { id: 1, name: "H1" },
  //   { id: 2, name: "H2" },
  //   { id: 3, name: "H3" },
  // ]);
  // console.log("dom rendered");
  // const [count, setCount] = useState(0);
  // const [side, setSide] = useState(false);
  // const [modal, setModal] = useState(false);
  // const alert = useAlert();
  // const busy = useBusy();

  // const raiseDefault = () => {
  //   alert(`Hello ${count}`);
  //   setCount(count + 1);
  // };
  // const raiseBusy = () => {
  //   busy(true);
  //   setTimeout(() => busy(false), 2000);
  // };
  // return (
  //   <>
  //     <h1>HOME</h1>
  //     <button className="btn btn-secondary" onClick={raiseDefault}>
  //       Raise
  //     </button>
  //     <button className="btn btn-secondary" onClick={raiseBusy}>
  //       Busy
  //     </button>
  //     <button className="btn btn-secondary" onClick={() => setSide(true)}>
  //       Show side
  //     </button>
  //     <button className="btn btn-secondary" onClick={() => setModal(true)}>
  //       Show modal
  //     </button>
  //     <Link className="btn btn-secondary" to="/module">
  //       Modules
  //     </Link>

  //     <hr />
  //     <hr />
  //     <hr />
  //     <hr />
  //     <ReactSortable list={items} setList={setItems} sort={false} handle={".myhandle"} >
  //       {items.map((e: Item) => (
  //         <div className="item" key={e.id}>
  //           <span className="myhandle" style={{cursor: 'pointer'}}>|||</span> 
  //           <span className="ms-3">{e.name}</span>
  //         </div>
  //       ))}
  //     </ReactSortable>
  //     <pre>{JSON.stringify(items)}</pre>
  //     <SidePanel position="left" show={side} onClose={() => setSide(false)}>
  //       <h1>Side panel contents</h1>
  //     </SidePanel>
  //     <ModalPanel show={modal} onClose={() => setModal(false)}>
  //       <h1>Modal panel contents</h1>
  //     </ModalPanel>
  //   </>
  // );
}
