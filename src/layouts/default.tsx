import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import classNames from "classnames";

import AlertsPanel from "@/components/AlertsPanel";
import BusyStatePanel from "@/components/BusyStatePanel";
import LanguageSwitch from "@/components/LanguageSwitch";
import ErrorHandler from "@/components/ErrorHandler";

import type { RootState } from "@/store";
import { logout } from "@/store/auth";

export default function DefaultLayout(props: PropsWithChildren) {
  const auth = useSelector((state: RootState) => state.auth?.auth);
  const user = useSelector((state: RootState) => state.auth?.user);
  const admin = useSelector((state: RootState) => state.auth?.auth?.access);
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    dayjs.locale(lang);
  };
  function LoginLinks() {
    return (
      <ul className="navbar-nav flex-row">
        <li className="nav-item me-2">
          <Link className="text-light" to="/login">
            {t("layout.default.menu.login")}
          </Link>
        </li>
        <li className="nav-item me-2">
          <Link className="text-light" to="/register">
            {t("layout.default.menu.register")}
          </Link>
        </li>
      </ul>
    );
  }

  function ProfileMenu() {
    const profileName = user?.name || auth?.email;
    const dispatch = useDispatch();
    return (
      <ul className="navbar-nav flex-row">
        <li className="nav-item dropdown me-2">
          <a
            className="nav-link dropdown-toggle text-light"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {profileName}
          </a>
          <div className="dropdown-menu bg-white" style={{ minWidth: "10rem" }}>
            <Link className="dropdown-item text-dark" to="/profile">
              {t("layout.default.menu.profile")}
            </Link>
            <Link className="dropdown-item text-dark" to="/stats">
              {t("layout.default.menu.stats")}
            </Link>
            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item text-dark"
              to="/login"
              onClick={() => dispatch(logout())}
            >
              {t("layout.default.menu.logout")}
            </Link>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className="container-lg position-relative" style={{ height: "100vh" }}>
      <nav className="navbar bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="/apple-touch-icon.png"
              alt="logo"
              height="32"
              className="me-3"
            />
          </Link>
          <ul className="navbar-nav flex-row flex-grow-1">
            <li className={classNames("nav-item me-3", { "d-none": !admin })}>
              <Link className="text-light" to="/module">
                {t("layout.default.menu.modules")}
              </Link>
            </li>
            <li className={classNames("nav-item me-3", { "d-none": !admin })}>
              <Link className="text-light" to="/students">
                {t("layout.default.menu.students")}
              </Link>
            </li>
            <li className={classNames("nav-item me-3", { "d-none": !auth })}>
              <Link className="text-light" to="/learning">
                {t("layout.default.menu.learning")}
              </Link>
            </li>
          </ul>
          <div className="me-5">
            <LanguageSwitch current={i18n.language} onSelect={changeLanguage} />
          </div>
          {auth && <ProfileMenu />}
          {!auth && <LoginLinks />}
        </div>
      </nav>
      <AlertsPanel />
      <BusyStatePanel />
      <ErrorHandler>{props.children}</ErrorHandler>
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
            {t("layout.default.copyright")}
          </a>
        </div>
      </nav>
    </div>
  );
}
