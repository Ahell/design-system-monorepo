import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3020,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
