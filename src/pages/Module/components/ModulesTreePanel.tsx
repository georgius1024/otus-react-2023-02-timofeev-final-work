import { ReactSortable } from "react-sortablejs";
import "@/pages/Module/components/ModulesTreePanel.scss";
import type { Module } from "@/types";
import type { ItemInterface } from "react-sortablejs";
import omit from "lodash.omit";

type OnSelect = (id: string) => void;
type OnEdit = (id: string) => void;
type OnDelete = (id: string) => void;
type OnSort = (modules: Module[]) => void;

type ModulesTreePanelProps = {
  modules: Module[];
  onSelect: OnSelect;
  onEdit: OnEdit;
  onDelete: OnDelete;
  onSort: OnSort;
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

  const items = (modules: Module[]): ItemInterface[] =>
    modules.map((e) => e as ItemInterface);
  const setList = (items: ItemInterface[]): void =>
    props.onSort(
      items.map((e) => omit(e, ["selected", "chosen", "filtered"]) as Module)
    );

  return (
      <ReactSortable className="list-group list-group-flush modules-tree-panel user-select-none" tag="div"
        list={items(props.modules)}
        setList={setList}
        handle={".handle"}
      >
        {props.modules.map((e) => (
          <div
            className="list-group-item module-item d-flex align-items-center"
            key={e.id}
          >
            <div className="handle me-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="12px"
                viewBox="0 0 448 512"
              >
                <path d="M0 64H448v64H0V64zM0 224H448v64H0V224zM448 384v64H0V384H448z" />
              </svg>
            </div>
            <div className="flex-grow-1">
              <span className="module-link" onClick={selectClick(e)}>
                {e.name || "--empty module name--"}
              </span>
            </div>
            <span
              className="badge bg-primary pill text-light"
              onClick={editClick(e)}
            >
              <svg
                height="14"
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
            <span className="badge bg-danger ms-3" onClick={deleteClick(e)}>
              <svg
                height="14"
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
          </div>
        ))}
      </ReactSortable>
  );
}
