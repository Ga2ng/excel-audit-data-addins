import React from "react";

interface DownloadButtonProps {
  disabled: boolean;
  suggestedFilename: string;
  onDownload: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  disabled,
  suggestedFilename,
  onDownload,
}) => {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm space-y-2">
      {suggestedFilename && !disabled && (
        <div className="text-[11px] text-slate-500 truncate">
          File:{" "}
          <span className="font-mono text-slate-700">{suggestedFilename}</span>
        </div>
      )}
      <button
        type="button"
        onClick={onDownload}
        disabled={disabled}
        className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 disabled:text-slate-500 text-white text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
      >
        <span>Download JSON (.json)</span>
      </button>
    </section>
  );
};

