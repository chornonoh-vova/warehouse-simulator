import { defineConfig } from "vite";

export default defineConfig({
  base: "/warehouse-simulator/",
  esbuild: {
    target: "es2022",
  },
});

