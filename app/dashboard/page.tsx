"use client";

import { useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import ErrorState from "@/components/dashboard/ErrorState";
import LoadingSkeleton from "@/components/dashboard/LoadingSkeleton";
import FilterBar from "@/components/filters/FilterBar";
import SheetTable from "@/components/tables/SheetTable";
import { useDashboardData } from "@/lib/useDashboardData";
import BottomNav from "@/components/layout/BottomNav";
import RecommendationTabButton from "@/components/dashboard/RecommendationTabButton";
import RecommendationTable from "@/components/dashboard/RecommendationTable";
import { buildOverallRecommendations } from "@/lib/recommendations";

/**
 * Mirrors the "Home Dashboard" tab of the Google Sheet exactly — same
 * columns, same order, same values (Total Points / Bonus Points / Level
 * are that tab's own formula cells, read as-is). Nothing is calculated
 * here in code.
 *
 * Rank = position of the ALC in the sheet's own order (already sorted),
 * so it stays fixed even when search / district filters are applied.
 */
export default function DashboardPage() {
  const { data, error, loading, refreshing, refresh } = useDashboardData();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [tab, setTab] = useState<"table" | "recommendation">("table");

  const view = data ? data.views.home : null;
  const districtColIndex = view ? view.columns.findIndex((c) => /^district$/i.test(c.field)) : -1;

  const districts = useMemo(() => {
    if (!view || districtColIndex < 0) return [];
    return Array.from(new Set(view.rows.map((r) => r.cells[districtColIndex]).filter(Boolean))).sort();
  }, [view, districtColIndex]);

  // ALC Code -> Rank (1, 2, 3, ...) based on original sheet order
  const rankMap = useMemo(() => {
    const m = new Map<string, number>();
    view?.rows.forEach((r, i) => m.set(r.alcCode, i + 1));
    return m;
  }, [view]);

  const filtered = useMemo(() => {
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

  // Overall Recommendation also gets each ALC's Index 1-4 counts
  // (admissions etc.) — read from the same live data, refreshed on every poll.
  const recommendations = useMemo(
    () =>
      view && data
        ? buildOverallRecommendations(view, {
            index1: data.views.index1,
            index2: data.views.index2,
            index3: data.views.index3,
            index4: data.views.index4,
          })
        : [],
    [view, data]
  );

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
  if (!data || !view) return null;

  return (
    <div className="pb-6">
      <Header />

      <div className="px-4 md:px-0 mt-6">
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
                  label="Overall Recommendation"
                  active={tab === "recommendation"}
                  onClick={() => setTab(tab === "recommendation" ? "table" : "recommendation")}
                />
              }
            />
            <p className="text-xs text-slate-400">
              Showing {tab === "recommendation" ? filteredRecommendations.length : filtered.length} of{" "}
              {view.rows.length} ALCs
            </p>
          </div>
          {tab === "recommendation" ? (
            <RecommendationTable rows={filteredRecommendations} title="Recommendation" overall />
          ) : (
            <SheetTable
              columns={view.columns}
              rows={filtered}
              hideEligibilityColumn
              hideBonusColumn
              hideTotalCap
              hidePointsLabel
              showRank
              rankMap={rankMap}
            />
          )}
          <BottomNav />
        </div>
      </div>
    </div>
  );
}