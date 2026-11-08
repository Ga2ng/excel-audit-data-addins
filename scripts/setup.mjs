import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const manifestPath = path.join(rootDir, "manifest", "manifest.xml");

// Folder Network Share Trusted Catalog yang sudah aktif di laptop Anda (\\LAPTOP-7HUHP4CR\WordAddins)
const sharedCatalogDir = "C:\\WordAddins";
const sharedManifestTarget = path.join(
  sharedCatalogDir,
  "excel-audit-data-tools-manifest.xml"
);

console.log("========================================================");
console.log("  SETUP EXCEL AUDIT DATA TOOLS (https://localhost:47136)");
console.log("========================================================\n");

try {
  console.log("[1/3] Menginstal sertifikat SSL lokal (office-addin-dev-certs)...");
  console.log("      (Jika muncul pop-up Security Warning dari Windows, klik YES)\n");
  execSync("npx office-addin-dev-certs install", {
    cwd: rootDir,
    stdio: "inherit",
  });
} catch (err) {
  console.warn("\n[WARN] Peringatan saat instalasi sertifikat SSL:", err.message);
}

try {
  console.log("\n[2/3] Mendaftarkan manifest ke Shared Folder Catalog (C:\\WordAddins)...");
  if (!fs.existsSync(sharedCatalogDir)) {
    fs.mkdirSync(sharedCatalogDir, { recursive: true });
  }
  fs.copyFileSync(manifestPath, sharedManifestTarget);
  console.log(`      Manifest berhasil disalin ke: ${sharedManifestTarget}`);
  console.log("      (Otomatis terbaca oleh Trusted Catalog: \\\\LAPTOP-7HUHP4CR\\WordAddins)");

  // Pastikan juga terdaftar di WEF Developer & TrustedCatalogs Flags=1 (Show in Menu)
  execSync(
    `reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\WEF\\Developer" /v "ExcelAuditDataTools" /t REG_SZ /d "${manifestPath}" /f`,
    { stdio: "ignore" }
  );
  execSync(
    `reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\WEF\\TrustedCatalogs\\{C44D1B38-F2FE-48FD-9106-AFAE06528634}" /v "Flags" /t REG_DWORD /d 1 /f`,
    { stdio: "ignore" }
  );
} catch (err) {
  console.warn("\n[WARN] Gagal menyalin manifest ke Shared Folder:", err.message);
}

try {
  console.log("\n[3/3] Mengaktifkan tab 'Developer' di Ribbon Excel...");
  execSync(
    `reg add "HKCU\\Software\\Microsoft\\Office\\16.0\\Excel\\Options" /v "DeveloperTools" /t REG_DWORD /d 1 /f`,
    { stdio: "ignore" }
  );
  console.log("      Tab 'Developer' Excel sudah aktif.");
} catch {
  // Abaikan jika gagal
}

console.log("\n========================================================");
console.log("  SETUP SELESAI!");
console.log("  Cara memunculkan di Excel:");
console.log("  1. Jalankan: npm run start  (atau npm run dev)");
console.log("  2. Di Excel, klik menu: Developer > Add-ins > tab SHARED FOLDER");
console.log("  3. Pilih 'Excel Audit Data Tools' > klik Add.");
console.log("  4. Tombol 'Excel Audit Data Tools' akan muncul di tab HOME (pojok kanan)!");
console.log("========================================================\n");
