import "@/components/ModulesTreePanel.scss";
import type { Module } from "@/types";
type OnSelect = (id: string) => void;
type OnEdit = (id: string) => void;
type OnDelete = (id: string) => void;

type ModulesTreePanelProps = {
  modules: Module[];
  onSelect: OnSelect;
  onEdit: OnEdit;
  onDelete: OnDelete;
};

export default function ModulesTreePanel(props: ModulesTreePanelProps) {
  const selectClick =
    (item: Module) => (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      const id = item.id || "";
      if (item.type !== "activity") {
        props.onSelect(id);
      } else {
        props.onEdit(id);
      }
    };

  const editClick =
    (item: Module) => (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      props.onEdit(item.id || "");
    };

  const deleteClick =
    (item: Module) => (event: React.MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      props.onDelete(item.id || "");
    };

  return (
    <ul className="list-group list-group-flush modules-tree-panel">
      {props.modules.map((e) => (
        <li
          onClick={selectClick(e)}
          className="list-group-item d-flex align-items-center"
          key={e.id}
        >
          <div className="flex-grow-1">{e.name}</div>
          <span
            className="badge bg-primary pill text-light"
            onClick={editClick(e)}
          >
            <svg
              height="16"
              className="me-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>pencil</title>
              <path
                d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
                fill="currentColor"
              />
            </svg>
            edit
          </span>
          <span className="text-danger ms-3" onClick={deleteClick(e)}>
            <svg
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>delete</title>
              <path
                d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </li>
      ))}
    </ul>
  );
}
