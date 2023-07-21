import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { Link } from "react-router-dom";
import Card from "@/components/Card";
export default function ErrorPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <Card title="404">
      <h1>{t("Error404Page.title")}</h1>
      <p>{t("Error404Page.description")}</p>
      <Link className="btn btn-secondary" to="/">{t("Error404Page.action")}</Link>
    </Card>
  );
}
