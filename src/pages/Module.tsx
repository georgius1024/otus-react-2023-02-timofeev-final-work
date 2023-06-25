import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
          setParentModules(path);
          busy(false);
        })
        .catch(console.error);
    },
    [busy]
  );
  useEffect(() => {
    reload(id);
  }, [reload, id]);

  const canCreate = (): boolean => {
    const last = parentModules.at(-1);
    return last?.type !== "activity";
  };

  const availableCreateType = (): string => {
    const last = parentModules.at(-1);
    switch (last?.type) {
      case "course":
        return "lesson";
      case "lesson":
        return "activity";
      default:
        return "course";
    }
  };
  const create = () => {
    setCurrentModule({ type: availableCreateType(), parent: id, name: "" });
    showEditor(true);
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

    const action = updated.id
      ? modules.update(updated)
      : modules.create(updated);
    busy(true);
    action
      .then(() => setCurrentModule(updated))
      .then(() => {
        showEditor(false);
        reload(updated.parent);
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
        <button
          className="btn btn-primary mt-3 w-100"
          disabled={!canCreate}
          type="button"
          onClick={create}
        >
          Create {availableCreateType()}
        </button>
      </div>
      <SidePanel
        position="right"
        width={600}
        show={editorVisible}
        onClose={() => showEditor(false)}
      >
        <h4>
          Edit {!currentModule?.id && "new"} {currentModule?.type}
        </h4>
        {currentModule && (
          <ModuleForm module={currentModule} onChange={setCurrentModule} />
        )}
        <div className="mt-3 d-flex justify-content-end">
          <button
            disabled={Boolean(currentModule?.name) === false}
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
