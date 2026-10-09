"use client";

import { ecosystemRows } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import IndexShell from "./IndexShell";
import s from "./site.module.css";

export default function Index2() {
  const { L } = useLang();
  return (
    <IndexShell
      n={2} id="index-2-info" points={200} tint
      title={{ mr: "Ecosystem Participation Index", en: "Ecosystem Participation Index" }}
      philosophy={{
        mr: "प्रत्येक ALC ने MKCL ने शिफारस केलेल्या सर्व उपक्रमांमध्ये सहभागी होणे अपेक्षित आहे — संपूर्ण Ecosystem मध्ये सहभाग, निवडक सहभाग नव्हे.",
        en: "Each ALC must participate in all the programmes recommended by MKCL — full-ecosystem participation, not selective adoption.",
      }}
    >
      <div className={s.tableWrap}>
        <table className={s.tbl}>
          <thead>
            <tr>
              <th>{L({ mr: "उपक्रम", en: "Initiative" })}</th>
              <th>{L({ mr: "मोजमाप", en: "Measurement" })}</th>
              <th>Target</th>
              <th>{L({ mr: "गुण", en: "Points" })}</th>
            </tr>
          </thead>
          <tbody>
            {ecosystemRows.map((r) => (
              <tr key={r.init.en}>
                <td><strong>{L(r.init)}</strong></td>
                <td>{L(r.measure)}</td>
                <td className={s.num}>{r.target ?? "—"}</td>
                <td className={s.num}>{r.points}</td>
              </tr>
            ))}
            <tr className={s.total}><td colSpan={3}>{L({ mr: "एकूण (Pillar Total)", en: "Pillar Total" })}</td><td>200</td></tr>
          </tbody>
        </table>
      </div>
      <p className={`${s.note} ${s.em}`}>{L({ mr: "संपूर्ण MKCL Ecosystem मधील सहभाग हा एक मानदंड आहे, पर्याय नाही.", en: "Participation across the whole MKCL ecosystem is a standard, not a choice." })}</p>
    </IndexShell>
  );
}
