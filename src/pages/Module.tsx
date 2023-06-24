import { ReactElement, useEffect, useState, useCallback } from "react";
import type {Module} from "@/types"

import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import * as modules from "@/services/modules";
import { set } from "@/store/busy";
export default function ModulePage(): ReactElement {

  const dispatch = useDispatch();

  const [list, setList] = useState<Module[]>([])
  const alert = useAlert()
  const busy = useBusy()
  const {id} = useParams()

  useEffect(() => {
    dispatch(set(true));
    modules.fetchAll().then(r => setList(r))
    .catch(console.error)
    .finally(() => dispatch(set(false)))
  }, [dispatch]);
  const create = () => {
    modules.create({name: 'Module', type: 'lesson'})
  }
  return (
    <>
      <h1>MODULE</h1>
      <pre>{JSON.stringify(list)}</pre>
      <button onClick={create}>Create</button>
    </>
  );
}
