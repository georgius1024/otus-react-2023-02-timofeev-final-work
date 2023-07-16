import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import english from "@translations/english.json"
import russian from "@translations/russian.json"
const resources = {
  en: {
    translation: english
  },
  ru: {
    translation: russian
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;