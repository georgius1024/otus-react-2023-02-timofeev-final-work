import { PropsWithChildren } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type ErrorFallbackProps = {
  error: Error, resetErrorBoundary: () => void
};

function ErrorFallback(props: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <div className="vw-100 vh-100 vw-100 z-3 d-flex justify-content-center position-fixed top-0 start-0 align-items-center text-opacity-50 pe-none">
      <div className="card text-bg-warning mb-3 pe-auto">
        <div className="card-body">
          <h5 className="card-title">{t("ErrorPage.title")}</h5>
          <p className="card-text">{t("ErrorPage.description")}</p>
          <Link to="/" onClick={props.resetErrorBoundary} role="button" className="btn btn-outline-primary w-100">
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
