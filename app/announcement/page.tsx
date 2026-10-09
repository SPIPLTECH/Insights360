"use client";
import Link from "next/link";
import { Megaphone, Award, CalendarDays, ArrowLeft } from "lucide-react";
import { Sec } from "@/components/home/ui";
import { useLang } from "@/components/home/LanguageProvider";

export default function Announcements() {
  const { t } = useLang();
  const items = [
    { Icon: Megaphone, en: "Latest Update", mr: "नवीनतम अपडेट", d: "Important announcements will appear here.", dm: "महत्त्वाच्या घोषणा येथे दिसतील." },
    { Icon: Award, en: "Recognition Update", mr: "Recognition Update", d: "Updates on levels, bonus and citations.", dm: "Level, Bonus व Citation संबंधी अद्यतने." },
    { Icon: CalendarDays, en: "Regional Meet", mr: "विभागीय मेळावा", d: "Dates, venue and Regional Meet information.", dm: "तारखा, ठिकाण व मेळाव्याची माहिती." },
  ];
  return (
    <main>
      <Sec tone="tint" title={t("Stay Connected. Stay Ahead.", "जोडलेले रहा. पुढे रहा.")} sub={t("Every milestone deserves to be celebrated. Every important moment deserves to be shared.", "प्रत्येक टप्पा साजरा करण्यास पात्र आहे. प्रत्येक महत्त्वाचा क्षण शेअर करण्यास पात्र आहे.")}>
        <div className="grid g3">
          {items.map(({ Icon, en, mr, d, dm }) => (
            <article className="card" key={en}><span className="ico"><Icon /></span><h3>{t(en, mr)}</h3><p>{t(d, dm)}</p></article>
          ))}
        </div>
        <Link href="/" className="cta"><ArrowLeft size={18} /> {t("Back to Home", "मुख्यपृष्ठावर परत")}</Link>
      </Sec>
    </main>
  );
}