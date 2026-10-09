"use client";
import { useEffect, useState } from "react";
import { Flower, Flower2, Leaf, Sprout, Clover, Sparkles } from "lucide-react";
import ImageCarousel from "@/components/home/ImageCarousel";
import { useLang } from "./LanguageProvider";

export type GlanceRow = {
  district: string;
  idx: [number, number, number, number]; // ALCs cleared in Index 1..4
  awards: { platinum: number; gold: number; silver: number; bronze: number };
};
const DISTRICTS = ["Nagpur", "Chandrapur", "Bhandara", "Gondia", "Gadchiroli", "Wardha"];
const EMPTY: GlanceRow[] = DISTRICTS.map((district) => ({ district, idx: [0, 0, 0, 0], awards: { platinum: 0, gold: 0, silver: 0, bronze: 0 } }));

// >>> Only this function changes when you connect the dashboard data <<<
async function loadGlance(): Promise<GlanceRow[]> {
  const r = await fetch("/api/dashboard-summary", { cache: "no-store" });
  if (!r.ok) throw new Error("load failed");
  return r.json();
}

export default function Hero() {
  const { t } = useLang();
  const [rows, setRows] = useState(EMPTY);
  const [state, setState] = useState<"load" | "ok" | "err">("load");
  useEffect(() => { loadGlance().then((d) => { setRows(d); setState("ok"); }).catch(() => setState("err")); }, []);
  const cell = (n: number) => (state === "load" ? "…" : n);

  return (
    <>
      <section className="carousel"><ImageCarousel /></section>

      <section className="title">
        <div className="deco l" aria-hidden><Leaf size={90} strokeWidth={1.3} /><Sprout size={54} strokeWidth={1.3} /><Leaf size={40} strokeWidth={1.3} /></div>
        <div className="deco r" aria-hidden><Flower2 size={80} strokeWidth={1.3} /><Flower size={50} strokeWidth={1.3} /><Clover size={36} strokeWidth={1.3} /></div>
        <h1 className="serif">VIDARBHA EAST<br />RACE TO RECOGNITION</h1>
        <p className="tag">Together Towards Excellence · Together Towards Growth</p>
        <span className="glance"><Sparkles size={16} /> {t("All at a Glance", "एका दृष्टिक्षेपात")}</span>
      </section>

      <section className="tablewrap">
        <div className="tw">
          <table className="g">
            <thead>
              <tr>
                <th>{t("Districts", "जिल्हे")}</th>
                {[1, 2, 3, 4].map((n) => <th key={n}>Index {n}<small>{t("No. of ALC Cleared", "पूर्ण केलेले ALC")}</small></th>)}
                <th>Award Level<small>{t("No. of ALC Cleared & Which", "ALC संख्या व कोणते")}</small></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.district}>
                  <td className="d">{r.district}</td>
                  {r.idx.map((v, i) => <td key={i}>{cell(v)}</td>)}
                  <td className="aw">
                    <i className="p">P {cell(r.awards.platinum)}</i><i className="go">G {cell(r.awards.gold)}</i>
                    <i className="s">S {cell(r.awards.silver)}</i><i className="b">B {cell(r.awards.bronze)}</i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {state === "err" && <p className="note">{t("Data could not be loaded. Please try again later.", "डेटा लोड होऊ शकला नाही. कृपया नंतर प्रयत्न करा.")}</p>}
      </section>

      <style jsx>{`
        .carousel{height:clamp(260px,46vw,620px);overflow:hidden}
        .title{position:relative;text-align:center;padding:44px 24px 10px}
        h1{font-size:clamp(30px,6vw,60px);font-weight:700;line-height:1.05}
        .tag{font-style:italic;color:var(--ember);margin:12px 0 22px}
        .glance{display:inline-flex;gap:8px;align-items:center;padding:9px 20px;border-radius:12px;background:#D8F3E0;border:2px solid #9FD8B0;font-weight:600;font-size:15px}
        .deco{position:absolute;top:30px;display:flex;flex-direction:column;gap:16px;color:var(--ember);animation:sway 7s ease-in-out infinite;transform-origin:50% 100%}
        .deco.l{left:5%;color:var(--leaf)}.deco.r{right:5%;animation-delay:-3s}
        .deco.l :global(svg:nth-child(2)),.deco.r :global(svg:nth-child(2)){margin-left:34px}
        @keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        .tablewrap{max-width:1180px;margin:0 auto;padding:18px 24px 70px}
        .g{width:100%;min-width:720px;border-collapse:separate;border-spacing:0;border:3px solid #9FD8B0;border-radius:18px;overflow:hidden;background:#FFF1CC;font-size:15px}
        .g th{background:#FFD27A;padding:14px 12px;font-family:'Fraunces',serif;font-weight:600;font-size:16px;border-bottom:2px solid #9FD8B0;border-right:2px solid #9FD8B0}
        .g th:last-child{background:#FFE3A0;border-right:0}
        .g th small{display:block;font:400 10.5px 'Work Sans',sans-serif;color:var(--dim);margin-top:2px}
        .g td{padding:13px 12px;text-align:center;border-bottom:1px solid rgba(26,19,16,.18);border-right:2px solid #9FD8B0;color:var(--ink);font-weight:500}
        .g td.d{text-align:left;font-weight:600;background:#FFE3A0;padding-left:22px}
        .g td.aw{background:#FFE9B8;border-right:0}
        .g tr:last-child td{border-bottom:0}
        .g tbody tr:hover td:not(.d):not(.aw){background:#FFE3A0}
        .aw i{display:inline-block;font:600 11.5px 'Work Sans',sans-serif;font-style:normal;color:#fff;padding:3px 9px;margin:2px;border-radius:100px}
        .p{background:#5B6B7C}.go{background:#C99A1C}.s{background:#8A8F98}.b{background:#A9642A}
        @media(max-width:900px){.deco{display:none}}
      `}</style>
    </>
  );
}