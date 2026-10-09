"use client";
import { useState } from "react";
import { Sec, Tbl } from "./ui";
import { useLang } from "./LanguageProvider";

const STAGES = [
  { at: "100%", en: "Till 10% beyond target", mr: "Target पेक्षा 10% पर्यंत जास्त", rate: "None", rmr: "काहीही नाही" },
  { at: "110%", en: "10.1% to 40%", mr: "10.1% ते 40%", rate: "35% of Max. Points", rmr: "Max. Points च्या 35%" },
  { at: "140%", en: "40.1% to 80%", mr: "40.1% ते 80%", rate: "75% of Max. Points", rmr: "Max. Points च्या 75%" },
  { at: "180%", en: "80.1% to 100%", mr: "80.1% ते 100%", rate: "100% of Max. Points", rmr: "Max. Points च्या 100%" },
  { at: "200%+", en: "Beyond 100%", mr: "100% हून अधिक", rate: "120% of Max. Points", rmr: "Max. Points च्या 120%" },
];

export default function ExcellenceBonus() {
  const { t } = useLang();
  const [s, setS] = useState(0);
  return (
    <Sec title={t("What Happens When You Go Beyond?", "Target च्या पलीकडे गेलात तर?")} sub={t("The bonus rate rises slab by slab, separately for every index and parameter.", "Bonus दर टप्प्याटप्प्याने वाढतो — प्रत्येक Index व Parameter साठी स्वतंत्र.")}>
      <div className="bar" role="tablist">
        {STAGES.map((x, i) => <button key={i} role="tab" aria-selected={s === i} className={i <= s ? "on" : ""} onClick={() => setS(i)}>{x.at}</button>)}
      </div>
      <div className="out"><small>{t(STAGES[s].en, STAGES[s].mr)}</small><b className="serif">{t(STAGES[s].rate, STAGES[s].rmr)}</b></div>
      <Tbl head={[t("Beyond the target", "Target च्या पलीकडे"), t("Bonus rate", "Bonus दर")]} rows={STAGES.map((x) => [t(x.en, x.mr), t(x.rate, x.rmr)])} />
      <style jsx>{`
        .bar{display:flex;justify-content:center;gap:0;margin:0 auto 20px;max-width:560px}
        .bar button{flex:1;padding:14px 4px;border:0;border-bottom:6px solid var(--peach2);background:transparent;font:600 15px 'Work Sans',sans-serif;color:var(--muted);cursor:pointer;transition:all .25s}
        .bar button.on{border-color:var(--ember);color:var(--ember)}
        .out{margin:0 auto 14px;max-width:520px;padding:22px;background:var(--peach);border:1px solid var(--line);border-radius:18px}
        .out b{display:block;font-size:30px;color:var(--ember);margin-top:4px}
      `}</style>
    </Sec>
  );
}