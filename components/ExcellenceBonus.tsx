"use client";

import { Award, Gift, Infinity as InfinityIcon, Users } from "lucide-react";
import { bonusSlabs } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import s from "./site.module.css";
import b from "./ExcellenceBonus.module.css";

export default function ExcellenceBonus() {
  const { L } = useLang();
  const bar = [0, 35, 75, 100, 120];

  return (
    <>
      {/* ===== Excellence Bonus ===== */}
      <section className={`${s.section} ${s.tint} ${s.center}`} id="bonus">
        <div className={s.inner} style={{ maxWidth: 860 }}>
          <Reveal>
            <span className={s.label}><Gift size={14} /> {L({ mr: "Excellence Bonus", en: "Excellence Bonus" })}</span>
            <h2 className={s.h2}>{L({ mr: "Target पेक्षा जास्त कामगिरीचा गौरव", en: "Rewarding Performance Beyond Target" })}</h2>
            <p className={s.lead}>{L({ mr: "कोणत्याही Index किंवा Parameter च्या Target पेक्षा जास्त मिळालेल्या Admissions साठी Bonus लागू होतो. दर टप्प्याटप्प्याने (Slab-wise) वाढत जातो.", en: "A bonus applies to admissions beyond the target of any parameter in any index. The rate increases slab by slab as performance climbs." })}</p>
          </Reveal>
          <Reveal>
            <div className={s.tableWrap} style={{ textAlign: "left", marginTop: 24 }}>
              <table className={s.tbl}>
                <thead><tr><th>{L({ mr: "Target च्या पलीकडे मिळालेल्या Admissions", en: "Admissions beyond the Target" })}</th><th>{L({ mr: "Bonus दर", en: "Bonus Rate" })}</th><th style={{ width: "28%" }} /></tr></thead>
                <tbody>
                  {bonusSlabs.map((r, i) => (
                    <tr key={i}>
                      <td>{L(r.range)}</td>
                      <td><strong>{L(r.rate)}</strong></td>
                      <td><div className={b.meter}><i style={{ width: `${(bar[i] / 120) * 100}%` }} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Learning Excellence Credits ===== */}
      <section className={`${s.section} ${s.green}`} id="credits">
        <div className={s.inner}>
          <Reveal>
            <span className={`${s.label} ${b.green}`}><InfinityIcon size={14} /> {L({ mr: "शिक्षण उत्कृष्टता श्रेयांक", en: "Learning Excellence Credits" })}</span>
            <h2 className={s.h2}>{L({ mr: "Learning Excellence Credits — कोणतीही कमाल मर्यादा नाही", en: "Learning Excellence Credits — Uncapped" })}</h2>
          </Reveal>
          <div className={s.grid3}>
            {[
              { mr: "Learning Excellence मध्ये \"Bonus\" ऐवजी \"Learning Excellence Credits\" ही संज्ञा वापरली जाते. Learner च्या शिक्षणातील सातत्यपूर्ण सुधारणा व उत्कृष्टतेला प्रोत्साहन देण्यासाठी Learning Excellence Index (Index 3) अंतर्गत या Credits ना कोणतीही कमाल मर्यादा (Uncapped) नाही.", en: "Within Learning Excellence, the term \"Learning Excellence Credits\" is used instead of \"Bonus.\" To encourage consistent improvement and excellence in learner outcomes, these credits under the Learning Excellence Index (Index 3) have no upper cap." },
              { mr: "हे Credits Learning Excellence च्या Base Index Score मध्ये जोडले जाणार नाहीत तसेच Race to Recognition च्या एकूण गुणांवर त्यांचा कोणताही परिणाम होणार नाही.", en: "These credits will not be added to the Base Index Score of Learning Excellence, nor will they affect the overall Race to Recognition score." },
              { mr: "निर्धारित Benchmarks पेक्षा सातत्याने अधिक उत्कृष्ट कामगिरी करणाऱ्या ALCs च्या विशेष गौरवासाठी हे Credits स्वतंत्रपणे नोंदविले व प्रदर्शित केले जातील. यामागील उद्देश केवळ निश्चित स्तर गाठणे नसून, सातत्यपूर्ण उत्कृष्टतेची कार्यसंस्कृती (Culture of Continuous Excellence) निर्माण करणे हा आहे.", en: "These credits will be tracked and displayed separately to specially honour ALCs that consistently outperform defined benchmarks — the aim being to build a Culture of Continuous Excellence, not just to hit a fixed level." },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 110}>
                <div className={s.card} style={{ height: "100%" }}><p style={{ margin: 0 }}>{L(c)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Special Recognitions ===== */}
      <section className={`${s.section} ${s.center}`} id="special">
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}><Award size={14} /> {L({ mr: "विशेष गौरव", en: "Special Recognitions" })}</span>
            <h2 className={s.h2}>{L({ mr: "गुणसंख्येच्या पलीकडे", en: "Beyond the Score" })}</h2>
          </Reveal>
          <div className={s.grid2} style={{ textAlign: "left" }}>
            <Reveal>
              <div className={`${s.card}`} style={{ height: "100%" }}>
                <span className={s.iconBubble}><Award size={22} /></span>
                <h3 className={b.cardH}>{L({ mr: "विदर्भ Learning Excellence Citation", en: "Vidarbha Learning Excellence Citation" })}</h3>
                <p>{L({ mr: "Learning Excellence मध्ये सर्वोच्च कामगिरी करणाऱ्या Top 10 ALCs चा Vidarbha Learning Excellence Citation प्रदान करून विशेष गौरव करण्यात येईल.", en: "The Top 10 ALCs with the highest performance in the Learning Excellence Index will be specially honoured with the Vidarbha Learning Excellence Citation." })}</p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className={`${s.card}`} style={{ height: "100%" }}>
                <span className={s.iconBubble}><Users size={22} /></span>
                <h3 className={b.cardH}>District Excellence Championship</h3>
                <p>{L({ mr: "संपूर्ण जिल्ह्याला बदलण्यास मदत करणाऱ्या ALCs च्या सामूहिक उत्कृष्टतेचा व योगदानाचा गौरव.", en: "Celebrating the collective excellence of ALCs and the contribution that helps transform an entire district." })}</p>
              </div>
            </Reveal>
          </div>
          <p className={s.em} style={{ marginTop: 24 }}>{L({ mr: "कारण कधी कधी सर्वात मोठे यश म्हणजे पहिले येणे नसते — तर सर्वांना पुढे नेण्यास मदत करणे असते.", en: "Because sometimes the greatest achievement is not standing first — it is helping everyone move forward." })}</p>
        </div>
      </section>
    </>
  );
}
