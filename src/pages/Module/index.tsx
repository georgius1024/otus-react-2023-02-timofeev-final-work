import { ReactElement, useEffect, useState, useCallback } from "react";
import type { Module } from "@/types";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

import "@/pages/Module/index.scss";

//import useAlert from "@/utils/AlertHook";
import useBusy from "@/utils/BusyHook";
import ModuleForm from "@/pages/Module/components/ModuleForm";
import ActivityForm from "@/pages/Module/components/ActivityFormDispatcher";
import ModulesTreePanel from "@/pages/Module/components/ModulesTreePanel";
import SidePanel from "@/components/SidePanel";
import ModulesBreadcrumbs from "@/pages/Module/components/ModuleBreadcrumbs";
import CreateModuleWidget from "@/pages/Module/components/CreateModuleWidget";
import * as modules from "@/services/modules";

type EditorActionType = 'none' | 'create' | 'edit'

export default function ModulePage(): ReactElement {
  const [childrenModules, setChildrenModules] = useState<Module[]>([]);
  const [parentModules, setParentModules] = useState<Module[]>([]);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editorAction, showEditor] = useState<EditorActionType>('none');
  const [maxPosition, setMaxPosition] = useState<number>(0)
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
        .then(([children, path]) => {
          setChildrenModules(children);
          setParentModules(path);
          setMaxPosition(children.at(-1)?.position || 0)
          busy(false);
        })
        .catch(console.error);
    },
    [busy]
  );
  const lastModule = parentModules.at(-1) || null
  const formDomKey = (module: Module) => ([module.id, module.type, 'key'].join('-'))
  const create = (module: Module) => {
    setEditingModule(module);
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
  const saveModule = (module: Module | null, editorAction: EditorActionType) => {
    if (!module || editorAction === 'none') {
      return;
    }
    // @ts-ignore
    const action = editorAction === "edit"
      ? modules.update(module)
      : modules.create(module);
    busy(true);
    action
      .then(() => setEditingModule(module))
      .then(() => {
        showEditor('none');
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
      <ModulesBreadcrumbs path={parentModules} />
      <div className="modules-list">
        <ModulesTreePanel
          modules={childrenModules}
          onSelect={switchTo}
          onEdit={editModule}
          onDelete={deleteModule}
          onSort={sortDebounced}
        />
        {<CreateModuleWidget current={lastModule} count={maxPosition} onCreate={create} />}
      </div>
      <SidePanel
        position="right"
        width={600}
        show={editorAction !== 'none'}
        onClose={() => showEditor('none')}
      >
        <h4>
          <span className="text-capitalize">{editorAction}</span>
          &nbsp;
          {editingModule?.type}
        </h4>
        {
          EditorForm &&
          editingModule &&
          <EditorForm
            module={editingModule}
            onSubmit={(module) => saveModule(module, editorAction)}
            key={formDomKey(editingModule)}
          />
        }
      </SidePanel>
    </div>
  );
}
