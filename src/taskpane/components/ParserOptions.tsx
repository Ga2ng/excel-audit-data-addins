import React from "react";
import { ParserFormat, ParserOptions as ParserOptionsType } from "../../parser/parserTypes";

interface ParserOptionsProps {
  options: ParserOptionsType;
  onChange: (updated: ParserOptionsType) => void;
}

export const ParserOptions: React.FC<ParserOptionsProps> = ({
  options,
  onChange,
}) => {
  const handleToggleHeader = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...options,
      hasHeader: e.target.checked,
    });
  };

  const handleToggleIgnoreEmpty = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...options,
      ignoreEmptyRows: e.target.checked,
    });
  };

  const handleFormatChange = (format: ParserFormat) => {
    onChange({
      ...options,
      format,
    });
  };

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Parser Options
      </h2>

      <div className="space-y-2">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={options.hasHeader}
            onChange={handleToggleHeader}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs font-medium text-slate-700">
            First row is header
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={options.ignoreEmptyRows}
            onChange={handleToggleIgnoreEmpty}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs font-medium text-slate-700">
            Ignore empty rows
          </span>
        </label>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-600 mb-2">
          JSON Structure:
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="jsonFormat"
              checked={options.format === "objects"}
              onChange={() => handleFormatChange("objects")}
              className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700">
              Array of objects{" "}
              <span className="text-[11px] text-slate-400 font-mono">
                {`[{ "Col": "Val" }]`}
              </span>
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="jsonFormat"
              checked={options.format === "arrays"}
              onChange={() => handleFormatChange("arrays")}
              className="h-4 w-4 border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-700">
              Array of arrays{" "}
              <span className="text-[11px] text-slate-400 font-mono">
                {`[["Col"], ["Val"]]`}
              </span>
            </span>
          </label>
        </div>
      </div>
    </section>
  );
};

