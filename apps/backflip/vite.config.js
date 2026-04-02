import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3020,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'backflip.whcg.se',
    ],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
