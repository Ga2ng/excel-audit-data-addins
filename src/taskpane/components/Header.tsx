import React from "react";

interface HeaderProps {
  isMockMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isMockMode }) => {
  return (
    <header className="bg-emerald-700 text-white px-4 py-3.5 shadow-sm border-b border-emerald-800">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-sm font-bold tracking-wide uppercase">
            Excel Audit Data Tools
          </h1>
          <p className="text-xs text-emerald-100 mt-0.5">
            Excel Data → JSON Exporter (v0.1)
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-800 text-emerald-100 border border-emerald-600">
          {isMockMode ? "Browser Mode" : "Excel Connected"}
        </span>
      </div>
    </header>
  );
};

