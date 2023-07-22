import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "@/components/Card";

type ErrorPanelProps = {
  error?: Error;
  resetErrorBoundary?: () => void;
};

export default function ErrorPanel(props: ErrorPanelProps) {
  const { t } = useTranslation();
  return (
    <div
      className="row position-fixed top-0 start-0 vw-100 vh-100 pe-none d-flex justify-content-center align-items-center"
      style={{
        zIndex: 999,
        backgroundColor: "#fff7",
        backdropFilter: "blur(2px)",
      }}
    >
      <Card title="Error">
        <div className="d-flex flex-row">
          <div className="text-danger d-flex align-items-center p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
              <path d="M5.5.5a.5.5 0 0 0-1 0V2A2.5 2.5 0 0 0 2 4.5H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2v1H.5a.5.5 0 0 0 0 1H2A2.5 2.5 0 0 0 4.5 14v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14h1v1.5a.5.5 0 0 0 1 0V14a2.5 2.5 0 0 0 2.5-2.5h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14v-1h1.5a.5.5 0 0 0 0-1H14A2.5 2.5 0 0 0 11.5 2V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5a.5.5 0 0 0-1 0V2h-1V.5zm1 4.5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3A1.5 1.5 0 0 1 6.5 5z" />
            </svg>
          </div>
          <div className="ms-4">
            <h1>{t("ErrorPage.title")}</h1>
            <p>{t("ErrorPage.description")}</p>
          </div>
        </div>
        <Link
          className="btn btn-outline-primary  pe-auto w-100"
          to="/"
          onClick={() => props.resetErrorBoundary && props.resetErrorBoundary()}
        >
          {t("ErrorPage.action")}
        </Link>
      </Card>
    </div>
  );
}
