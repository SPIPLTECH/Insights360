"use client";

import { useState } from "react";
import { PageTitle } from "./ui";

export default function ExportView({ district }: { district: string }) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  async function handleExport() {
    setExporting(true);
    setError("");
    try {
      const res = await fetch("/api/dcu/export", { cache: "no-store" });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error?.message || "Export failed. Please try again.");
      }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="([^"]+)"/);
      const filename = match ? match[1] : `${district}_Insights360_Export.xlsx`;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageTitle title="Export Data of Dashboard" subtitle={`Download the ${district} district dashboard data as an Excel file.`} />
      {error ? <p className="text-sm rounded-xl bg-rose-50 text-rose-600 px-3 py-2 mb-3">{error}</p> : null}
      <button
        onClick={handleExport}
        disabled={exporting}
        className="bg-brand-gradient text-white font-semibold text-sm rounded-xl px-6 py-2.5 disabled:opacity-60"
      >
        {exporting ? "Preparing file…" : "Download Excel"}
      </button>
    </div>
  );
}
