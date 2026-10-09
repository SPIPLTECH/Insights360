"use client";
import { TrendingUp, Network, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { Sec, Reveal } from "./ui";
import { useLang } from "./LanguageProvider";

const ITEMS = [
  { n: "01", pts: 350, id: "index-1", Icon: TrendingUp, en: "Business Growth", mr: "Business Growth" },
  { n: "02", pts: 200, id: "index-2", Icon: Network, en: "Ecosystem Participation", mr: "Ecosystem Participation" },
  { n: "03", pts: 200, id: "index-3", Icon: GraduationCap, en: "Learning Excellence", mr: "Learning Excellence" },
  { n: "04", pts: 100, id: "index-4", Icon: ShieldCheck, en: "Professional Excellence", mr: "Professional Excellence" },
];

export default function FourIndex() {
  const { t } = useLang();
  return (
    <Sec title={t("Four Indexes. 850 Points.", "चार Indexes. 850 गुण.")} sub={t("350 + 200 + 200 + 100 — every point is a step towards Recognition.", "350 + 200 + 200 + 100 — प्रत्येक गुण Recognition कडे एक पाऊल.")}>
      <Reveal>
        <div className="grid g4">
          {ITEMS.map(({ n, pts, id, Icon, en, mr }) => (
            <a key={n} href={`#${id}`} className="card">
              <span className="ico"><Icon /></span>
              <div className="big" style={{ fontSize: 56, margin: "14px 0 4px" }}>{pts}</div>
              <h3>{n} · {t(en, mr)}</h3>
              <p style={{ color: "var(--ember)", fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>{t("Explore Index", "Index पहा")} <ArrowRight size={15} /></p>
            </a>
          ))}
        </div>
      </Reveal>
      <p className="lead">850 {t("Points", "गुण")} → Recognition</p>
    </Sec>
  );
}