import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "manifest", "manifest.xml");
const sharedCatalogDir = "C:\\WordAddins";
const sharedManifestTarget = path.join(
  sharedCatalogDir,
  "excel-audit-data-tools-manifest.xml"
);

const openExcel = !process.argv.includes("--no-excel");

console.log("========================================================");
console.log("  EXCEL AUDIT DATA TOOLS — https://localhost:47136");
console.log("  Tekan [Ctrl + C] kapan saja untuk mematikan server");
console.log("========================================================\n");

// 1. Sinkronkan manifest terbaru ke Shared Folder Catalog (C:\WordAddins) & Registry
try {
  if (fs.existsSync(sharedCatalogDir)) {
    fs.copyFileSync(manifestPath, sharedManifestTarget);
  }
  const regCmd = `reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\WEF\\Developer" /v "ExcelAuditDataTools" /t REG_SZ /d "${manifestPath}" /f`;
  execSync(regCmd, { stdio: "ignore" });
} catch {
  // Abaikan jika gagal
}

// 2. Buka Microsoft Excel secara otomatis jika dijalankan lewat 'npm run start'
if (openExcel) {
  try {
    console.log("[INFO] Membuka Microsoft Excel Desktop...");
    execSync('start "" excel.exe', { stdio: "ignore", shell: "cmd.exe" });
  } catch {
    console.log("[INFO] Silakan buka aplikasi Microsoft Excel secara manual.");
  }
}

// 3. Jalankan Vite server di foreground (agar Ctrl + C langsung mematikan server)
const viteProcess = spawn("npx", ["vite", "--port", "47136", "--strictPort"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
});

function shutdown() {
  console.log("\n[INFO] Mematikan server https://localhost:47136 (Ctrl + C)...");
  if (viteProcess && !viteProcess.killed) {
    viteProcess.kill("SIGINT");
  }
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

viteProcess.on("exit", (code) => {
  process.exit(code ?? 0);
});
