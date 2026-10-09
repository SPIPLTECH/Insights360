"use client";
import Link from "next/link";
import { Trophy } from "lucide-react";
import LevelSteps from "@/components/home/LevelSteps";
import { Sec, Tbl } from "./ui";
import { useLang } from "./LanguageProvider";

export default function RecognitionLevels() {
  const { t } = useLang();
  return (
    <Sec id="levels" tone="tint" title={t("How Do I Reach Platinum?", "Platinum पर्यंत कसे पोहोचायचे?")} sub={t("Climb from Bronze to Platinum as your ALC's excellence grows.", "ALC ची उत्कृष्टता वाढेल तसे Bronze पासून Platinum पर्यंत चढत जा.")}>
      <LevelSteps />
      <div style={{ maxWidth: 620, margin: "28px auto 0" }}>
        <Tbl head={["Level", t("Percentage", "टक्केवारी"), t("Points", "गुण")]} rows={[["Platinum", "90% & above", "765+"], ["Gold", "75% – 89.9%", "637 – 764"], ["Silver", "60% – 74.9%", "510 – 636"], ["Bronze", "50% – 59.9%", "425 – 509"]]} />
        <p className="note">{t("Inside a level, bonus points decide the exact position.", "एकाच Level मध्ये Bonus Points क्रम ठरवतात.")}</p>
      </div>
      <p className="lead">{t("Where will you stand?", "तुम्ही कुठे उभे राहाल?")}</p>
      <Link href="/dashboard" className="cta"><Trophy size={18} /> {t("Check Your Position", "तुमचे स्थान पहा")}</Link>
    </Sec>
  );
}