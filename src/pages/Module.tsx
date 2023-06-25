import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

//import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
export default function ModulePage(): ReactElement {
  const [childrenModules, setChildrenModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [parentModules, setParentModules] = useState<Module[]>([]);
  //const alert = useAlert();
  const busy = useBusy();
  const { id = "" } = useParams();

  const reload = useCallback(
    async (parent: string) => {
      busy(true);

      const fetchCurrent = (): "" | Promise<Module | null> => parent && modules.fetchOne(parent);
      const fetchChildren = (): Promise<Module[]> => modules.fetchChildren(parent);
      const fetchParents = async (): Promise<Module[]> => {
        let current = currentModule
        const path:Module[] = []
        while (current) {
          const parent = await modules.fetchOne(current.parent)
          parent && path.push(parent)
          current = parent
        }
        return path
      }

      Promise.all([fetchCurrent(), fetchChildren(), fetchParents()])
        .then((response) => {
          setCurrentModule(response[0] || null);
          setChildrenModules(response[1]);
          return fetchParents();
        })
        .then((parents) => setParentModules(parents))
        .then(() => busy(false))
        .catch(console.error);
    },
    [busy]
  );
  useEffect(() => {
    reload(id);
  }, [reload, id]);

  const create = () => {
    modules
      .create({ name: "Module", type: "lesson", parent: id })
      .catch(console.error)
      .then(console.log);
  };

  return (
    <>
      {currentModule ? <h1>{currentModule.name}</h1> : <h1>Modules</h1>}
      <ul>
        {childrenModules.map((e) => (
          <li key={e.id}>
            <Link to={`/module/${e.id}`}>{e.name}</Link>
          </li>
        ))}
      </ul>
      {id && <Link to="/module">Start</Link>}
      <button onClick={create}>Create</button>
    </>
  );
}
