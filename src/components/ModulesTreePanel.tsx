import "@/components/ModulesTreePanel.scss";
import type { Module } from "@/types";
type OnSelect = (id: string) => void;
type OnEdit = (id: string) => void;

type ModulesTreePanelProps = {
  modules: Module[];
  onSelect: OnSelect;
  onEdit: OnEdit;
};

export default function ModulesTreePanel(props: ModulesTreePanelProps) {
  const itemClick = (item: Module) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    const id = item.id || ''
    if (item.type !== 'activity') {
      props.onSelect(id)
    } else {
      props.onEdit(id)      
    }
  }

  const buttonClick = (item: Module) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    props.onEdit(item.id || '')
    
  }
 
  return (
    <ul className="list-group list-group-flush modules-tree-panel">
      {props.modules.map((e) => (
        <li
          onClick={itemClick(e)}
          className="list-group-item d-flex justify-content-between align-items-center"
          key={e.id}
        >
          {e.name}
          <span
            className="badge bg-primary pill"
            onClick={buttonClick(e)}
          >
            edit
          </span>
        </li>
      ))}
    </ul>
  );
}
