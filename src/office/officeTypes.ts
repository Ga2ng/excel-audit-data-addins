export type CellValue = string | number | boolean | null;

export interface SelectedRangeData {
  sheetName: string;
  address: string;
  rowCount: number;
  columnCount: number;
  values: CellValue[][];
  isMockData?: boolean;
}

