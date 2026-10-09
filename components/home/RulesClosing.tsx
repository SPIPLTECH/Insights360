"use client";
import { useState } from "react";
import { ChevronDown, Flower2, Flower, Leaf } from "lucide-react";
import { Sec, Flow } from "./ui";
import { useLang } from "./LanguageProvider";

const RULES = [
  { t: "Eligibility", mr: "Eligibility", d: "Green points on the Home Dashboard mean Eligible; red means Not Eligible. Participation in every Index is required.", dm: "Home Dashboard वर हिरवे गुण = Eligible, लाल = Not Eligible. प्रत्येक Index मध्ये सहभाग आवश्यक." },
  { t: "Admissions", mr: "Admissions", d: "All admissions from 1 Jan to 30 Nov 2026 count. Every admission is ONE, irrespective of course hours.", dm: "1 जानेवारी ते 30 नोव्हेंबर 2026 च्या सर्व Admissions गणल्या जातील. प्रत्येक Admission = ONE." },
  { t: "Bonus", mr: "Bonus", d: "Excellence Bonus is separate, uncapped and accelerating. The Growth Bonus is not added to the 850; it only ranks centres within a level.", dm: "Excellence Bonus स्वतंत्र व Uncapped आहे. Growth Bonus 850 मध्ये जोडला जात नाही; तो फक्त Level मधील क्रम ठरवतो." },
  { t: "Recognition", mr: "Recognition", d: "Level is decided by the percentage of 850. Last date of contest: 30 November 2026.", dm: "Level 850 पैकी टक्केवारीने ठरतो. Contest ची अंतिम तारीख: 30 नोव्हेंबर 2026." },
];

export default function RulesClosing() {
  const { t } = useLang();
  const [o, setO] = useState(0);
  return (
    <>
      <Sec id="rules" title={t("Before You Race, Know the Rules.", "शर्यतीपूर्वी नियम जाणून घ्या.")}>
        <div className="acc">
          {RULES.map((r, i) => (
            <div key={r.t} className={o === i ? "it open" : "it"}>
              <button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)}>
                <span>{t("Rule", "नियम")} 0{i + 1}</span><b className="serif">{t(r.t, r.mr)}</b><ChevronDown size={18} />
              </button>
              {o === i && <p>{t(r.d, r.dm)}</p>}
            </div>
          ))}
        </div>
      </Sec>

      <Sec tone="dark" title="Recognition Beyond Numbers">
        <div className="grid g3" style={{ marginBottom: 30 }}>
          {[["Business", "Grow the business.", "Business वाढवा."], ["Learner", "Progress every learner.", "प्रत्येक Learner ला पुढे न्या."], ["District", "Transform the district.", "जिल्ह्याचे रूपांतर घडवा."]].map(([a, b, c]) => (
            <div key={a} style={{ textAlign: "center" }}><h3 style={{ fontSize: 30, color: "#FF9A5C" }}>{a}</h3><p>{t(b, c)}</p></div>
          ))}
        </div>
        <p className="lead">Admission opens the door. Learning builds capability. Progression builds careers.</p>
      </Sec>

      <Sec title={t("The Whole Framework in One Sentence", "संपूर्ण Framework एका वाक्यात")}>
        <Flow items={["Grow", "Progress", "Participate", "Learn", "Excel", "Transform"]} />
        <p className="big" style={{ fontSize: "clamp(30px,5.5vw,60px)", marginTop: 20 }}>Recognition Follows Contribution.</p>
      </Sec>

      <section className="end">
        <Flower2 className="f a" size={120} strokeWidth={1} aria-hidden /><Flower className="f b" size={80} strokeWidth={1} aria-hidden /><Leaf className="f c" size={90} strokeWidth={1} aria-hidden />
        <div className="in">
          <small>VIDARBHA EAST · RACE TO RECOGNITION</small>
          <h2 className="serif">{t("This Is More Than a Race.", "ही केवळ एक शर्यत नाही.")}</h2>
          <p>{t("Every learner guided.", "प्रत्येक Learner मार्गदर्शित.")}<br />{t("Every challenge overcome.", "प्रत्येक आव्हान पार.")}<br />{t("Every small step forward.", "प्रत्येक छोटे पाऊल पुढे.")}</p>
          <p className="tg serif">Together Towards Excellence.<br />Together Towards Growth.</p>
          <b className="yr serif">2026–27</b>
        </div>
      </section>

      <style jsx>{`
        .acc{max-width:760px;margin:0 auto;text-align:left}
        .it{background:var(--peach);border:1px solid var(--line);border-radius:14px;margin-bottom:10px;overflow:hidden}
        .it button{width:100%;display:flex;gap:16px;align-items:center;padding:18px 22px;border:0;background:transparent;cursor:pointer;font:inherit;color:var(--ink);text-align:left}
        .it button span{color:var(--ember);font-weight:600;font-size:13px}.it button b{font-size:19px;flex:1}
        .it.open button :global(svg){transform:rotate(180deg)}.it p{padding:0 22px 18px;margin:0}
        .end{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;background:radial-gradient(circle at 50% 40%,#3a1626,var(--ink) 70%);color:#fff;overflow:hidden;padding:60px 24px}
        .in{position:relative;max-width:760px}.end small{color:#FF9A5C;letter-spacing:.08em}
        .end h2{color:#fff;font-size:clamp(38px,8vw,84px);font-style:italic;margin:16px 0}.end p{color:#f1ddd0;font-size:19px}
        .tg{font-size:clamp(22px,3.4vw,32px)!important;color:#fff!important;margin-top:30px}.yr{display:block;margin-top:28px;font-size:24px;color:#FF9A5C}
        .end :global(.f){position:absolute;color:#FF3D6E;opacity:.35;animation:sway 8s ease-in-out infinite}
        .end :global(.a){left:6%;top:12%}.end :global(.b){right:9%;top:20%;animation-delay:-2s}.end :global(.c){right:14%;bottom:12%;color:#4cc38a;animation-delay:-4s}
        @keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
      `}</style>
    </>
  );
}