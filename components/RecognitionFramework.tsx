"use client";

import Link from "next/link";
import { Flag, Map } from "lucide-react";
import { glanceRows } from "@/lib/content";
import type { Bi } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import { FlowerDivider } from "./Garden";
import s from "./site.module.css";
import r from "./RecognitionFramework.module.css";

const STOPS: { n: string; kicker: Bi; t: Bi; d: Bi; href: string; x: number; y: number; above: boolean }[] = [
  { n: "01", kicker: { mr: "पाया उभारणे", en: "Building the foundation" }, t: { mr: "Business Growth", en: "Business Growth" }, d: { mr: "एक मजबूत व शाश्वत ALC घडवणे.", en: "Building a strong and sustainable ALC." }, href: "/index-1", x: 340, y: 430, above: false },
  { n: "02", kicker: { mr: "मोठ्या प्रवासाचा भाग", en: "Being part of something bigger" }, t: { mr: "Ecosystem Participation", en: "Ecosystem Participation" }, d: { mr: "MKCL Ecosystem चा सक्रिय भाग बनणे.", en: "Being an active part of the larger MKCL ecosystem." }, href: "/index-2", x: 560, y: 270, above: true },
  { n: "03", kicker: { mr: "Admission चे रूपांतर Outcome मध्ये", en: "Turning admissions into outcomes" }, t: { mr: "Learning Excellence", en: "Learning Excellence" }, d: { mr: "Admissions चे अर्थपूर्ण शिक्षण व प्रगतीत रूपांतर होईल हे पाहणे.", en: "Ensuring that Admissions translate into meaningful learning and progression." }, href: "/index-3", x: 880, y: 430, above: false },
  { n: "04", kicker: { mr: "शिस्त आणि अनुपालन", en: "Discipline and compliance" }, t: { mr: "Professional Excellence", en: "Professional Excellence" }, d: { mr: "शिस्त, Compliance आणि व्यावसायिक कार्यसंस्कृती घडवणे.", en: "Building a culture of discipline, compliance and professional practice." }, href: "/index-4", x: 1180, y: 270, above: true },
];

const ROAD =
  "M150,470 C 220,470 260,430 340,430 C 420,430 480,270 560,270 C 660,270 780,430 880,430 C 980,430 1100,270 1180,270 C 1260,270 1320,370 1380,370";
const W = 1560, H = 560;
const pct = (v: number, t: number) => `${(v / t) * 100}%`;

