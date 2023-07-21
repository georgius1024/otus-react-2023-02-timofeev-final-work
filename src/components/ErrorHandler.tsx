import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ErrorFallback() {
  const { t } = useTranslation();

  return (
    <div className="vw-100 vh-100 vw-100 z-3 d-flex justify-content-center align-items-center">
      <div className="card text-bg-warning mb-3">
        <div className="card-body">
          <h5 className="card-title">{t("ErrorPage.title")}</h5>
          <p className="card-text">{t("ErrorPage.description")}</p>
          <Link to="/" role="button" className="btn btn-outline-primary w-100">
            {t("ErrorPage.action")}
          </Link>
        </div>
      </div>
    </div>
  );
}
export default function ErrorHandler(props: PropsWithChildren) {
  const logError = (error: Error) => console.error("Handled:", error);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {props.children}
    </ErrorBoundary>
  );
}
