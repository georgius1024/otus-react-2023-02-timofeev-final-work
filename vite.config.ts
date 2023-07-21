import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import tsconfigPaths from 'vite-tsconfig-paths'
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@assets",
        replacement: fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
      {
        find: "@translations",
        replacement: fileURLToPath(new URL("./translations", import.meta.url)),
      },
    ],
  },
  // @ts-ignore
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        "./src/services/*"
      ]
    },
  },  
});