export default function RecognitionFramework() {
  const { L } = useLang();

  return (
    <section className={`${s.section} ${s.tint} ${s.center}`} id="framework">
      <div className={s.inner}>
        <Reveal>
          <span className={s.label}><Map size={14} /> {L({ mr: "Recognition Framework", en: "The Recognition Framework" })}</span>
          <h2 className={s.h2}>{L({ mr: "चार Indices. उत्कृष्टतेकडे जाणारा एक प्रवास.", en: "Four Dimensions. One Journey Towards Excellence." })}</h2>
          <p className={s.lead}>{L({ mr: "हा Framework एकूण 850 गुणांमधून ALC च्या कामगिरीचे संपूर्ण चित्र मांडतो.", en: "The framework looks at the complete picture of an ALC's performance across a total of 850 points." })}</p>
        </Reveal>

        {/* ---- zig-zag road ---- */}
        <div className={r.scroll}>
          <div className={r.road}>
            <svg viewBox={`0 0 ${W} ${H}`} fill="none" className={r.svg} aria-hidden="true">
              <defs>
                <linearGradient id="r2rRoad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFD9C2" /><stop offset="50%" stopColor="#FFC7D6" /><stop offset="100%" stopColor="#FFD9C2" />
                </linearGradient>
              </defs>
              <path d={ROAD} stroke="url(#r2rRoad)" strokeWidth="54" strokeLinecap="round" />
              <path d={ROAD} stroke="#fff" strokeWidth="4" strokeDasharray="15 17" strokeLinecap="round" className={r.dash} />
              <circle cx="150" cy="470" r="26" fill="#1a1310" />
              <text x="150" y="476" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="700" fill="#fff">S</text>
              <circle cx="1380" cy="370" r="28" fill="#1e8e3e" />
              {STOPS.map((p) => (
                <g key={p.n}>
                  <circle cx={p.x} cy={p.y} r="36" fill="#fff" stroke="#ec1e63" strokeWidth="4" />
                  <text x={p.x} y={p.y + 7} textAnchor="middle" fontFamily="Fraunces, serif" fontSize="21" fontWeight="700" fill="#ec1e63">{p.n}</text>
                </g>
              ))}
            </svg>
            <span className={r.flag} style={{ left: pct(1380, W), top: pct(370, H) }}><Flag size={20} color="#fff" /></span>
            <span className={r.tag} style={{ left: pct(150, W), top: pct(512, H) }}>{L({ mr: "सुरुवात", en: "Start" })}</span>
            <span className={r.tag} style={{ left: pct(1380, W), top: pct(412, H) }}>{L({ mr: "उत्कृष्टता", en: "Excellence" })}</span>

            {STOPS.map((p) => (
              <Link
                key={p.n}
                href={p.href}
                className={r.stop}
                style={{
                  left: pct(p.x, W),
                  top: pct(p.above ? p.y - 48 : p.y + 48, H),
                  transform: p.above ? "translate(-50%,-100%)" : "translate(-50%,0)",
                }}
              >
                <span className={r.kick}>{L(p.kicker)}</span>
                <span className={r.ttl}>{L(p.t)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className={r.legend}>
          {STOPS.map((p) => (
            <p key={p.n}><strong>{p.n}</strong> {L(p.d)}</p>
          ))}
        </div>
        <p className={s.note} style={{ maxWidth: 780, margin: "18px auto 0" }}>
          {L({ mr: "निर्धारित Target पेक्षा जास्त कामगिरी ही, त्याच Recognition Level मधील ALCs मध्ये लागू असलेल्या Growth Bonus द्वारे वेगळेपण दाखवते. Learning Excellence मध्ये सातत्यपूर्ण व अपवादात्मक कामगिरी ही स्वतंत्रपणे Learning Excellence Credits द्वारे गौरवली जाते.", en: "Performance beyond defined targets can further distinguish ALCs within the same recognition level through the applicable Growth Bonus. Within Learning Excellence, exceptional and continuous performance is recognised separately through Learning Excellence Credits." })}
        </p>

        {/* ---- at a glance table ---- */}
        <Reveal>
          <div style={{ marginTop: 46 }}>
            <h3 className={r.glanceTitle}>{L({ mr: "चार Indices, एकूण 850 गुण", en: "Four Indices, 850 Points Total" })}</h3>
            <div className={s.tableWrap} style={{ textAlign: "left" }}>
              <table className={s.tbl}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{L({ mr: "Recognition Index", en: "Recognition Index" })}</th>
                    <th>{L({ mr: "कमाल गुण", en: "Max. Points" })}</th>
                    <th>{L({ mr: "किमान गुण", en: "Min. Points" })}</th>
                    <th>{L({ mr: "Bonus", en: "Bonus Points" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {glanceRows.map((g) => (
                    <tr key={g.n}>
                      <td className={s.num}>{g.n}</td>
                      <td><Link href={`/index-${g.n}`} className={r.rowLink}>{L(g.idx)}</Link></td>
                      <td>{g.max}</td>
                      <td>{g.min}</td>
                      <td>{L(g.bonus)}</td>
                    </tr>
                  ))}
                  <tr className={s.total}>
                    <td colSpan={2}>{L({ mr: "अंतिम ALC Excellence Score", en: "Final ALC Excellence Score" })}</td>
                    <td colSpan={3}>850</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <FlowerDivider />
        </Reveal>
      </div>
    </section>
  );
}
