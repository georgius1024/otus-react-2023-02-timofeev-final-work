import { useTranslation } from "react-i18next";
import { nanoid } from "nanoid";

import Folder from "@/components/icons/Folder";
import File from "@/components/icons/File";
import Easel from "@/components/icons/Easel";

import type { Module, ModuleType, ActivityType, Activity } from "@/types";
type OnCreate = (module: Module) => void;

type CreateModuleWidgetProps = {
  current: Module | null;
  count?: number;
  onCreate: OnCreate;
};

export default function CreateModuleWidget(props: CreateModuleWidgetProps) {
  const { t } = useTranslation();

  const createModuleType = ((): ModuleType | null => {
    if (!props.current) {
      return "course";
    }
    switch (props.current?.type) {
      case "course":
        return "lesson";
      case "lesson":
        return "activity";
      case "activity":
      default:
        return null;
    }
  })();
  if (!createModuleType) {
    return null;
  }
  const createActivity = (type: ActivityType): Activity | null => {
    switch (type) {
      case "word":
        return {
          type,
          word: "",
          translation: "",
          context: "",
          synonyms: "",
        };
      case "phrase":
        return {
          type,
          phrase: "",
          translation: "",
        };
      case "slide":
        return {
          type,
          header: "",
          slide: "",
        };
    }
  };
  const createModule = (
    moduleType: ModuleType,
    activityType?: ActivityType
  ): Module => {
    if (activityType) {
      return {
        id: nanoid(),
        parent: props.current?.id || "",
        name: "",
        type: moduleType,
        enabled: true,
        activity: createActivity(activityType),
        position: (props.count || 0) + 1,
      } as Module;
    }
    return {
      parent: props.current?.id || "",
      name: "",
      type: moduleType,
    } as Module;
  };
  const createActivityTypeButton = (type: ActivityType) => (
    <button
      className="btn btn-primary"
      type="button"
      key={type}
      onClick={() => props.onCreate(createModule(createModuleType, type))}
    >
      <span className="me-2">
        <Easel />
      </span>
      <span>{t(`ModulesPage.CreateWidget.activity-${type}`)}</span>
    </button>
  );
  const acivityTypes: ActivityType[] = ["word", "phrase", "slide"];
  if (createModuleType === "activity") {
    return (
      <div className="btn-group mt-3 w-100">
        {acivityTypes.map(createActivityTypeButton)}
      </div>
    );
  }
  return (
    <button
      className="btn btn-primary mt-3 w-100"
      type="button"
      onClick={() => props.onCreate(createModule(createModuleType))}
    >
      <span className="me-2">
        {createModuleType === "course" && <Folder />}
        {createModuleType === "lesson" && <File />}
      </span>
      <span>{t(`ModulesPage.CreateWidget.${createModuleType}`)}</span>
    </button>
  );
}
