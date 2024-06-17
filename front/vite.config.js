import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      sass: {
        // You can import sass variables here
        additionalData: `@import "@/styles/_variables.sass"`,
      },
    },
  },
  define: {
    "process.env": dotenv.config().parsed,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 80,
    host: "0.0.0.0",
  },
});
