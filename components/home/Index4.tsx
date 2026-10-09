"use client";
import { CalendarCheck, Camera, Share2, CalendarRange } from "lucide-react";
import { Sec } from "./ui";
import { useLang } from "./LanguageProvider";

const CARDS = [
  { Icon: CalendarCheck, en: "Meeting Attendance", mr: "Meeting Attendance", ev: "Attendance Register" },
  { Icon: Camera, en: "Examination Compliance", mr: "Examination Compliance", ev: "CCTV · Audit Report" },
  { Icon: Share2, en: "Social Media Presence", mr: "Social Media Presence", ev: "DCU Approved · Link" },
  { Icon: CalendarRange, en: "Month-wise Consistency", mr: "Month-wise Consistency", ev: "SOLAR" },
];

export default function Index4() {
  const { t } = useLang();
  return (
    <Sec id="index-4" title={<><span className="big" style={{ fontSize: "inherit" }}>04</span> / 100 · {t("Excellence Is Also Professionalism", "उत्कृष्टता म्हणजे व्यावसायिकताही")}</>} sub={t("Everything objective and evidence-based — discipline, compliance and collaboration.", "सर्व काही वस्तुनिष्ठ व पुराव्यावर आधारित — शिस्त, अनुपालन व सहकार्य.")}>
      <div className="grid g4">
        {CARDS.map(({ Icon, en, mr, ev }) => (
          <div className="card" key={en}>
            <span className="ico"><Icon /></span>
            <div className="big" style={{ fontSize: 54, margin: "12px 0 4px" }}>25</div>
            <h3>{t(en, mr)}</h3><p>{ev}</p>
          </div>
        ))}
      </div>
      <p className="lead">4 × 25 = 100 {t("Points", "गुण")}</p>
    </Sec>
  );
}