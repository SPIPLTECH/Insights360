"use client";
import { Building2, Trees } from "lucide-react";
import { Sec, Tbl } from "./ui";
import { useLang } from "./LanguageProvider";

const URBAN = [["MS-CIT", 425, 200], ["KLiC", 250, 100], ["CCTP", 150, 50]];
const RURAL = [["MS-CIT", 250, 200], ["KLiC", 125, 100], ["CCTP", 75, 50]];

export default function Index1() {
  const { t } = useLang();
  const head = ["Parameter", "Target", t("Points", "गुण")];
  const total = [t("Total", "एकूण"), "", 350];
  return (
    <Sec id="index-1" tone="tint" title={<><span className="big" style={{ fontSize: "inherit" }}>01</span> / 350 · Business Growth</>} sub={t("Grow the core business. Each ALC is scored only on its own category — Urban or Rural.", "मूळ Business वाढवा. प्रत्येक ALC चे मूल्यांकन त्याच्या Urban किंवा Rural श्रेणीतच होते.")}>
      <div className="grid g2">
        <div><h3 className="h"><Building2 size={20} /> Urban ALC</h3><Tbl head={head} rows={URBAN} total={total} /></div>
        <div><h3 className="h"><Trees size={20} /> Rural ALC</h3><Tbl head={head} rows={RURAL} total={total} /></div>
      </div>
      <p className="note">{t("Evidence: Achievement vs. target — Admission Portal.", "पुरावा: Achievement vs. Target — Admission Portal.")}</p>
      <style jsx>{`.h{display:flex;gap:8px;align-items:center;color:var(--gold);font-size:17px}`}</style>
    </Sec>
  );
}