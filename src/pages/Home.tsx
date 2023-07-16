import { ReactElement } from "react";
import Placeholder from "@/components/Placeholder";
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
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col">
          <Placeholder width="100%" rounded/>
        </div>
      </div>
    </div>
  )
}
