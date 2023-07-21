import { PropsWithChildren, useEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";

function ErrorFallback() {
  return null;
}

export default function ErrorHandler(props: PropsWithChildren) {
  const navigate = useNavigate()
  const globalErrorHandler = useCallback(
    (error: ErrorEvent) => {
      error.stopPropagation();
      error.preventDefault();
      console.log('Error captured')
      console.error(error)
      navigate('/error')
    }, 
  [navigate])
  useEffect(() => {
    window.addEventListener('error', globalErrorHandler)
    return () => window.removeEventListener('error', globalErrorHandler)
  }, [globalErrorHandler])
  const logError = (error: Error) => {throw new Error(error.message)};
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {props.children}
    </ErrorBoundary>
  );
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {props.children}
    </ErrorBoundary>
  );
}
