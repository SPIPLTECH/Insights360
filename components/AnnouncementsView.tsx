"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Bell, CalendarClock, Megaphone, Pin, Rocket, ScrollText } from "lucide-react";
import { announcements, type Announcement } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import Garden from "./Garden";
import s from "./site.module.css";
import a from "./Announcements.module.css";

const TAGS: { key: "all" | Announcement["tag"]; mr: string; en: string }[] = [
  { key: "all", mr: "सर्व", en: "All" },
  { key: "launch", mr: "सुरुवात", en: "Launch" },
  { key: "deadline", mr: "अंतिम तारीख", en: "Deadlines" },
  { key: "rule", mr: "नियम", en: "Rules" },
  { key: "update", mr: "अद्यतने", en: "Updates" },
];
const ICON = { launch: Rocket, deadline: CalendarClock, rule: ScrollText, update: Megaphone } as const;

export default function AnnouncementsView() {
  const { L, lang } = useLang();
  const [tag, setTag] = useState<(typeof TAGS)[number]["key"]>("all");

  const list = useMemo(
    () =>
      announcements
        .filter((x) => tag === "all" || x.tag === tag)
        .sort((x, y) => Number(!!y.pinned) - Number(!!x.pinned) || y.date.localeCompare(x.date)),
    [tag]
  );
  const fmt = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <section className={`${s.section} ${s.tint} ${s.center} ${a.hero}`}>
        <Garden side="left" />
        <Garden side="right" />
        <div className={s.inner} style={{ maxWidth: 760 }}>
          <Reveal>
            <span className={s.label}><Bell size={14} /> {L({ mr: "घोषणा", en: "Announcements" })}</span>
            <h1 className={s.h2} style={{ fontSize: "clamp(30px,5vw,48px)" }}>{L({ mr: "जोडलेले रहा. पुढे रहा.", en: "Stay Connected. Stay Ahead." })}</h1>
            <p className={s.lead}>{L({ mr: "नवीनतम अद्यतने, महत्त्वाच्या घोषणा, Recognition Updates आणि Regional Meet ची माहिती.", en: "The latest updates, important announcements, recognition updates and Regional Meet information." })}</p>
          </Reveal>
        </div>
      </section>

      <section className={s.section}>
        <div className={s.inner} style={{ maxWidth: 860 }}>
          <div className={a.filters} role="tablist">
            {TAGS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tag === t.key} className={tag === t.key ? a.on : ""} onClick={() => setTag(t.key)}>
                {L(t)}
              </button>
            ))}
          </div>

          <div className={a.list}>
            {list.map((x, i) => {
              const Icon = ICON[x.tag];
              return (
                <Reveal key={x.id} delay={i * 70}>
                  <article className={`${a.item} ${a[x.tag]}`}>
                    <span className={a.icon}><Icon size={22} /></span>
                    <div>
                      <div className={a.meta}>
                        {x.pinned && <span className={a.pin}><Pin size={12} /> {L({ mr: "महत्त्वाचे", en: "Pinned" })}</span>}
                        <time>{fmt(x.date)}</time>
                      </div>
                      <h2>{L(x.title)}</h2>
                      <p>{L(x.body)}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
            {list.length === 0 && <p className={s.center}>{L({ mr: "या विभागात अजून घोषणा नाहीत.", en: "No announcements in this category yet." })}</p>}
          </div>

          <div className={s.center} style={{ marginTop: 34 }}>
            <Link href="/" className={s.btn}><ArrowLeft size={16} /> {L({ mr: "मुख्यपृष्ठावर परत", en: "Back to Home" })}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
