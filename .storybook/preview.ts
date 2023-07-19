import type { Preview } from "@storybook/react";
import "../src/main.scss";
import 'bootstrap';
import "@popperjs/core"

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
