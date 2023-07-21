import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import relativeTime from "dayjs/plugin/relativeTime";

import router from "@/router";
import { store } from "@/store";
import i18n from "@/i18n";

import "@/main.scss";
import "bootstrap";
import "@popperjs/core";

dayjs.extend(relativeTime);
dayjs.locale(i18n.language);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

describe('Apllication', () => {
  it('mounts without errors', () => {
    const wrapper = render(<App />)
    expect(wrapper).toBeTruthy()
  })
})