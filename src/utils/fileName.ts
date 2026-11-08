/**
 * Membuat nama file JSON otomatis berdasarkan nama worksheet, range, dan waktu ekspor.
 * Contoh: excel-audit_Sheet1_A1-H25_20261108-200512.json
 */
export function createExportFilename(sheetName: string, address?: string): string {
  const safeSheet = (sheetName || "Sheet")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  const safeRange = address
    ? "_" + address.replace(/:/g, "-").replace(/[^a-zA-Z0-9_-]/g, "")
    : "";

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
    now.getDate()
  )}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `excel-audit_${safeSheet}${safeRange}_${timestamp}.json`;
}

