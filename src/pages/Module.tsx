import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import "@/pages/Module.scss";

//import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import ModuleForm from "@/components/ModuleForm";
import ModulesTreePanel from "@/components/ModulesTreePanel";
import SidePanel from "@/components/SidePanel";
import ModulesBreadcrumbs from "@/components/ModuleBreadcrumbs";
import * as modules from "@/services/modules";

export default function ModulePage(): ReactElement {
  const [childrenModules, setChildrenModules] = useState<Module[]>([]);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [parentModules, setParentModules] = useState<Module[]>([]);
  const [editorVisible, showEditor] = useState<boolean>(false);

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
          setParentModules(path)
          busy(false);
        })
        .catch(console.error);
    },
    [busy]
  );
  useEffect(() => {
    reload(id);
  }, [reload, id]);


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
        if (newModule?.type !== "activity") {
          switchTo(newModule?.id || "");
        } else {
          reload(newModule.parent);
        }
      })
      .catch(console.error)
      .finally(() => busy(false));
  };
  const editModule = (id: string) => {
    const module = childrenModules.find((e) => e.id === id);
    if (!module) {
      return;
    }
    setCurrentModule(module);
    showEditor(true);
  };

  const deleteModule = (id: string) => {
    const module = childrenModules.find((e) => e.id === id);
    if (!module) {
      return;
    }
    if (!confirm(`Delete ${module.type}?`)) {
      return;
    }
    busy(true);
    modules
      .destroy(module)
      .then(() => {
        reload(module.parent);
      })
      .catch(console.error)
      .finally(() => busy(false));
  };

  const saveModule = () => {
    if (!currentModule) {
      return;
    }
    const updated = { ...currentModule } as Module;
    busy(true);
    modules
      .update(updated)
      .then(() => setCurrentModule(updated))
      .then(() => {
        showEditor(false);
        reload(currentModule.parent);
      })
      .catch(console.error)
      .finally(() => busy(false));
  };
  return (
    <div className="container-fluid module-page">
      <h1>Modules</h1>
      <ModulesBreadcrumbs parents={parentModules} />
      <div className="modules-list">
        <ModulesTreePanel
          modules={childrenModules}
          onSelect={switchTo}
          onEdit={editModule}
          onDelete={deleteModule}
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
            <div
              className={classNames("dropdown-item", {
                disabled: currentModule,
              })}
              onClick={() => create("course")}
            >
              Course
            </div>
            <div
              className={classNames("dropdown-item", {
                disabled: currentModule?.type !== "course",
              })}
              onClick={() => create("lesson")}
            >
              Lesson
            </div>
            <div
              className={classNames("dropdown-item", {
                disabled: currentModule?.type !== "lesson",
              })}
              onClick={() => create("activity")}
            >
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
        {currentModule && <ModuleForm module={currentModule} onChange={setCurrentModule} />}
        <div className="mt-3 d-flex justify-content-end">
          <button
            className="btn btn-primary w-100"
            type="button"
            onClick={saveModule}
          >
            Save
          </button>
        </div>
      </SidePanel>
    </div>
  );
}
