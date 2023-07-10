import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import AlertsPanel from "@/components/AlertsPanel";
import BusyStatePanel from "@/components/BusyStatePanel";
import type { RootState } from "@/store";
import type { User } from "@/types";
import { logout } from "@/store/auth";

export default function DefaultLayout(props: PropsWithChildren) {
  const user = useSelector((state: RootState) => state.auth?.user);
  const admin = useSelector((state: RootState) => state.auth?.user?.access);
  function ProfileLinks(user: User | undefined) {
    const dispatch = useDispatch();
    if (user) {
      return (
        <li className="nav-item me-2">
          <Link
            className="text-light"
            to="/login"
            onClick={() => dispatch(logout())}
          >
            Logout
          </Link>
        </li>
      );
    } else {
      return (
        <>
          <li className="nav-item me-2">
            <Link className="text-light" to="/login">
              Login
            </Link>
          </li>
          <li className="nav-item me-2">
            <Link className="text-light" to="/register">
              Register
            </Link>
          </li>
        </>
      );
    }
  }

  return (
    <div className="container-lg position-relative" style={{ height: "100vh" }}>
      <nav className="navbar bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Start
          </Link>
          <ul className="navbar-nav flex-row flex-grow-1">
            <li className={classNames("nav-item me-3", { "d-none": !admin })}>
              <Link className="text-light" to="/module">
                Modules
              </Link>
            </li>
            <li className={classNames("nav-item me-3", { "d-none": !user })}>
              <Link className="text-light" to="/learning">
                Learning
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav flex-row">{ProfileLinks(user)}</ul>
        </div>
      </nav>
      <AlertsPanel />
      <BusyStatePanel />
      {props.children}
      <nav
        className="navbar bg-secondary position-absolute"
        data-bs-theme="dark"
        style={{ bottom: "0", width: "100%" }}
      >
        <div className="container-fluid">
          <a
            href="https://github.com/georgius1024"
            target="_blank"
            className="text-light"
          >
            (c) 2023 Diligent student
          </a>
        </div>
      </nav>
    </div>
  );
}
