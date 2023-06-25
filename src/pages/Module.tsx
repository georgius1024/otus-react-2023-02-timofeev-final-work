import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import "@/pages/Module.scss";

//import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import FormGroup from "@/components/FormGroup";
import FormInput from "@/components/FormInput";
import ModulesTreePanel from "@/components/ModulesTreePanel";
import SidePanel from "@/components/SidePanel";
import * as modules from "@/services/modules";

export default function ModulePage(): ReactElement {
  const [childrenModules, setChildrenModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [parentModules, setParentModules] = useState<Module[]>([]);
  const [editorVisible, showEditor] = useState<boolean>(false);

  const [newName, setNewName] = useState<string>("");
  //const alert = useAlert();
  const busy = useBusy();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const switchTo = (id: string | undefined) => navigate(`/module/${id}`);
  const reload = useCallback(
    async (parent: string) => {
      busy(true);

      const fetchChildren = (id: string): Promise<Module[]> =>
        modules.fetchChildren(id);
      const fetchPath = async (id: string): Promise<Module[]> => {
        let current = id;
        const path: Module[] = [];
        while (current) {
          const module = await modules.fetchOne(current);
          module && path.push(module);
          current = module?.parent || "";
        }
        return [...path].reverse();
      };

      Promise.all([fetchChildren(parent), fetchPath(parent)])
        .then((response) => {
          setChildrenModules(response[0]);
          const path = response[1] || [];
          const current = path.at(-1) || null;
          setCurrentModule(current);
          setParentModules(path.slice(0, -1));
          setNewName(current?.name || "");
          busy(false);
        })
        .catch(console.error);
    },
    [busy]
  );
  useEffect(() => {
    reload(id);
  }, [reload, id]);

  const newNameChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewName(event.target.value);
  };

  const create = (type: string) => {
    const name = prompt(`Enter new ${type} name`, "new");
    if (!name) {
      return;
    }
    busy(true);
    modules
      .create({ name, type, parent: id })
      .catch(console.error)
      .then((newModule) => {
        if (newModule?.type !== 'activity') {
          switchTo(newModule?.id || '');
        } else {
          reload(newModule.parent);
        }
      })
      .catch(console.error)
      .finally(() => busy(false));
  };
  const editModule = (id: string) => {
    const module = childrenModules.find(e => e.id === id)
    if (!module) {
      return 
    }
    setCurrentModule(module)
    setNewName(module.name)
    showEditor(true)
  }
  const saveModule = () => {
    if (!currentModule) {
      return;
    }
    const updated = { ...currentModule, name: newName } as Module;
    busy(true);
    modules
      .update(updated)
      .then(() => setCurrentModule(updated))
      .then(() => {
        showEditor(false)
        reload(currentModule.parent);
      })
      .catch(console.error)
      .finally(() => busy(false));
  };

  const destroyModule = () => {
    if (!currentModule) {
      return;
    }
    busy(true);
    modules
      .destroy(currentModule)
      .then(() => {
        showEditor(false)
        reload(currentModule.parent);
      })
      .catch(console.error)
      .finally(() => busy(false));
  };
  const breadcrumbs = () => {
    const root = { name: "Root", id: "" };
    const current = currentModule
      ? { name: currentModule.name, id: currentModule.id }
      : null;
    return [
      root,
      ...parentModules.map((e) => ({ name: e.name, id: e.id })),
      current,
    ]
      .filter(Boolean)
      .map((e, index, array) => {
        const isLast = index === array.length - 1;
        return { ...e, active: isLast };
      });
  };
  return (
    <div className="container-fluid module-page">
      <h1>Modules</h1>
      <nav>
        <ol className="breadcrumb">
          {breadcrumbs().map((e) =>
            e.active ? (
              <li className="breadcrumb-item active" key={e.id}>
                {e.name}
              </li>
            ) : (
              <li
                className={`breadcrumb-item ${e.active ? "active" : ""}`}
                key={e.id}
              >
                <Link to={`/module/${e.id}`}>{e.name}</Link>
              </li>
            )
          )}
        </ol>
      </nav>
      <div className="modules-list">
        <ModulesTreePanel
          modules={childrenModules}
          onSelect={switchTo}
          onEdit={editModule}
        />
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle mt-3 w-100"
            type="button"
            id="createButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Create
          </button>
          <div className="dropdown-menu" aria-labelledby="createButton">
            <div className={classNames("dropdown-item", {disabled: currentModule})} onClick={() => create("course")}>
              Course
            </div>
            <div className={classNames("dropdown-item", {disabled: currentModule?.type !== 'course'})} onClick={() => create("lesson")}>
              Lesson
            </div>
            <div className={classNames("dropdown-item", {disabled: currentModule?.type !== 'lesson'})} onClick={() => create("activity")}>
              Activity
            </div>
          </div>
        </div>
      </div>
      <SidePanel
        position="right"
        width={600} 
        show={editorVisible}
        onClose={() => showEditor(false)}
      >
        <h4>Edit {currentModule?.type}</h4>
            <FormGroup label="Name">
              <FormInput type="text" value={newName} onInput={newNameChanged} />
            </FormGroup>
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn btn-primary w-100 me-3"
            type="button"
            onClick={saveModule}
          >
            Save
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={destroyModule}
          >
            Delete
          </button>
        </div>
      </SidePanel>
    </div>
  );
}
