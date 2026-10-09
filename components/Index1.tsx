"use client";

import { businessGrowthRural, businessGrowthUrban } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import IndexShell from "./IndexShell";
import s from "./site.module.css";
import i from "./FourIndex.module.css";

function Table({ rows, caption, total }: { rows: typeof businessGrowthUrban; caption: string; total: string }) {
  const { L } = useLang();
  return (
    <div>
      <h4 className={s.caption}>{caption}</h4>
      <div className={s.tableWrap}>
        <table className={s.tbl}>
          <thead><tr><th>Parameter</th><th>Target</th><th>{L({ mr: "गुण", en: "Points" })}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.param.en}><td>{L(r.param)}</td><td className={s.num}>{r.target}</td><td className={s.num}>{r.points}</td></tr>
            ))}
            <tr className={s.total}><td>{total}</td><td></td><td>350</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Index1() {
  const { L } = useLang();
  return (
    <IndexShell
      n={1} id="index-1-info" points={350}
      title={{ mr: "Business Growth Index", en: "Business Growth Index" }}
      philosophy={{
        mr: "मूळ Business वाढवा. MS-CIT, KLiC आणि CCTP admissions मधील वाढ ही Business Revenue मधील वाढ दर्शवते, जी प्रत्येक ALC च्या Sustainability चा पाया आहे. प्रत्येक ALC Urban किंवा Rural क्षेत्रात कार्यरत असतो आणि त्याच्या स्वतःच्या श्रेणीतील तीन Parameters वरच त्याचे मूल्यांकन होते — MS-CIT + KLiC + CCTP = 350 गुण.",
        en: "Grow the core business. Growth in MS-CIT, KLiC and CCTP admissions reflects growth in business revenue, which remains the foundation of every ALC's sustainability. Each ALC operates in either an Urban or a Rural area, and is scored only on the three parameters of its own category — MS-CIT + KLiC + CCTP = 350 points.",
      }}
    >
      <div className={s.grid2}>
        <Table rows={businessGrowthUrban} caption={L({ mr: "Urban ALC साठी", en: "For an Urban ALC" })} total={L({ mr: "एकूण (Urban Total)", en: "Urban Total" })} />
        <Table rows={businessGrowthRural} caption={L({ mr: "Rural ALC साठी", en: "For a Rural ALC" })} total={L({ mr: "एकूण (Rural Total)", en: "Rural Total" })} />
      </div>
      <p className={s.note}>{L({ mr: "मोजमाप व पुरावा: Achievement vs. Target — Admission Portal.", en: "Measurement & evidence: Achievement vs. target — Admission Portal." })}</p>
    </IndexShell>
  );
}
