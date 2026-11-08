import { CellValue } from "../office/officeTypes";
import { ParserOptions, ParsedTableResult } from "./parserTypes";

function isRowEmpty(row: CellValue[]): boolean {
  return row.every((cell) => cell === null || cell === undefined || String(cell).trim() === "");
}

/**
 * Mengubah matriks 2D nilai Excel menjadi Array of Objects atau Array of Arrays
 * sesuai aturan Blueprint.md (tanpa mengubah nilai asli, mendeteksi header kosong/duplikat).
 */
export function parseTable(
  values: CellValue[][],
  options: ParserOptions
): ParsedTableResult {
  const warnings: string[] = [];

  if (!values || values.length === 0) {
    return {
      data: [],
      warnings: ["Range yang dipilih kosong."],
      exportedRowCount: 0,
      headers: [],
    };
  }

  // Filter baris kosong jika opsi ignoreEmptyRows aktif
  const filteredRows = options.ignoreEmptyRows
    ? values.filter((row) => !isRowEmpty(row))
    : values;

  if (filteredRows.length === 0) {
    return {
      data: [],
      warnings: ["Seluruh baris pada range yang dipilih kosong."],
      exportedRowCount: 0,
      headers: [],
    };
  }

  // Format: Array of Arrays
  if (options.format === "arrays") {
    const rowsToExport = options.hasHeader ? filteredRows : filteredRows;
    return {
      data: rowsToExport,
      warnings,
      exportedRowCount: rowsToExport.length,
      headers: [],
    };
  }

  // Format: Array of Objects
  const columnCount = filteredRows[0]?.length || 0;
  const resolvedHeaders: string[] = [];
  let dataRows: CellValue[][] = filteredRows;

  if (options.hasHeader) {
    const rawHeaderRow = filteredRows[0];
    dataRows = filteredRows.slice(1);

    const seenHeaders = new Map<string, number>();
    const emptyHeaderColumns: number[] = [];
    const duplicateHeaderNames: string[] = [];

    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
      const rawCell = rawHeaderRow[colIdx];
      let headerName =
        rawCell !== null && rawCell !== undefined && String(rawCell).trim() !== ""
          ? String(rawCell).trim()
          : "";

      if (!headerName) {
        headerName = `Column_${colIdx + 1}`;
        emptyHeaderColumns.push(colIdx + 1);
      }

      const count = seenHeaders.get(headerName) || 0;
      if (count > 0) {
        const uniqueHeaderName = `${headerName}_${count + 1}`;
        duplicateHeaderNames.push(`"${headerName}" → "${uniqueHeaderName}"`);
        seenHeaders.set(headerName, count + 1);
        resolvedHeaders.push(uniqueHeaderName);
      } else {
        seenHeaders.set(headerName, 1);
        resolvedHeaders.push(headerName);
      }
    }

    if (emptyHeaderColumns.length > 0) {
      warnings.push(
        `Header kosong pada kolom ke-${emptyHeaderColumns.join(", ")}. Menggunakan nama fallback (Column_N).`
      );
    }

    if (duplicateHeaderNames.length > 0) {
      warnings.push(
        `Header duplikat terdeteksi dan disesuaikan otomatis: ${duplicateHeaderNames.join(", ")}.`
      );
    }
  } else {
    for (let colIdx = 0; colIdx < columnCount; colIdx++) {
      resolvedHeaders.push(`Column_${colIdx + 1}`);
    }
  }

  const objectsData: Record<string, unknown>[] = dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    for (let colIdx = 0; colIdx < resolvedHeaders.length; colIdx++) {
      const key = resolvedHeaders[colIdx];
      const cellVal = row[colIdx] !== undefined ? row[colIdx] : null;
      obj[key] = cellVal;
    }
    return obj;
  });

  return {
    data: objectsData,
    warnings,
    exportedRowCount: objectsData.length,
    headers: resolvedHeaders,
  };
}

