import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "@/store";
import { useSelector } from "react-redux";

function PrivateRoute(props: PropsWithChildren) {
  const location = useLocation();
  const auth = useSelector(
    (state: RootState) => state.auth?.auth
  );
  const user = useSelector((state: RootState) => state.auth?.user);
  if (auth) {
    if (user) {
      return <> {props.children} </>;
    }
    if (location.pathname === "/profile") {
      return <> {props.children} </>;
    }
    return <Navigate to="/profile" />;
  }
  return <Navigate to="/login" />;
}

export default PrivateRoute;
