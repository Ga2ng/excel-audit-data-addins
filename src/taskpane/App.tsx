import React, { useState, useMemo, useCallback } from "react";
import { Header } from "./components/Header";
import { RangeInfo } from "./components/RangeInfo";
import { ParserOptions } from "./components/ParserOptions";
import { DataPreview } from "./components/DataPreview";
import { DownloadButton } from "./components/DownloadButton";
import { readSelectedRange } from "../office/excelReader";
import { SelectedRangeData } from "../office/officeTypes";
import { parseTable } from "../parser/tableParser";
import { buildExportPayload } from "../parser/jsonBuilder";
import { ParserOptions as ParserOptionsType } from "../parser/parserTypes";
import { createExportFilename } from "../utils/fileName";
import { downloadJsonFile } from "../utils/downloadJson";

export const App: React.FC = () => {
  const [rangeData, setRangeData] = useState<SelectedRangeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<ParserOptionsType>({
    hasHeader: true,
    format: "objects",
    ignoreEmptyRows: true,
  });

  const handleReadRange = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await readSelectedRange();
      setRangeData(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal membaca range dari Excel. Pastikan ada sel yang dipilih.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const parsedResult = useMemo(() => {
    if (!rangeData) return null;
    return parseTable(rangeData.values, options);
  }, [rangeData, options]);

  const exportPayload = useMemo(() => {
    if (!rangeData || !parsedResult) return null;
    return buildExportPayload(parsedResult, rangeData, options);
  }, [rangeData, parsedResult, options]);

  const suggestedFilename = useMemo(() => {
    if (!rangeData) return "";
    return createExportFilename(rangeData.sheetName, rangeData.address);
  }, [rangeData]);

  const handleDownload = useCallback(() => {
    if (!exportPayload || !rangeData) return;
    const filename = createExportFilename(rangeData.sheetName, rangeData.address);
    downloadJsonFile(exportPayload, filename);
  }, [exportPayload, rangeData]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Header isMockMode={rangeData?.isMockData} />

      <main className="flex-1 p-3 space-y-3 max-w-md mx-auto w-full">
        <RangeInfo
          rangeData={rangeData}
          isLoading={isLoading}
          error={error}
          onReadRange={handleReadRange}
        />

        <ParserOptions options={options} onChange={setOptions} />

        <DataPreview
          parsedResult={parsedResult}
          exportPayload={exportPayload}
          onRefresh={handleReadRange}
          isLoading={isLoading}
        />

        <DownloadButton
          disabled={!exportPayload || parsedResult?.exportedRowCount === 0}
          suggestedFilename={suggestedFilename}
          onDownload={handleDownload}
        />
      </main>

      <footer className="py-2 px-3 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        Excel Audit Data Tools • localhost:47136
      </footer>
    </div>
  );
};

