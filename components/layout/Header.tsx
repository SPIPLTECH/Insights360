"use client";

import { RefreshCw } from "lucide-react";

interface HeaderStat {
  value: string | number;
  label: string;
}

export default function Header({
  title,
  subtitle,
  stats,
  lastUpdated,
  refreshing,
  onRefresh,
}: {
  title: string;
  subtitle: string;
  stats: HeaderStat[];
  lastUpdated: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <header className="bg-brand-gradient text-white rounded-b-2xl md:rounded-2xl md:mt-4 px-5 py-6 md:px-8 md:py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-xs tracking-widest font-semibold text-white/80 uppercase">Insights360™</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{title}</h1>
          <p className="text-sm text-white/85 mt-1">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/15 rounded-xl px-4 py-2 min-w-[100px] text-center backdrop-blur">
              <div className="text-xl font-bold leading-none">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wide text-white/80 mt-1">{s.label}</div>
            </div>
          ))}
          <button
            onClick={onRefresh}
            className="bg-white/15 hover:bg-white/25 transition-colors rounded-xl px-3 py-2 flex flex-col items-center min-w-[100px]"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            <span className="text-[10px] uppercase tracking-wide text-white/80 mt-1">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "No data yet"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
