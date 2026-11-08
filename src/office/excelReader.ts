import { SelectedRangeData, CellValue } from "./officeTypes";

/**
 * Membaca range yang sedang dipilih oleh pengguna di worksheet aktif Microsoft Excel.
 * Jika dibuka di browser biasa (di luar Excel), mengembalikan data simulasi agar UI tetap bisa diuji.
 */
export async function readSelectedRange(): Promise<SelectedRangeData> {
  if (typeof Excel !== "undefined" && typeof Excel.run === "function") {
    return await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const range = context.workbook.getSelectedRange();

      sheet.load("name");
      range.load(["address", "rowCount", "columnCount", "values"]);

      await context.sync();

      // Normalisasi sel kosong ("") dari Excel menjadi null secara konsisten
      const normalizedValues: CellValue[][] = (range.values || []).map((row) =>
        row.map((cell) => {
          if (cell === "" || cell === undefined || cell === null) {
            return null;
          }
          return cell as CellValue;
        })
      );

      // Hilangkan prefix nama sheet jika sudah ada di range.address (misal "Sheet1!A1:H25" -> "A1:H25")
      const rawAddress = range.address || "";
      const cleanAddress = rawAddress.includes("!")
        ? rawAddress.split("!").pop() || rawAddress
        : rawAddress;

      return {
        sheetName: sheet.name || "Sheet1",
        address: cleanAddress,
        rowCount: range.rowCount,
        columnCount: range.columnCount,
        values: normalizedValues,
        isMockData: false,
      };
    });
  }

  // Fallback jika dibuka langsung di browser (https://localhost:47136) di luar Excel
  return {
    sheetName: "Sheet1 (Browser Preview)",
    address: "A1:E4",
    rowCount: 4,
    columnCount: 5,
    values: [
      ["Nama Barang", "QTY", "Unit", "Price", "Subtotal"],
      ["ABON 500 gr", 7, "PCK", 72500, 507500],
      ["BANANA SYRUP", 4, "BOTOL", 100000, 400000],
      ["TEPUNG TERIGU 1KG", 12, "BKS", 14500, 174000],
    ],
    isMockData: true,
  };
}

