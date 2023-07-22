import { useCallback } from "react";
import { useErrorBoundary } from "react-error-boundary";

export default function useErrorHandler() {
  const { showBoundary } = useErrorBoundary();
  return useCallback(
    function (error: unknown) {
      showBoundary(error);
    },
    [showBoundary]
  );
}
