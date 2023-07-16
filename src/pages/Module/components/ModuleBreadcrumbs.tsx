import type { Module } from "@/types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type ModulesBreadcrumbsProps = {
  path: Module[];
};

type Breadcrumb = {
  name: string;
  id?: string;
  active?: boolean;
}
export default function ModulesBreadcrumbs(props: ModulesBreadcrumbsProps) {
  const { t } = useTranslation();

  const breadcrumbs: Breadcrumb[] = [
    { name: t("ModulesPage.breadcrumbs.root"), id: "" },
    ...props.path.map((e) => ({ name: e.name, id: e.id })),
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

