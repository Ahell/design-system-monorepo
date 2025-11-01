import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "index.js",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: ["lit"],
      output: {
        preserveModules: true,
        preserveModulesRoot: ".",
      },
    },
  },
});
