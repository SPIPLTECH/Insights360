"use client";

import { Crown, Medal, Star } from "lucide-react";
import type { Bi } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import s from "./site.module.css";
import l from "./RecognitionLevels.module.css";

type Step = {
  tag: string;
  range: string;
  score: string;
  copy: Bi;
  h: number; // card min-height (desktop staircase)
  from: string;
  to: string;
  pillText: string;
  tagColor: string;
  scoreBg: string;
  scoreLabel: string;
  scoreText: string;
  light?: boolean;
};

const STEPS: Step[] = [
  { tag: "BRONZE", range: "50% – 59.9%", score: "425 – 509", copy: { mr: "उत्कृष्टतेकडे अर्थपूर्ण पावले.", en: "Taking meaningful steps towards excellence." }, h: 390, from: "#f08a24", to: "#b8590f", pillText: "#5a2d08", tagColor: "#fff", scoreBg: "#fdebd2", scoreLabel: "#b8590f", scoreText: "#4a2305" },
  { tag: "SILVER", range: "60% – 74.9%", score: "510 – 636", copy: { mr: "उत्कृष्टतेचा मजबूत पाया.", en: "Building a strong foundation of excellence." }, h: 420, from: "#a8a29e", to: "#6f6a67", pillText: "#2f2b29", tagColor: "#fff", scoreBg: "#f1efee", scoreLabel: "#6f6a67", scoreText: "#2f2b29" },
  { tag: "GOLD", range: "75% – 89.9%", score: "637 – 764", copy: { mr: "मजबूत व सातत्यपूर्ण कामगिरी.", en: "Strong and consistent performance." }, h: 450, from: "#ffd21a", to: "#e59a00", pillText: "#5a3a00", tagColor: "#fff", scoreBg: "#fff3d0", scoreLabel: "#b87400", scoreText: "#4a2f00" },
  { tag: "PLATINUM", range: "90% & Above", score: "765+", copy: { mr: "अपवादात्मक सर्वांगीण उत्कृष्टता.", en: "Exceptional all-round excellence." }, h: 480, from: "#ff9a1f", to: "#f25f00", pillText: "#4a1f05", tagColor: "#fff", scoreBg: "#ffeedd", scoreLabel: "#d4570a", scoreText: "#4a1f05" },
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
              <div
                className={l.card}
                style={{ ["--h" as string]: `${p.h}px`, background: `linear-gradient(180deg, ${p.from}, ${p.to})` }}
              >
                {p.tag === "PLATINUM" ? <Crown className={l.icon} strokeWidth={2.2} /> : <Star className={l.icon} strokeWidth={2.2} />}
                <span className={l.tag} style={{ color: p.tagColor }}>{p.tag}</span>
                <span className={l.pill} style={{ color: p.pillText }}>{p.range}</span>
                <hr className={l.divider} />
                <p className={l.copy}>{L(p.copy)}</p>
                <div className={l.num}><i /><b>{i + 1}</b><i /></div>
                <div className={l.score} style={{ background: p.scoreBg }}>
                  <span style={{ color: p.scoreLabel }}>{L({ mr: "गुण", en: "Points Score" })}</span>
                  <strong style={{ color: p.scoreText }}>{p.score}</strong>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
        
          <p className={s.em} style={{ marginTop: 14 }}>{L({ mr: "प्रत्येक Level महत्त्वाचे आहे. प्रत्येक पाऊल पुढे महत्त्वाचे आहे.", en: "Every level matters. Every step forward matters." })}</p>
        </Reveal>
      </div>
    </section>
  );
}