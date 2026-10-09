"use client";

import { CalendarDays, CircleCheck, CircleX, ScrollText } from "lucide-react";
import { contestNorms } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import s from "./site.module.css";
import c from "./ContestInfo.module.css";

export default function ContestInfo() {
  const { L } = useLang();
  const nov = L({ mr: "नोव्हेंबर", en: "November" });
  return (
    <>
      {/* ===== Timeline ===== */}
      <section className={`${s.section} ${s.tint} ${s.center}`} id="timeline">
        <div className={s.inner} style={{ maxWidth: 820 }}>
          <Reveal>
            <span className={s.label}><CalendarDays size={14} /> {L({ mr: "Contest Timeline आणि महत्त्वाच्या तारखा", en: "Contest Timeline & Key Dates" })}</span>
            <h2 className={s.h2}>{L({ mr: "शर्यत सुरू झाली आहे.", en: "The Race Has Begun." })}</h2>
            <div className={c.dates}>
              <div className={c.date}>
                <span>{L({ mr: "गणल्या जाणाऱ्या Admissions", en: "Admissions counted" })}</span>
                <strong>1 {L({ mr: "जानेवारी", en: "January" })} 2026 – 30 {nov} 2026</strong>
              </div>
              <div className={`${c.date} ${c.dateHot}`}>
                <span>{L({ mr: "Contest ची अंतिम तारीख", en: "Contest last date" })}</span>
                <strong>30 {nov} 2026</strong>
              </div>
            </div>
            <p style={{ maxWidth: 600, margin: "18px auto 0" }}>{L({ mr: "Course च्या कालावधीचा विचार न करता प्रत्येक Admission एक गणली जाते. प्रत्येक दिवस म्हणजे पुढे जाण्याची आणखी एक संधी.", en: "Every admission counts as one, irrespective of course duration. Every day is another opportunity to move forward." })}</p>
          </Reveal>
        </div>
      </section>

      {/* ===== Norms ===== */}
      <section className={s.section} id="norms">
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}><ScrollText size={14} /> {L({ mr: "Contest Norms", en: "Contest Norms" })}</span>
            <h2 className={s.h2}>{L({ mr: "मूळ तत्त्व आणि दिशा", en: "Essence & Direction" })}</h2>
          </Reveal>
          <ol className={c.norms}>
            {contestNorms.map((n, i) => (
              <Reveal key={i} delay={(i % 2) * 90}><li>{L(n)}</li></Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Important rules ===== */}
      <section className={`${s.section} ${s.green}`} id="rules">
        <div className={s.inner} style={{ maxWidth: 900 }}>
          <Reveal>
            <span className={`${s.label} ${c.greenLabel}`}>{L({ mr: "महत्त्वाचे नियम", en: "Important Rules" })}</span>
            <h2 className={s.h2}>{L({ mr: "पुढे जाण्यापूर्वी कृपया वाचा", en: "Please Read Before You Proceed" })}</h2>
            <div className={c.rule}>
              <span className={c.ruleNum}>{L({ mr: "नियम 1)", en: "Rule 1)" })}</span>
              <p>
                {L({ mr: "Home Dashboard वर, प्रत्येक ALC समोर तुम्हाला ", en: "In the Home Dashboard, you will see " })}
                <b className={c.green}><CircleCheck size={16} /> {L({ mr: "हिरवे", en: "Green" })}</b>
                {L({ mr: " आणि ", en: " and " })}
                <b className={c.red}><CircleX size={16} /> {L({ mr: "लाल", en: "Red" })}</b>
                {L({ mr: " गुण दिसतील. ", en: " points against each ALC. " })}
                <b className={c.green}>{L({ mr: "हिरवे", en: "Green" })}</b>
                {L({ mr: " म्हणजे तुम्ही Eligible आहात, आणि ", en: " means you are Eligible, and " })}
                <b className={c.red}>{L({ mr: "लाल", en: "Red" })}</b>
                {L({ mr: " म्हणजे तुम्ही Not Eligible आहात.", en: " means you are Not Eligible." })}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
