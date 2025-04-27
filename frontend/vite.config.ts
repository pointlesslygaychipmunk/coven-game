import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(root, "src"),
      "@ui": resolve(root, "src/components/ui"),
      "@shared": resolve(root, "../shared/src"),
      "@lib": resolve(root, "src/lib"),
    },
  },
});
