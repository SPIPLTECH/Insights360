"use client";

import type { ReactNode } from "react";
import { Search } from "lucide-react";
import BackToHomeButton from "@/components/layout/BackToHomeButton";

export default function FilterBar({
  search,
  onSearchChange,
  district,
  onDistrictChange,
  districts,
  placeholder = "Search by ALC Code or ALC Name...",
  tabSlot,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  districts: string[];
  placeholder?: string;
  /** Optional element rendered just to the left of the "All Districts" dropdown. */
  tabSlot?: ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-sm"
        />
      </div>
      {/* Search bar ke right me — har page (Home Dashboard + Index 1-4) par */}
      <BackToHomeButton />
      {tabSlot}
      {districts.length > 0 && (
        <select
          value={district}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
        >
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}