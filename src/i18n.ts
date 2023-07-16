import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

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
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

  export default i18n;