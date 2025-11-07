import { defineConfig } from "vite";

// This config is ONLY for building the design-system for production/publishing
// During development, apps should use the source files directly via workspace:*
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
