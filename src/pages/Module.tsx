import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";

import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
export default function ModulePage(): ReactElement {
  const [list, setList] = useState<Module[]>([]);
  const alert = useAlert();
  const busy = useBusy();
  const { id = "" } = useParams();

  const reload = useCallback(
    async (parent: string) => {
      busy(true);
      await modules
        .fetchAll(parent)
        .then((r) => setList(r))
        .catch(console.error)
        .finally(() => busy(false));
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
      <h1>MODULE</h1>
      <ul>
        {list.map((e) => (
          <li><Link to={`/module/${e.id}`}>{e.name}</Link></li>
        ))}
      </ul>
      {
        id && <Link to='/module'>Start</Link>
      }
      <pre>{JSON.stringify(list)}</pre>
      <button onClick={create}>Create</button>
    </>
  );
}
