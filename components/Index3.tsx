"use client";

import { learningKLiC, learningMSCIT } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import IndexShell from "./IndexShell";
import s from "./site.module.css";

type Row = (typeof learningMSCIT)[number];

function Table({ rows, caption, total }: { rows: Row[]; caption: string; total: number }) {
  const { L } = useLang();
  return (
    <div>
      <h4 className={s.caption}>{caption}</h4>
      <div className={s.tableWrap}>
        <table className={s.tbl}>
          <thead><tr><th>Metric</th><th>{L({ mr: "काय मोजले जाते", en: "What it broadly measures" })}</th><th>{L({ mr: "गुण", en: "Points" })}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.m.en}><td><strong>{L(r.m)}</strong></td><td>{L(r.d)}</td><td className={s.num}>{r.points}</td></tr>
            ))}
            <tr className={s.total}><td colSpan={2}>Total</td><td>{total}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Index3() {
  const { L } = useLang();
  return (
    <IndexShell
      n={3} id="index-3-info" points={200}
      title={{ mr: "Learning Excellence Index (2026 पासून नवीन)", en: "Learning Excellence Index (New in 2026)" }}
      philosophy={{
        mr: "Admission हा Learner च्या प्रवासाचा प्रारंभ आहे; शेवट नाही. हा Index Admission नंतरच्या Learner च्या संपूर्ण शिक्षण प्रवासाची दखल घेतो — प्रत्येक Admission चे रूपांतर अर्थपूर्ण शिक्षण, यशस्वी Course Completion आणि Career Progression मध्ये व्हावे यासाठी. 2026 मध्ये या Index ला मर्यादित Weightage देण्यात आले आहे; मात्र येत्या प्रत्येक वर्षी त्याचे महत्त्व टप्प्याटप्प्याने वाढत जाईल.",
        en: "Admission is the start of the learner's journey, not the end. This index tracks the learner's full journey after admission — so that every admission converts into meaningful learning, successful course completion and career progression. Limited weightage is given to this index in 2026; its importance will increase progressively each year.",
      }}
    >
      <div className={s.grid2}>
        <Table rows={learningMSCIT} caption={L({ mr: "MS-CIT साठी", en: "The Scheme for MS-CIT" })} total={120} />
        <Table rows={learningKLiC} caption={L({ mr: "KLiC साठी", en: "The Scheme for KLiC" })} total={80} />
      </div>
    </IndexShell>
  );
}
