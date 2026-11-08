import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

function getHttpsOptions() {
  const certDir = path.join(os.homedir(), ".office-addin-dev-certs");
  const keyPath = path.join(certDir, "localhost.key");
  const certPath = path.join(certDir, "localhost.crt");

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  return undefined;
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 47136,
    strictPort: true,
    https: getHttpsOptions(),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    host: "localhost",
    port: 47136,
    strictPort: true,
    https: getHttpsOptions(),
  },
});

