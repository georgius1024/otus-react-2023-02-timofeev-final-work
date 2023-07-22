import { PropsWithChildren, useEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ErrorPanel from "@/components/ErrorPanel";

type ErrorHandlerProps = {
  global?: boolean;
};

function GlobalErrorHandler() {
  const unhandledRejectionHandler = useCallback(
    (error: PromiseRejectionEvent) => {
      error.stopPropagation();
      error.preventDefault();
      console.log("Unhandler rejection captured");
      console.error(error);
      window.location.href = "/error";
    },
    []
  );
  useEffect(() => {
    window.addEventListener("unhandledrejection", unhandledRejectionHandler);
    return () =>
      window.removeEventListener(
        "unhandledrejection",
        unhandledRejectionHandler
      );
  }, [unhandledRejectionHandler]);

  return null;
}

export default function ErrorHandler(
  props: PropsWithChildren<ErrorHandlerProps>
) {
  const logError = console.error;
  return (
    <ErrorBoundary FallbackComponent={ErrorPanel} onError={logError}>
      {props.global && <GlobalErrorHandler />}
      {props.children}
    </ErrorBoundary>
  );
}
