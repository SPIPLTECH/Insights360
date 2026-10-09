"use client";
import { Sec, Tbl, Flow } from "./ui";
import { useLang } from "./LanguageProvider";

export default function Index2() {
  const { t } = useLang();
  const rows = [
    ["MoM", t("District target achieved", "District Target साध्य"), 100, 50],
    ["AI Masterclass", t("Target achieved", "Target साध्य"), 250, 60],
    ["SSC / HSC", t("Conducted; DCU verifies on SOLAR", "आयोजित; SOLAR वर DCU verify"), 250, 60],
    ["ODOT 1", t("Participated", "सहभाग नोंदवला"), "—", 15],
    ["ODOT 2", t("Participated", "सहभाग नोंदवला"), "—", 15],
  ];
  return (
    <Sec id="index-2" title={<><span className="big" style={{ fontSize: "inherit" }}>02</span> / 200 · {t("Be Part of the Ecosystem", "Ecosystem चा भाग व्हा")}</>} sub={t("Full-ecosystem participation, not selective adoption.", "संपूर्ण Ecosystem मध्ये सहभाग, निवडक सहभाग नव्हे.")}>
      <Flow items={["MoM", "AI Masterclass", "SSC / HSC", "ODOT 1", "ODOT 2"]} />
      <Tbl head={[t("Initiative", "उपक्रम"), t("Measurement", "मोजमाप"), "Target", t("Points", "गुण")]} rows={rows} total={[t("Total", "एकूण"), "", "", 200]} />
      <p className="lead">{t("Participation is a standard, not a choice.", "सहभाग हा मानदंड आहे, पर्याय नाही.")}</p>
    </Sec>
  );
}