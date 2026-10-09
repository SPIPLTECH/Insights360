"use client";
import { Target, Eye, Heart, HandHeart, Users, Handshake } from "lucide-react";
import { Sec, Reveal, Flow } from "./ui";
import { useLang } from "./LanguageProvider";

export default function FrameworkBackground() {
  const { t } = useLang();
  return (
    <>
      <Sec tone="tint" title={t("Recognition Beyond Numbers", "आकड्यांच्या पलीकडचे Recognition")}>
        <div className="pref">
          <p>Over more than two decades, together we have brought Digital Literacy and Career-oriented Education to lakhs of learners across Vidarbha East. Every one of you has contributed meaningfully to this achievement.</p>
          <p>Today the world around us is changing fast. Artificial Intelligence has changed how people learn, work and build careers. Learners no longer just want a computer course — they want to become future-ready.</p>
          <p>With this in mind, we present the Vidarbha East Race to Recognition Framework — not merely an award scheme, but a leadership framework that recognises Business Growth, Learner Progression, Learning Excellence, Ecosystem Participation and Professional Contribution together.</p>
          <p className="lead">Race to Recognition is not just a competition — it is our collective commitment to building leadership through excellence, continuous learning and contribution, and to preparing society for the AI era.</p>
          <p className="sign">{t("With very best wishes — All MRCUs & DCUs, East Vidarbha Division", "खूप खूप शुभेच्छा — सर्व MRCU व DCUs, पूर्व विदर्भ विभाग")}</p>
        </div>
      </Sec>

      <Sec>
        <Reveal>
          <div className="grid g3">
            <article className="card">
              <span className="ico"><Target /></span><h3>{t("Our Mission", "आमचे ध्येय")}</h3>
              <b className="serif">{t("To Move Every Learner Forward", "प्रत्येक Learner ला पुढे घेऊन जाणे")}</b>
              <ul>{["Grow the business", "Progress every learner", "Build learning excellence", "Strengthen the ecosystem", "Create meaningful impact"].map((x) => <li key={x}>{x}</li>)}</ul>
              <p><em>Because growth becomes truly meaningful when it creates opportunities for others.</em></p>
            </article>
            <article className="card">
              <span className="ico"><Eye /></span><h3>{t("Our Vision", "आमची दृष्टी")}</h3>
              <b className="serif">{t("From Individual Effort to Collective Excellence", "वैयक्तिक प्रयत्नांपासून सामूहिक उत्कृष्टतेकडे")}</b>
              <p>We envision a Vidarbha East where every ALC becomes a centre of opportunity, every learner gets the chance to progress, and every district grows through collective excellence.</p>
              <p><em>It is about creating a stronger, more capable and future-ready community.</em></p>
            </article>
            <article className="card">
              <span className="ico"><Heart /></span><h3>{t("Our Philosophy", "आमचे तत्त्वज्ञान")}</h3>
              <b className="serif">Recognition Beyond Numbers</b>
              <p>Numbers tell us how much we have achieved, but not always what that achievement means. Behind every admission is a learner. Behind every learner is a dream.</p>
              <p><em>Admission opens the door. Learning builds capability. Progression builds careers.</em></p>
            </article>
          </div>
        </Reveal>
      </Sec>

      <Sec tone="warm">
        <div className="grid g2">
          <div className="card">
            <span className="ico"><HandHeart /></span><h3>{t("Why Recognition?", "Recognition का?")}</h3>
            <b className="serif">Because Every Contribution Deserves to Be Seen</b>
            <p>Not every contribution looks the same. Some build their business. Some transform the learning experience. Some bring more learners into the ecosystem. Some quietly ensure that every learner keeps moving forward.</p>
            <p><em>Recognition brings these contributions together. Because excellence deserves more than measurement — it deserves acknowledgement.</em></p>
          </div>
          <div className="card">
            <span className="ico"><Users /></span><h3>{t("What We Believe", "आम्हाला काय वाटते")}</h3>
            <b className="serif">Success Is Not About Moving Ahead Alone</b>
            <p>We believe the strongest ALC is not simply the one that grows the fastest. It is the one that grows while taking its learners forward — the one that participates, adapts, learns, improves and contributes.</p>
            <p><em>When hundreds of such ALCs move together, something bigger happens — an entire district moves forward.</em></p>
          </div>
        </div>
      </Sec>

      <Sec title={t("The New Way of Thinking", "विचार करण्याची नवी पद्धत")} sub={t("Recognition follows contribution. We now measure the full journey, not just admissions.", "Recognition follows Contribution — आता केवळ Admissions नव्हे, संपूर्ण प्रवासाचे मोजमाप.")}>
        <div className="vs">
          <div className="old"><small>{t("Until now", "यापूर्वी")}</small><b className="serif">Admission = Success</b></div>
          <Handshake className="mid" size={34} />
          <div className="new"><small>{t("From now on", "यापुढे")}</small><Flow items={["Admission", "Learning", "Completion", "Progression", "Success"]} /></div>
        </div>
        <p className="lead">Admission opens the door… Learning builds capability… Progression builds careers.</p>
      </Sec>

      <style jsx>{`
        .pref{max-width:860px;margin:0 auto;text-align:left}.pref p{font-size:16px}
        .pref .lead{margin:22px 0;text-align:left}.sign{font-style:italic;color:var(--gold)}
        .card b{display:block;font-size:18px;line-height:1.3;margin-bottom:10px}
        ul{padding-left:18px;margin:0 0 10px;color:var(--dim);line-height:1.9;font-size:14.5px}li::marker{color:var(--ember)}
        .vs{display:grid;grid-template-columns:1fr auto 1.6fr;gap:18px;align-items:center}
        .old,.new{border-radius:20px;padding:28px;border:1px solid var(--line)}
        .old{background:var(--peach2)}.old b{display:block;font-size:26px;margin-top:6px;text-decoration:line-through;text-decoration-color:var(--ember)}
        .new{background:#fff}.mid{color:var(--ember)}
        @media(max-width:900px){.vs{grid-template-columns:1fr}.mid{margin:auto;transform:rotate(90deg)}}
      `}</style>
    </>
  );
}