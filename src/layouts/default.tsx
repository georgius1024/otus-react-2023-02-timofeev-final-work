import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import AlertsPanel from "@/components/AlertsPanel";
import BusyStatePanel from "@/components/BusyStatePanel";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store";
import type { Auth } from "@/types";
import { logout } from "@/store/auth";

export default function DefaultLayout(props: PropsWithChildren) {
  const auth = useSelector((state: RootState) => state.auth?.auth);
  const user = useSelector((state: RootState) => state.auth?.user);
  const admin = useSelector((state: RootState) => state.auth?.auth?.access);
  const { t, i18n } = useTranslation();

  function ProfileLinks(auth: Auth | undefined) {
    const profileName = user?.name || auth?.email;
    const dispatch = useDispatch();
    if (auth) {
      return (
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
          <div className="dropdown-menu bg-white" style={{minWidth: '10rem'}}>
            <Link className="dropdown-item text-dark" to="/profile">
              Profile
            </Link>
            <Link className="dropdown-item text-dark" to="/stats">
              Stats
            </Link>
            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item text-dark"
              to="/login"
              onClick={() => dispatch(logout())}
            >
              Logout
            </Link>
          </div>
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

  type LocaleItem = {
    lang: string;
    flag: string;
  };

  function languageSelector() {
    const current = i18n.language;

    const locales: LocaleItem[] = [
      { lang: "en", flag: "🇺🇸" },
      { lang: "ru", flag: "🇷🇺" },
    ];

    const currentLocale =
      locales.find((e) => e.lang === current) || locales.at(0);

    const setLocale = (locale: LocaleItem) => {
      i18n.changeLanguage(locale.lang);
    };
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
            <span className="bg-light p-1">
            {currentLocale?.flag}
            </span>
          </a>
          <div className="dropdown-menu bg-white dropdown-menu-light"  style={{minWidth: '1rem'}}>
            {locales.map((locale) => {
              return (
                <div
                  className="dropdown-item text-light"
                  key={locale.flag}
                  onClick={() => setLocale(locale)}
                >
                  {locale.flag}
                </div>
              );
            })}
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
            {t('layout.default.start')}
          </Link>
          <ul className="navbar-nav flex-row flex-grow-1">
            <li className={classNames("nav-item me-3", { "d-none": !admin })}>
              <Link className="text-light" to="/module">
                Modules
              </Link>
            </li>
            <li className={classNames("nav-item me-3", { "d-none": !admin })}>
              <Link className="text-light" to="/students">
                Students
              </Link>
            </li>
            <li className={classNames("nav-item me-3", { "d-none": !auth })}>
              <Link className="text-light" to="/learning">
                Learning
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav flex-row">{ProfileLinks(auth)}</ul>
          {languageSelector()}
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
