// vite.config.ts  – in project root *or* frontend/ folder
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});