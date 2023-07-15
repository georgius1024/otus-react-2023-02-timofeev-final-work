import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";
import type { Auth } from "@/types";
import { useSelector } from "react-redux";

function PrivateRoute(props: PropsWithChildren) {
  const user: Auth | undefined = useSelector(
    (state: RootState) => state.auth?.user
  );
  if (user) {
    return <> {props.children} </>;
  }
  return <Navigate to="/login" />;
}

export default PrivateRoute;
