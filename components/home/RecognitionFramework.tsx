"use client";
import FrameworkRoad from "@/components/home/FrameworkRoad";
import { Sec } from "./ui";
import { useLang } from "./LanguageProvider";

export default function RecognitionFramework() {
  const { t } = useLang();
  return (
    <Sec id="framework" tone="tint" title={t("Four Dimensions. One Journey Towards Excellence.", "चार Indices. उत्कृष्टतेकडे जाणारा एक प्रवास.")} sub={t("The framework looks at the complete picture of an ALC's performance across a total of 850 points.", "हा Framework एकूण 850 गुणांमधून ALC च्या कामगिरीचे संपूर्ण चित्र मांडतो.")}>
      <FrameworkRoad />
      <p className="note">{t("Performance beyond targets is further distinguished by the Growth Bonus; exceptional learning performance is recognised through Learning Excellence Credits.", "Target पेक्षा जास्त कामगिरी Growth Bonus द्वारे व Learning मधील अपवादात्मक कामगिरी Learning Excellence Credits द्वारे गौरवली जाते.")}</p>
    </Sec>
  );
}