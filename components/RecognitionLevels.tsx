"use client";

import { Crown, Medal } from "lucide-react";
import { awardLevels } from "@/lib/content";
import type { Bi } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import s from "./site.module.css";
import l from "./RecognitionLevels.module.css";

const STEPS: { tag: string; range: string; copy: Bi; h: number; color: string; dark: string }[] = [
  { tag: "BRONZE", range: "50% – 59.9%", copy: { mr: "उत्कृष्टतेकडे अर्थपूर्ण पावले.", en: "Taking meaningful steps towards excellence." }, h: 120, color: "#cd7f32", dark: "#a9642a" },
  { tag: "SILVER", range: "60% – 74.9%", copy: { mr: "उत्कृष्टतेचा मजबूत पाया.", en: "Building a strong foundation of excellence." }, h: 170, color: "#a8a29e", dark: "#78716c" },
  { tag: "GOLD", range: "75% – 89.9%", copy: { mr: "मजबूत व सातत्यपूर्ण कामगिरी.", en: "Strong and consistent performance." }, h: 220, color: "#f5b800", dark: "#c99100" },
  { tag: "PLATINUM", range: "90% & Above", copy: { mr: "अपवादात्मक सर्वांगीण उत्कृष्टता.", en: "Exceptional all-round excellence." }, h: 270, color: "#ff7b00", dark: "#d46100" },
];

export default function RecognitionLevels() {
  const { L } = useLang();
  return (
    <section className={`${s.section} ${s.center}`} id="levels">
      <div className={s.inner}>
        <Reveal>
          <span className={s.label}><Medal size={14} /> {L({ mr: "Recognition Levels", en: "Recognition Levels" })}</span>
          <h2 className={s.h2}>{L({ mr: "प्रत्येक Level एक प्रवास दर्शवते", en: "Every Level Represents a Journey" })}</h2>
          <p className={s.lead}>{L({ mr: "आपल्या ALC ची उत्कृष्टता जसजशी वाढेल, तसतसे Bronze पासून Platinum पर्यंत चढत जा.", en: "Climb from Bronze to Platinum as your ALC's excellence grows." })}</p>
        </Reveal>

        <div className={l.stairs}>
          {STEPS.map((p, i) => (
            <Reveal key={p.tag} delay={i * 120} className={l.stairWrap}>
              <div className={l.stair}>
                <div className={l.info}>
                  {p.tag === "PLATINUM" && <Crown size={22} color={p.color} />}
                  <span className={l.tag} style={{ color: p.dark }}>{p.tag}</span>
                  <span className={l.range}>{p.range}</span>
                  <p>{L(p.copy)}</p>
                </div>
                <div className={l.block} style={{ height: p.h, background: `linear-gradient(180deg, ${p.color}, ${p.dark})` }}>
                  <span>{i + 1}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className={s.tableWrap} style={{ maxWidth: 640, margin: "34px auto 0", textAlign: "left" }}>
            <table className={s.tbl}>
              <thead><tr><th>Level</th><th>{L({ mr: "टक्केवारी", en: "Percentage" })}</th><th>{L({ mr: "गुण", en: "Points Score" })}</th></tr></thead>
              <tbody>
                {awardLevels.map((r) => (
                  <tr key={r.level.en}><td><strong>{L(r.level)}</strong></td><td>{r.pct}</td><td className={s.num}>{r.score}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={s.note}>{L({ mr: "टीप: एकाच Level च्या आत, Bonus Points त्यांचा नेमका क्रम ठरवतात.", en: "Please Note: Inside the levels the bonus points will decide their exact position or sequence." })}</p>
          <p className={s.em} style={{ marginTop: 14 }}>{L({ mr: "प्रत्येक Level महत्त्वाचे आहे. प्रत्येक पाऊल पुढे महत्त्वाचे आहे.", en: "Every level matters. Every step forward matters." })}</p>
        </Reveal>
      </div>
    </section>
  );
}
