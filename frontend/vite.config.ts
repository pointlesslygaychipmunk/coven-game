// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // forward any unknown request (like /state, /execute-actions) to your API
    proxy: {
      "/state":          "http://localhost:8080",
      "/execute-actions": "http://localhost:8080",
      "/play-turn":       "http://localhost:8080",
      // you can also do: "^/(?!assets)": "http://localhost:8080"
    },
  },
});