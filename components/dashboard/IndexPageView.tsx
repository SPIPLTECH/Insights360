"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import ErrorState from "@/components/dashboard/ErrorState";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import FilterBar from "@/components/filters/FilterBar";
import SheetTable from "@/components/tables/SheetTable";
import { useDashboardData } from "@/lib/useDashboardData";

export default function IndexPageView({
  indexKey,
  title,
  description,
  sourceLabel,
}: {
  indexKey: "index1" | "index2" | "index3" | "index4";
  title: string;
  description: string;
  sourceLabel: string;
}) {
  const { data, error, loading, refreshing, refresh } = useDashboardData();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");

  const stats = data ? data[indexKey] : null;
  const view = data ? data.views[indexKey] : null;

  const districts = useMemo(
    () => Array.from(new Set(stats?.records.map((r) => r.district).filter(Boolean))).sort(),
    [stats]
  );

  const districtColIndex = view ? view.columns.findIndex((c) => /^district$/i.test(c.field)) : -1;

  const filteredRows = useMemo(() => {
    if (!view) return [];
    return view.rows.filter((row) => {
      const rowDistrict = districtColIndex >= 0 ? row.cells[districtColIndex] : "";
      const matchesSearch =
        !search ||
        row.alcCode.toLowerCase().includes(search.toLowerCase()) ||
        row.cells.some((c) => c.toLowerCase().includes(search.toLowerCase()));
      const matchesDistrict = !district || rowDistrict === district;
      return matchesSearch && matchesDistrict;
    });
  }, [view, search, district, districtColIndex]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!data || !stats || !view) return null;

  return (
    <div className="pb-6">
      <Header
        title={title}
        subtitle={description}
        stats={[
          { value: stats.totalAlcs, label: "Total ALCs" },
          { value: `${stats.eligiblePercent}%`, label: "Eligible" },
        ]}
        lastUpdated={data.fetchedAt}
        refreshing={refreshing}
        onRefresh={refresh}
      />

      <div className="px-4 md:px-0 mt-3">
        <span className="inline-block text-xs font-medium bg-slate-100 text-slate-500 rounded-full px-3 py-1">
          Data source: {sourceLabel}
        </span>
      </div>

      <div className="px-4 md:px-0 mt-4">
        <div className="card">
          <div className="bg-white rounded-t-2xl p-4 border-b border-slate-100 space-y-3">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              district={district}
              onDistrictChange={setDistrict}
              districts={districts}
            />
            <p className="text-xs text-slate-400">
              Showing {filteredRows.length} of {view.rows.length} ALCs
            </p>
          </div>
          <SheetTable columns={view.columns} rows={filteredRows} />
        </div>
      </div>
    </div>
  );
}
