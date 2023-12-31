import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

import router from "@/router";
import { store } from "@/store";
import i18n from "@/i18n";
import ErrorHandler from "@/components/ErrorHandler";

import "@/main.scss";
import "bootstrap";
import "@popperjs/core";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale(i18n.language);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ErrorHandler global={true}>
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>
  </ErrorHandler>
);
