import path from "path";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDev = mode === "development";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@tests": path.resolve(__dirname, "./__tests__"),
      },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      watch: {
        usePolling: true,
      },
      open: false,
      strictPort: true,
      proxy: {
        "/api/v1": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 3001,
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
      minify: "esbuild",
      target: "ES2022",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
          },
        },
      },
    },
  };
});
