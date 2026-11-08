import { SelectedRangeData } from "../office/officeTypes";
import { ExportPayload, ParsedTableResult, ParserOptions } from "./parserTypes";

/**
 * Membungkus data hasil parsing dengan metadata sumber range Excel.
 */
export function buildExportPayload(
  parsed: ParsedTableResult,
  rangeData: SelectedRangeData,
  options: ParserOptions
): ExportPayload {
  return {
    metadata: {
      tool: "Excel Audit Data Tools",
      version: "0.1.0",
      sourceSheet: rangeData.sheetName,
      sourceRange: rangeData.address,
      rowCount: rangeData.rowCount,
      columnCount: rangeData.columnCount,
      exportedAt: new Date().toISOString(),
      hasHeader: options.hasHeader,
      format:
        options.format === "objects" ? "array-of-objects" : "array-of-arrays",
    },
    data: parsed.data,
  };
}

