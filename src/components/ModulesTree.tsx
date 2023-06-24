import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import "@/components/ModulesTree.scss"
//import { Link } from "react-router-dom";

//import * as modules from "@/services/modules";
type ModuleTreeProps = {
  list: Module[]
};

export default function ModulePage(props: ModuleTreeProps): ReactElement {
  // const [list, setList] = useState<Module[]>([]);
  // const [busy, setBusy] = useState<boolean>(false);
  // const reload = useCallback(
  //   async () => {
  //     setBusy(true);
  //     await modules
  //       .fetchAll()
  //       .then((r) => setList(r))
  //       .catch(console.error)
  //       .finally(() => setBusy(false));
  //   },
  //   [setBusy]
  // );
  // useEffect(() => reload(), [reload]);
  function drawLevel(list: Module[], parent: string | undefined) {
    const currentLevel = list.filter(e => e.parent === parent)
    return (
      <div className="tree-level">
        {
          currentLevel.map(module => {
            const hasChindren = Boolean(list.find(e => e.parent === module.id))
            if (hasChindren) {
              return (
                <div className="tree-node tree-node-parent">[-]{module.name}
                  {drawLevel(list, module.id)}
                </div>
              )
            } else {
              return <div className="tree-node" >{module.name}</div>
            }
          })
        }
      </div>
    )
  }
  return (
    <div className="module-tree">
      {drawLevel(props.list, '')}
    </div>
  )
}
