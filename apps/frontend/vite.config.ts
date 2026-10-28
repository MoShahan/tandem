import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname), "VITE_");
  const apiUrl = process.env.VITE_API_URL || env.VITE_API_URL;

  if (mode === "production" && !apiUrl) {
    throw new Error(
      "VITE_API_URL must be set for a production build. Vite inlines it at compile time — set it in Vercel (Production and Preview) or in apps/frontend/.env before building.",
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@tandem/shared": path.resolve(__dirname, "../../packages/shared/src"),
      },
    },
  };
});

