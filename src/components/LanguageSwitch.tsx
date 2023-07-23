type LanguageSwitchProps = {
  current: string;
  onSelect: (locale: string) => void;
};

type LocaleItem = {
  lang: string;
  flag: string;
};

export default function LanguageSwitch(props: LanguageSwitchProps) {
  const locales: LocaleItem[] = [
    { lang: "en", flag: "🇺🇸" },
    { lang: "ru", flag: "🇷🇺" },
  ];
  const currentLocale =
    locales.find((e) => e.lang === props.current.slice(0, 2)) || locales.at(0);

  
  return (
    <ul className="navbar-nav flex-row my-2">
      <li className="nav-item dropdown" role="menu">
        <a
          className="nav-link dropdown-toggle text-light"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
        >
          <span className="bg-light p-1">{currentLocale?.flag}</span>
        </a>
        <div
          className="dropdown-menu bg-white dropdown-menu-light"
          style={{ minWidth: "1rem" }}
        >
          {locales.map((locale) => {
            return (
              <div
                className="dropdown-item text-light"
                key={locale.flag}
                role="menuitem"
                onClick={() => props.onSelect(locale.lang)}
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
