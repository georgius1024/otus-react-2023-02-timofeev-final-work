import type { Module } from "@/types";
import { Link } from "react-router-dom";
type ModulesBreadcrumbsProps = {
  parents: Module[];
};

type Breadcrumb = {
  name: string;
  id?: string;
  active?: boolean;
}
export default function ModulesBreadcrumbs(props: ModulesBreadcrumbsProps) {
  const breadcrumbs: Breadcrumb[] = [
    { name: "Root", id: "" },
    ...props.parents.map((e) => ({ name: e.name, id: e.id })),
  ]
    .filter(Boolean)
    .map((e, index, array) => {
      const isLast = index === array.length - 1;
      return { ...e, active: isLast };
    })
    return (
    <nav>
    <ol className="breadcrumb">
      {breadcrumbs.map((e: Breadcrumb) =>
        e.active ? (
          <li className="breadcrumb-item active" key={e.id}>
            {e.name}
          </li>
        ) : (
          <li
            className={`breadcrumb-item ${e.active ? "active" : ""}`}
            key={e.id}
          >
            <Link to={`/module/${e.id}`}>{e.name}</Link>
          </li>
        )
      )}
    </ol>
  </nav>
    )
}

