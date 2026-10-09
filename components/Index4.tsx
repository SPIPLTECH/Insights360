"use client";

import { professionalRows } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import IndexShell from "./IndexShell";
import s from "./site.module.css";

export default function Index4() {
  const { L } = useLang();
  return (
    <IndexShell
      n={4} id="index-4-info" points={100} tint
      title={{ mr: "Professional Excellence Index", en: "Professional Excellence Index" }}
      philosophy={{
        mr: "सर्व काही वस्तुनिष्ठ (Objective). हा Index Centre ला व्यावसायिकरीत्या चालवण्यासाठी आवश्यक असलेली शिस्त, अनुपालन (Compliance) आणि सहकार्य यांना गौरवतो.",
        en: "Everything objective. This index rewards the discipline, compliance and collaboration that let a Centre operate professionally.",
      }}
    >
      <div className={s.tableWrap}>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>{L({ mr: "मोजमाप", en: "Measurement" })}</th>
              <th>{L({ mr: "पुरावा", en: "Evidence" })}</th>
              <th>{L({ mr: "गुण", en: "Points" })}</th>
            </tr>
          </thead>
          <tbody>
            {professionalRows.map((r) => (
              <tr key={r.param.en}>
                <td><strong>{L(r.param)}</strong></td><td>{L(r.measure)}</td><td>{L(r.evidence)}</td><td className={s.num}>{r.points}</td>
              </tr>
            ))}
            <tr className={s.total}><td colSpan={3}>{L({ mr: "एकूण (Pillar Total)", en: "Pillar Total" })}</td><td>100</td></tr>
          </tbody>
        </table>
      </div>
      <p className={s.note}>{L({ mr: "जी ALC Learners ना पुढे घेऊन जाते तिने व्यावसायिकरीत्याही चालणे आवश्यक आहे — वेळेवर उपस्थिती, प्रशिक्षण, अहवाल व परीक्षा-अनुपालन. सर्व मापदंड वस्तुनिष्ठ व पुराव्यावर आधारित आहेत — कोणतीही व्यक्तिनिष्ठता नाही.", en: "A centre that grows and progresses learners must also run professionally — attend, train, report on time and stay exam-compliant. All measures are objective and evidence-based — no subjectivity." })}</p>
    </IndexShell>
  );
}
