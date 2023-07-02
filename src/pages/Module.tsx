import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module, ModuleType } from "@/types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import "@/pages/Module.scss";

//import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import ModuleForm from "@/components/ModuleForm";
import ActivityForm from "@/components/ActivityFormDispatcher";
import ModulesTreePanel from "@/components/ModulesTreePanel";
import SidePanel from "@/components/SidePanel";
import ModulesBreadcrumbs from "@/components/ModuleBreadcrumbs";
import * as modules from "@/services/modules";

export default function ModulePage(): ReactElement {
  const [childrenModules, setChildrenModules] = useState<Module[]>([]);
  const [parentModules, setParentModules] = useState<Module[]>([]);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editorAction, showEditor] = useState<false | 'create' | 'edit'>(false);

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
  const canCreate = (): boolean => {
    const last = parentModules.at(-1);
    return last?.type !== "activity";
  };
  const availableCreateType = (): ModuleType => {
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
    setEditingModule({ type: availableCreateType(), parent: id, name: "" });
    showEditor('create');
  };
  const editModule = (id: string) => {
    const module = childrenModules.find((e) => e.id === id);
    if (!module) {
      return;
    }
    setEditingModule(module);
    showEditor('edit');
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
  const saveModule = (module: Module | null) => {
    if (!module) {
      return;
    }
    const action = module.id
      ? modules.update(module)
      : modules.create(module);
    busy(true);
    action
      .then(() => setEditingModule(module))
      .then(() => {
        showEditor(false);
        reload(module.parent);
      })
      .catch(console.error)
      .finally(() => busy(false));
  };
  const sortModules = (list: Module[]) => {
    if (!list.length) {
      return;
    }
    if (
      list.length === childrenModules.length &&
      list.every((e, index) => e.id === childrenModules[index].id)
    ) {
      return;
    }
    setChildrenModules(list);
    busy(true);
    modules
      .sort(list)
      .catch(console.error)
      .finally(() => busy(false));
  };
  const sortDebounced = debounce(sortModules, 200)
  useEffect(() => {
    reload(id);
  }, [reload, id]);


  const EditorForm = (() => {
    if (editingModule?.type === 'activity') {
      return ActivityForm
    } else if (editingModule) {
      return ModuleForm
    }
  })()
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
          onSort={sortDebounced}
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
        show={Boolean(editorAction)}
        onClose={() => showEditor(false)}
      >
        <h4>
          <span className="capitalize">{editorAction}</span>
          {editingModule?.type}
        </h4>
        {EditorForm && editingModule && <EditorForm module={editingModule} onSubmit={saveModule} />}
      </SidePanel>
    </div>
  );
}