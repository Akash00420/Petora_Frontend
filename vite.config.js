import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // listen on the network, not just localhost
    port: 5173,
    strictPort: true,  // fail instead of silently switching to 5174
  },
});