import type { Module, ModuleType, ActivityType, Activity } from "@/types";
type OnCreate = (module: Module) => void;

type CreateModuleWidgetProps = {
  current: Module | null;
  onCreate: OnCreate
};

export default function CreateModuleWidget(props: CreateModuleWidgetProps) {
  const createModuleType = ((): ModuleType | null => {
    if (!props.current) {
      return "course";
    }
    switch (props.current?.type) {
      case "course":
        return "lesson";
      case "lesson":
        return "activity";
      case 'activity':
      default:
        return null
    }
  })();
  if (!createModuleType) {
    return null;
  }
  const createModule = (moduleType: ModuleType, activityType?: ActivityType): Module => {
    if (activityType) {
      return { parent: props.current?.id || '', name: '', type: moduleType, activity: { type: activityType } } as Module
    }
    return { parent: props.current?.id || '', name: '', type: moduleType } as Module
  }
  const createActivityTypeButton = (type: ActivityType) => (
    <button
      className="btn btn-primary"
      type="button"
      key={type}
      onClick={() => props.onCreate(createModule(createModuleType, type))}
    >
      Create {type} activity
    </button>
  )
  const acivityTypes: ActivityType[] = ['word', 'phrase', 'slide']
  if (createModuleType === 'activity') {
    return (
      <div className="btn-group mt-3">
        {
          acivityTypes.map(createActivityTypeButton)
        }
      </div>
    )
  }
  return (
    <button
      className="btn btn-primary mt-3 w-100"
      type="button"
      onClick={() => props.onCreate(createModule(createModuleType))}
    >
      Create {createModuleType}
    </button>

  )

}