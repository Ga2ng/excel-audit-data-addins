import React from "react";
import { SelectedRangeData } from "../../office/officeTypes";

interface RangeInfoProps {
  rangeData: SelectedRangeData | null;
  isLoading: boolean;
  error: string | null;
  onReadRange: () => void;
}

export const RangeInfo: React.FC<RangeInfoProps> = ({
  rangeData,
  isLoading,
  error,
  onReadRange,
}) => {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Selected Range
        </h2>
        {rangeData && (
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {rangeData.rowCount} rows × {rangeData.columnCount} columns
          </span>
        )}
      </div>

      {rangeData ? (
        <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2 mb-3">
          <div className="text-xs text-slate-500">Worksheet & Range</div>
          <div className="text-sm font-mono font-semibold text-slate-800 break-all">
            {rangeData.sheetName}!{rangeData.address}
          </div>
          {rangeData.isMockData && (
            <p className="text-[11px] text-amber-700 mt-1">
              *Menampilkan data simulasi karena dibuka di luar aplikasi Excel.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-md px-3 py-3 mb-3 text-center">
          <p className="text-xs text-slate-500">
            Pilih/blok tabel di worksheet Excel, lalu tekan tombol di bawah.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-md p-2.5 mb-3">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onReadRange}
        disabled={isLoading}
        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-1.5"
      >
        {isLoading ? "Reading Range..." : "Read Selected Range"}
      </button>
    </section>
  );
};

