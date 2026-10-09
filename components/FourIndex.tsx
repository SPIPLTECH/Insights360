"use client";

import Link from "next/link";
import { BookOpenCheck, BriefcaseBusiness, ShieldCheck, TrendingUp } from "lucide-react";
import type { Bi } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import Index1 from "./Index1";
import Index2 from "./Index2";
import Index3 from "./Index3";
import Index4 from "./Index4";
import s from "./site.module.css";
import f from "./FourIndex.module.css";

const CARDS: { n: number; t: Bi; pts: number; min: number; Icon: typeof TrendingUp; c: string }[] = [
  { n: 1, t: { mr: "Business Growth", en: "Business Growth" }, pts: 350, min: 88, Icon: TrendingUp, c: "#f5762e" },
  { n: 2, t: { mr: "Ecosystem Participation", en: "Ecosystem Participation" }, pts: 200, min: 50, Icon: BriefcaseBusiness, c: "#ec1e63" },
  { n: 3, t: { mr: "Learning Excellence", en: "Learning Excellence" }, pts: 200, min: 30, Icon: BookOpenCheck, c: "#1e8e3e" },
  { n: 4, t: { mr: "Professional Excellence", en: "Professional Excellence" }, pts: 100, min: 25, Icon: ShieldCheck, c: "#7c3aed" },
];

const TOTAL = CARDS.reduce((sum, c) => sum + c.pts, 0); // 850

/** "Four Index" overview strip + the four detailed Index sections. */
export default function FourIndex() {
  const { L } = useLang();
  return (
    <>
      <section className={`${s.section} ${s.center}`} id="four-index">
        <div className={s.inner}>
          <Reveal>
            <h2 className={s.h2}>{L({ mr: "चार Index — एक Framework", en: "Four Index — One Framework" })}</h2>
            <p className={s.lead}>{L({ mr: "प्रत्येक Index वर क्लिक करून आपल्या ALC चे Live Points पहा.", en: "Tap an Index to see live points for every ALC." })}</p>
          </Reveal>

          <Reveal delay={60}>
            <div className={f.total}>
              <span className={f.totalLabel}>
                {L({ mr: "चार Indices, एकूण", en: "Four Indices, Total" })}
              </span>
              <span className={f.totalNum}>{TOTAL}</span>
              <span className={f.totalLabel}>
                {L({ mr: "गुण", en: "Points" })}
              </span>
            </div>
          </Reveal>

          <div className={f.cards}>
            {CARDS.map(({ n, t, pts, min, Icon, c }, k) => (
              <Reveal key={n} delay={k * 90}>
                <Link href={`/index-${n}`} className={f.card} style={{ ["--c" as string]: c }}>
                  <span className={f.cardIcon}><Icon size={26} /></span>
                  <span className={f.cardNum}>Index {n}</span>
                  <strong>{L(t)}</strong>
                  <span className={f.cardPts}>{pts}</span>
                  <small>{L({ mr: "किमान", en: "Min." })} {min} {L({ mr: "गुण", en: "pts" })}</small>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Index1 />
      <Index2 />
      <Index3 />
      <Index4 />
    </>
  );
}