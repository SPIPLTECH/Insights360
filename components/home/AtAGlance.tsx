"use client";

import { useEffect, useState } from "react";

type Lang = "mr" | "en";

export type GlanceRow = {
  district: string;
  idx1: number;
  idx2: number;
  idx3: number;
  idx4: number;
  awards: { platinum: number; gold: number; silver: number; bronze: number };
};

const DISTRICTS = ["Nagpur", "Chandrapur", "Bhandara", "Gondia", "Gadchiroli", "Wardha"];

const emptyRows: GlanceRow[] = DISTRICTS.map((district) => ({
  district,
  idx1: 0, idx2: 0, idx3: 0, idx4: 0,
  awards: { platinum: 0, gold: 0, silver: 0, bronze: 0 },
}));

// change this function -> dashboard data will come
async function loadGlanceData(): Promise<GlanceRow[]> {
  const res = await fetch("/api/dashboard-summary", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load");
  return res.json();
}

export default function AtAGlance({ lang }: { lang: Lang }) {
  const [rows, setRows] = useState<GlanceRow[]>(emptyRows);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadGlanceData()
      .then(setRows)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const tr = (mr: string, en: string) => (lang === "mr" ? mr : en);
  const total = (k: "idx1" | "idx2" | "idx3" | "idx4") => rows.reduce((s, r) => s + r[k], 0);

  return (
    <section className="aag">
      <span className="section-label">{tr("एका दृष्टिक्षेपात", "All at a Glance")}</span>

      <div className="table-wrap">
        <table className="tbl aag-tbl">
          <thead>
            <tr>
              <th>{tr("जिल्हे", "Districts")}</th>
              {[1, 2, 3, 4].map((n) => (
                <th key={n}>
                  Index {n}
                  <small>{tr("पूर्ण केलेले ALC", "No. of ALC Cleared")}</small>
                </th>
              ))}
              <th>
                {tr("Award Level", "Award Level")}
                <small>{tr("ALC संख्या व कोणते", "No. of ALC Cleared & Which")}</small>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.district}>
                <td className="aag-district">{r.district}</td>
                <td>{loading ? "…" : r.idx1}</td>
                <td>{loading ? "…" : r.idx2}</td>
                <td>{loading ? "…" : r.idx3}</td>
                <td>{loading ? "…" : r.idx4}</td>
                <td>
                  <span className="aag-award plat">P {r.awards.platinum}</span>
                  <span className="aag-award gold">G {r.awards.gold}</span>
                  <span className="aag-award silver">S {r.awards.silver}</span>
                  <span className="aag-award bronze">B {r.awards.bronze}</span>
                </td>
              </tr>
            ))}
            <tr className="tbl-total">
              <td>{tr("एकूण", "Total")}</td>
              <td>{total("idx1")}</td>
              <td>{total("idx2")}</td>
              <td>{total("idx3")}</td>
              <td>{total("idx4")}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {error && (
        <p className="index-note">
          {tr("डेटा लोड होऊ शकला नाही. कृपया नंतर प्रयत्न करा.", "Could not load data. Please try again later.")}
        </p>
      )}
    </section>
  );
}