import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3002, // Test app port (avoid conflict with student-groups backend on 3001)
  },
});
