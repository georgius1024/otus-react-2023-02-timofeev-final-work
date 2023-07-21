import { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Card from "@/components/Card";
export default function ErrorPage(): ReactElement {
  const { t } = useTranslation();

  return (
    <Card title="Error">
      <h1>{t("ErrorPage.title")}</h1>
      <p>{t("ErrorPage.description")}</p>
      <Link className="btn btn-secondary" to="/">{t("ErrorPage.action")}</Link>
    </Card>
  );
}
