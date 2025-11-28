import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import checker from "vite-plugin-checker";

import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    checker({
      typescript: true,
    }),
    // Custom plugin to add API routes
    {
      name: 'api-routes',
      configureServer(server) {
        // Import API routes and mount them
        server.middlewares.use('/api', async (req, res, next) => {
          try {
            // Dynamically import the API app
            const { createApiApp } = await import('./server.ts');
            const apiApp = createApiApp();
            apiApp(req, res, next);
          } catch (error) {
            console.error('API route error:', error);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Internal server error' }));
            }
          }
        });
      },
    },
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
