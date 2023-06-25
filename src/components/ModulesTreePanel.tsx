import "@/components/ModulesTreePanel.scss";
import type { Module } from "@/types";
import { ReactElement } from "react";
type OnSelect = (id: string) => void;
type OnEdit = (id: string) => void;

type ModulesTreePanelProps = {
  modules: Module[];
  onSelect: OnSelect;
  onEdit: OnEdit;
};

export default function ModulesTreePanel(props: ModulesTreePanelProps) {
  const buttonClick = (id: string) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    props.onEdit(id)
  }

  const itemClick = (id: string) => (event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    props.onSelect(id)
  }
  
  return (
    <ul className="list-group modules-tree-panel">
      {props.modules.map((e) => (
        <li
          onClick={itemClick(e.id || '')}
          className="list-group-item d-flex justify-content-between align-items-center"
          key={e.id}
        >
          {e.name}
          <span
            className="badge bg-primary pill"
            onClick={buttonClick(e.id || '')}
          >
            edit
          </span>
        </li>
      ))}
    </ul>
  );
}
