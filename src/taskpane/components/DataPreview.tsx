import React, { useState } from "react";
import { ExportPayload, ParsedTableResult } from "../../parser/parserTypes";

interface DataPreviewProps {
  parsedResult: ParsedTableResult | null;
  exportPayload: ExportPayload | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const DataPreview: React.FC<DataPreviewProps> = ({
  parsedResult,
  exportPayload,
  onRefresh,
  isLoading,
}) => {
  const [showFullMetadata, setShowFullMetadata] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewTarget = showFullMetadata
    ? exportPayload
    : parsedResult?.data ?? null;

  const jsonPreviewText = previewTarget
    ? JSON.stringify(previewTarget, null, 2)
    : "";

  const handleCopyJson = async () => {
    if (!exportPayload) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(exportPayload, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard permission errors in restricted webviews
    }
  };

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Data Preview
          </h2>
          {parsedResult && (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {parsedResult.exportedRowCount} records
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 underline disabled:opacity-50"
          >
            Refresh Preview
          </button>
        </div>
      </div>

      {/* Warnings jika ada header kosong atau duplikat */}
      {parsedResult && parsedResult.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-2.5 mb-2.5 space-y-1">
          <div className="text-[11px] font-bold text-amber-800 uppercase">
            Parser Warning
          </div>
          <ul className="list-disc list-inside text-[11px] text-amber-700 space-y-0.5">
            {parsedResult.warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {parsedResult && exportPayload ? (
        <>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showFullMetadata}
                onChange={(e) => setShowFullMetadata(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
              />
              <span>Show export metadata</span>
            </label>

            <button
              type="button"
              onClick={handleCopyJson}
              className="text-[11px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50"
            >
              {copied ? "Copied!" : "Copy JSON"}
            </button>
          </div>

          <pre className="bg-slate-900 text-emerald-300 text-[11px] font-mono p-3 rounded-md overflow-auto max-h-64 leading-relaxed border border-slate-800">
            {jsonPreviewText}
          </pre>
        </>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center text-xs text-slate-400">
          Belum ada data untuk ditampilkan. Klik{" "}
          <strong className="text-slate-600">Read Selected Range</strong> terlebih dahulu.
        </div>
      )}
    </section>
  );
};

