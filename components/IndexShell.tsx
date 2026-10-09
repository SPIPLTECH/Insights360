"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import s from "./site.module.css";
import i from "./FourIndex.module.css";

/** Shared frame for Index1…Index4 sections (number badge, heading, philosophy, live-points link). */
export default function IndexShell({
  n, id, title, points, philosophy, tint, children,
}: {
  n: 1 | 2 | 3 | 4;
  id: string;
  title: { mr: string; en: string };
  points: number;
  philosophy: { mr: string; en: string };
  tint?: boolean;
  children: React.ReactNode;
}) {
  const { L } = useLang();
  return (
    <section className={`${s.section} ${tint ? s.tint : ""}`} id={id}>
      <div className={s.inner}>
        <Reveal>
          <div className={i.head}>
            <span className={i.badge}>0{n}</span>
            <div>
              <h2 className={s.h2} style={{ marginBottom: 6 }}>{L(title)}</h2>
              <span className={i.pts}>{points} {L({ mr: "गुण", en: "Points" })}</span>
            </div>
            <Link href={`/index-${n}`} className={i.live}>
              {L({ mr: "Live Points पहा", en: "View live points" })} <ArrowRight size={16} />
            </Link>
          </div>
          <p className={i.phil}>{L(philosophy)}</p>
        </Reveal>
        <Reveal delay={100}>{children}</Reveal>
      </div>
    </section>
  );
}
