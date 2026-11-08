export type ParserFormat = "objects" | "arrays";

export interface ParserOptions {
  hasHeader: boolean;
  format: ParserFormat;
  ignoreEmptyRows: boolean;
}

export interface ParsedTableResult {
  data: Record<string, unknown>[] | unknown[][];
  warnings: string[];
  exportedRowCount: number;
  headers: string[];
}

export interface ExportMetadata {
  tool: string;
  version: string;
  sourceSheet: string;
  sourceRange: string;
  rowCount: number;
  columnCount: number;
  exportedAt: string;
  hasHeader: boolean;
  format: "array-of-objects" | "array-of-arrays";
}

export interface ExportPayload {
  metadata: ExportMetadata;
  data: Record<string, unknown>[] | unknown[][];
}

