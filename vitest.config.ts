import { fileURLToPath, URL } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";
import React from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [React()],
  test: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
      "@translations": fileURLToPath(new URL("./translations", import.meta.url))
    },
    globals: true,
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "**/e2e/**"],
    setupFiles: './.tests/setup.js'
  },
  root: ".", //Define the root
});
