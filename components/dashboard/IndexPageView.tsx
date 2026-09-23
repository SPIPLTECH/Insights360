"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import ErrorState from "@/components/dashboard/ErrorState";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import FilterBar from "@/components/filters/FilterBar";
import SheetTable from "@/components/tables/SheetTable";
import { useDashboardData } from "@/lib/useDashboardData";
import BottomNav from "../layout/BottomNav";
import RecommendationTabButton from "@/components/dashboard/RecommendationTabButton";
import RecommendationTable from "@/components/dashboard/RecommendationTable";
import { buildIndexRecommendations } from "@/lib/recommendations";

const INDEX_LABEL: Record<string, string> = {
  index1: "Index 1",
  index2: "Index 2",
  index3: "Index 3",
  index4: "Index 4",
};

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
  const [tab, setTab] = useState<"table" | "recommendation">("table");

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

  const recommendations = useMemo(() => (view ? buildIndexRecommendations(view) : []), [view]);

  const filteredRecommendations = useMemo(() => {
    if (!view) return [];
    return recommendations.filter((rec) => {
      const row = view.rows.find((r) => r.alcCode === rec.alcCode);
      const rowDistrict = row && districtColIndex >= 0 ? row.cells[districtColIndex] : "";
      const matchesSearch =
        !search ||
        rec.alcCode.toLowerCase().includes(search.toLowerCase()) ||
        rec.alcName.toLowerCase().includes(search.toLowerCase());
      const matchesDistrict = !district || rowDistrict === district;
      return matchesSearch && matchesDistrict;
    });
  }, [view, recommendations, search, district, districtColIndex]);

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refresh} />;
  if (!data || !stats || !view) return null;

  return (
    <div className="pb-6">
      
        <Header />

     

      <div className="px-4 md:px-0 mt-4">
        <div className="card">
          <div className="bg-white rounded-t-2xl p-4 border-b border-slate-100 space-y-3">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              district={district}
              onDistrictChange={setDistrict}
              districts={districts}
              tabSlot={
                <RecommendationTabButton
                  label={`${INDEX_LABEL[indexKey]} Recommendations`}
                  active={tab === "recommendation"}
                  onClick={() => setTab(tab === "recommendation" ? "table" : "recommendation")}
                />
              }
            />
            <p className="text-xs text-slate-400">
              Showing{" "}
              {tab === "recommendation" ? filteredRecommendations.length : filteredRows.length} of{" "}
              {view.rows.length} ALCs
            </p>
          </div>
          {tab === "recommendation" ? (
            <RecommendationTable
              rows={filteredRecommendations}
              title={`${INDEX_LABEL[indexKey]} Recommendation`}
            />
          ) : (
            <SheetTable columns={view.columns} rows={filteredRows} />
          )}
            <BottomNav />
        </div>
      </div>
    </div>
  );
}