import { execSync } from "node:child_process";

console.log("========================================================");
console.log("  MENGHENTIKAN SERVER EXCEL AUDIT DATA TOOLS (47136)");
console.log("========================================================\n");

try {
  const netstatOutput = execSync('netstat -aon | findstr ":47136" | findstr "LISTENING"', {
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "ignore"],
  });

  const lines = netstatOutput
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const pids = new Set();
  for (const line of lines) {
    const parts = line.split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && /^\d+$/.test(pid) && pid !== "0") {
      pids.add(pid);
    }
  }

  if (pids.size === 0) {
    console.log("[INFO] Tidak ada server yang sedang berjalan di port 47136.");
  } else {
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`[OK] Berhasil menghentikan proses server (PID: ${pid}) di port 47136.`);
      } catch {
        // Abaikan jika proses sudah berhenti
      }
    }
  }
} catch {
  console.log("[INFO] Port 47136 sudah bersih (tidak ada server yang aktif).");
}

console.log("\nSelesai.");
