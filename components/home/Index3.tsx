"use client";
import { useState } from "react";
import { Sec, Tbl, Flow } from "./ui";
import { useLang } from "./LanguageProvider";

const MS: [string, string][] = [
  ["Timely Learning Start", "वेळेत शिक्षणाची सुरुवात"], ["Learning Consistency", "सातत्यपूर्ण शिक्षण"], ["Course Completion", "अभ्यासक्रम पूर्णता"],
  ["Biometric Attendance", "बायोमेट्रिक उपस्थिती"], ["Learner App Usage", "Learner App वापर"], ["Certification Success", "यशस्वी प्रमाणपत्र प्राप्ती"],
];
const KL = [MS[0], MS[1], MS[2], MS[5]];

export default function Index3() {
  const { t } = useLang();
  const [tab, setTab] = useState<"ms" | "k">("ms");
  const list = tab === "ms" ? MS : KL;
  return (
    <Sec id="index-3" tone="warm" title={<><span className="big" style={{ fontSize: "inherit" }}>03</span> / 200 · {t("Every Admission Has a Learner Behind It", "प्रत्येक Admission मागे एक Learner आहे")}</>} sub={t("Admission is the start of the journey, not the end. Limited weightage in 2026; it grows every year.", "Admission ही सुरुवात आहे, शेवट नाही. 2026 मध्ये मर्यादित Weightage; दरवर्षी वाढत जाईल.")}>
      <Flow items={["Admission", "Learning Start", "Consistency", "Completion", "Attendance", "App Usage", "Certification"]} />
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "ms"} className={tab === "ms" ? "on" : ""} onClick={() => setTab("ms")}>MS-CIT · 120</button>
        <button role="tab" aria-selected={tab === "k"} className={tab === "k" ? "on" : ""} onClick={() => setTab("k")}>KLiC · 80</button>
      </div>
      <Tbl head={["Metric", t("Points", "गुण")]} rows={list.map(([en, mr]) => [t(en, mr), 20])} total={[t("Total", "एकूण"), tab === "ms" ? 120 : 80]} />
      <p className="lead">120 + 80 = 200 {t("Points", "गुण")}</p>
    </Sec>
  );
}