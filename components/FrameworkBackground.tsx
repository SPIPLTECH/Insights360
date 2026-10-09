"use client";

import { Compass, Eye, Heart, Lightbulb, Rocket, Sparkles, Users } from "lucide-react";
import { journey } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import Garden, { FlowerDivider } from "./Garden";
import s from "./site.module.css";
import b from "./FrameworkBackground.module.css";

export default function FrameworkBackground() {
  const { L } = useLang();

  return (
    <>
      {/* ===== OUR MESSAGE — Recognition Beyond Numbers ===== */}
      <section className={s.section} id="preface">
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}><Sparkles size={14} /> {L({ mr: "आमचे मनोगत", en: "Our Message" })}</span>
            <h2 className={s.h2}>{L({ mr: "Recognition Beyond Numbers", en: "Recognition Beyond Numbers" })}</h2>
            <p className={s.lead} style={{ maxWidth: 920, marginBottom: 22 }}>
              {L({
                mr: "गेल्या दोन दशकांहून अधिक काळात आपण सर्वांनी मिळून विदर्भ ईस्टमध्ये लाखो Learners पर्यंत Digital Literacy आणि Career-oriented Education पोहोचवले. या यशामध्ये आपल्या प्रत्येकाचे मोलाचे योगदान आहे. आज मात्र आपल्या सभोवतालचे जग वेगाने बदलत आहे. Artificial Intelligence मुळे शिकण्याची, काम करण्याची आणि Career घडवण्याची पद्धतच बदलली आहे. Learners आता केवळ Computer Course शोधत नाहीत; त्यांना Future Ready व्हायचे आहे. याच भूमिकेतून Vidarbha East Race to Recognition Framework सादर करत आहोत. ही केवळ Award Scheme नसून, आपल्या Business Growth, Learner Progression, Learning Excellence, Ecosystem Participation आणि Professional Contribution चा व्यापक गौरव करणारी Leadership Framework आहे.",
                en: "Over more than two decades, together we have brought Digital Literacy and Career-oriented Education to lakhs of learners across Vidarbha East. Every one of you has contributed meaningfully to this achievement. Today the world around us is changing fast. Artificial Intelligence has changed how people learn, work and build careers. Learners no longer just want a computer course — they want to become future-ready. With this in mind, we present the Vidarbha East Race to Recognition Framework — not merely an award scheme, but a leadership framework that recognises Business Growth, Learner Progression, Learning Excellence, Ecosystem Participation and Professional Contribution together.",
              })}
            </p>
            <blockquote className={b.quote}>
              {L({ mr: "Race to Recognition ही केवळ Competition नाही — ती Excellence, Continuous Learning आणि Contribution मधून Leadership घडवण्याची आणि AI Era साठी समाजाला तयार करण्याची आपल्या सर्वांची सामूहिक Commitment आहे.", en: "Race to Recognition is not just a competition — it is our collective commitment to building leadership through excellence, continuous learning and contribution, and to preparing society for the AI era." })}
            </blockquote>
            <p className={b.sign}>{L({ mr: "खूप खूप शुभेच्छा — सर्व MRCU व DCUs, पूर्व विदर्भ विभाग", en: "With very best wishes — All MRCUs & DCUs, East Vidarbha Division" })}</p>
          </Reveal>
        </div>
      </section>

      {/* ===== MISSION / VISION / PHILOSOPHY ===== */}
      <section className={`${s.section} ${s.tint}`}>
        <div className={s.inner}>
          <div className={s.grid3}>
            <Reveal>
              <article className={s.card} style={{ height: "100%" }}>
                <span className={s.iconBubble}><Rocket size={22} /></span>
                <span className={s.kicker}>{L({ mr: "आमचे ध्येय", en: "Our Mission" })}</span>
                <h3 className={b.cardTitle}>{L({ mr: "प्रत्येक Learner ला पुढे घेऊन जाणे", en: "To Move Every Learner Forward" })}</h3>
                <ul className={s.pillars}>
                  <li>{L({ mr: "Business वाढवणे", en: "Grow the business" })}</li>
                  <li>{L({ mr: "प्रत्येक Learner ची प्रगती", en: "Progress every learner" })}</li>
                  <li>{L({ mr: "Learning Excellence घडवणे", en: "Build learning excellence" })}</li>
                  <li>{L({ mr: "Ecosystem अधिक मजबूत करणे", en: "Strengthen the ecosystem" })}</li>
                  <li>{L({ mr: "अर्थपूर्ण प्रभाव निर्माण करणे", en: "Create meaningful impact" })}</li>
                </ul>
                <p className={s.cardClose}>{L({ mr: "कारण वाढ खऱ्या अर्थाने तेव्हाच सार्थक ठरते, जेव्हा ती इतरांसाठी संधी निर्माण करते.", en: "Because growth becomes truly meaningful when it creates opportunities for others." })}</p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className={s.card} style={{ height: "100%" }}>
                <span className={s.iconBubble}><Eye size={22} /></span>
                <span className={s.kicker}>{L({ mr: "आमची दृष्टी", en: "Our Vision" })}</span>
                <h3 className={b.cardTitle}>{L({ mr: "वैयक्तिक प्रयत्नांपासून सामूहिक उत्कृष्टतेकडे", en: "From Individual Effort to Collective Excellence" })}</h3>
                <p>{L({ mr: "आम्ही अशा विदर्भ ईस्टचे स्वप्न पाहतो जिथे प्रत्येक ALC संधीचे केंद्र बनेल, प्रत्येक Learner ला पुढे जाण्याची संधी मिळेल आणि प्रत्येक जिल्हा सामूहिक उत्कृष्टतेतून वाढेल.", en: "We envision a Vidarbha East where every ALC becomes a centre of opportunity, every learner gets the chance to progress, and every district grows through collective excellence." })}</p>
                <p className={s.cardClose}>{L({ mr: "हा एक अधिक सक्षम, बळकट आणि भविष्यासाठी सज्ज असा समुदाय घडवण्याचा प्रवास आहे.", en: "It is about creating a stronger, more capable and future-ready community." })}</p>
              </article>
            </Reveal>
            <Reveal delay={240}>
              <article className={s.card} style={{ height: "100%" }}>
                <span className={s.iconBubble}><Heart size={22} /></span>
                <span className={s.kicker}>{L({ mr: "आमचे तत्त्वज्ञान", en: "Our Philosophy" })}</span>
                <h3 className={b.cardTitle}>{L({ mr: "आकड्यांच्या पलीकडचे Recognition", en: "Recognition Beyond Numbers" })}</h3>
                <p>{L({ mr: "आकडे आपण किती साध्य केले हे सांगतात, पण त्याचा खरा अर्थ नेहमीच सांगत नाहीत. प्रत्येक Admission मागे एक Learner असतो. प्रत्येक Learner मागे एक स्वप्न असते.", en: "Numbers tell us how much we have achieved, but not always what that achievement means. Behind every admission is a learner. Behind every learner is a dream." })}</p>
                <p className={s.cardClose}>{L({ mr: "Admission दार उघडते. Learning क्षमता घडवते. Progression करिअर घडवते.", en: "Admission opens the door. Learning builds capability. Progression builds careers." })}</p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== WHY RECOGNITION / WHAT WE BELIEVE ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.grid2}>
            <Reveal>
              <div className={b.panel}>
                <span className={s.label}><Lightbulb size={14} /> {L({ mr: "Recognition का?", en: "Why Recognition?" })}</span>
                <h2 className={b.panelTitle}>{L({ mr: "प्रत्येक योगदान पाहिले जाण्यास पात्र आहे", en: "Because Every Contribution Deserves to Be Seen" })}</h2>
                <p>{L({ mr: "प्रत्येकाचे योगदान सारखे नसते. कुणी Business वाढवतो, कुणी शिकण्याचा अनुभव अधिक चांगला बनवतो, कुणी अधिक Learners ना ecosystem मध्ये आणतो, तर कुणी शांतपणे प्रत्येक Learner पुढे जात राहील याची खात्री करतो.", en: "Not every contribution looks the same. Some build their business. Some transform the learning experience. Some bring more learners into the ecosystem. Some quietly ensure that every learner keeps moving forward." })}</p>
                <p className={s.em}>{L({ mr: "Recognition हे सर्व योगदान एकत्र आणते. कारण उत्कृष्टतेला केवळ मोजमापच नाही, तर कृतज्ञतापूर्वक स्वीकृतीही हवी असते.", en: "Recognition brings these contributions together. Because excellence deserves more than measurement — it deserves acknowledgement." })}</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className={`${b.panel} ${b.panelGreen}`}>
                <span className={`${s.label} ${b.labelGreen}`}><Users size={14} /> {L({ mr: "आम्हाला काय वाटते", en: "What We Believe" })}</span>
                <h2 className={b.panelTitle}>{L({ mr: "यश म्हणजे एकट्याने पुढे जाणे नव्हे", en: "Success Is Not About Moving Ahead Alone" })}</h2>
                <p>{L({ mr: "सर्वात मजबूत ALC ती नाही जी सर्वात वेगाने वाढते, तर ती आहे जी आपल्या Learners ना सोबत घेऊन वाढते — जी सहभागी होते, जुळवून घेते, शिकते, सुधारते आणि योगदान देते.", en: "We believe the strongest ALC is not simply the one that grows the fastest. It is the one that grows while taking its learners forward — the one that participates, adapts, learns, improves and contributes." })}</p>
                <p className={s.em}>{L({ mr: "अशा शेकडो ALCs जेव्हा एकत्र वाटचाल करतात, तेव्हा एक संपूर्ण जिल्हा पुढे जातो.", en: "When hundreds of such ALCs move together, something bigger happens — an entire district moves forward." })}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FRAMEWORK BACKGROUND ===== */}
      <section className={`${s.section} ${s.green}`} id="background">
        <div className={s.inner}>
          <Reveal>
            <span className={`${s.label} ${b.labelGreen}`}><Compass size={14} /> {L({ mr: "Framework मागील भूमिका", en: "Framework Background" })}</span>
            <h2 className={s.h2}>{L({ mr: "Recognition follows Contribution — योगदानानुसारच गौरव", en: "Recognition Follows Contribution" })}</h2>
            <p className={s.lead}>{L({ mr: "अनेक वर्षे आपल्या नेटवर्कमध्ये यशाचे प्रमुख मोजमाप Admissions होते. यावर्षीपासून आपण केवळ Admissions नव्हे, तर Learner आणि ALC यांच्या संपूर्ण प्रवासातील योगदानाचे मोजमाप करणार आहोत.", en: "For many years, admissions were the key measure of success in our network. From this year, we will measure not just admissions, but the full journey of contribution by the learner and the ALC." })}</p>
          </Reveal>

          <Reveal>
            <p className={b.flow}>{L({ mr: "Business वाढवा → प्रत्येक Learner ला पुढे घेऊन जा → MKCL Ecosystem शी सक्रियपणे जोडा → प्रत्येक Learner प्रत्यक्ष शिकत आहे याची खात्री करा → व्यावसायिक उत्कृष्टतेने कार्य करा.", en: "Grow the business → Take every learner forward → Actively connect with the MKCL Ecosystem → Ensure every learner is genuinely learning → Work with professional excellence." })}</p>
          </Reveal>

          <Reveal>
            <div className={b.culture}>
              <div className={b.cultureCol}>
                <span>{L({ mr: "यापूर्वी", en: "Until Now" })}</span>
                <strong>Admission = Success</strong>
              </div>
              <span className={b.arrow}>→</span>
              <div className={`${b.cultureCol} ${b.cultureNew}`}>
                <span>{L({ mr: "यापुढे", en: "From Now On" })}</span>
                <strong>Admission → Learning → Completion → Progression = Success</strong>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h3 className={b.subHead}>{L({ mr: "आपल्याला कोणती कार्यसंस्कृती निर्माण करायची आहे?", en: "What Kind of Culture Are We Building?" })}</h3>
            <ol className={b.rules}>
              <li>{L({ mr: "प्रत्येक MS-CIT Learner ने पुढील शिक्षणाच्या प्रवासात किमान एक पाऊल पुढे टाकावे — म्हणजे 30, 60, 90 किंवा 120 तासांचा KLiC किंवा CCTP Course निवडावा.", en: "Every MS-CIT learner should take at least one step forward in their learning journey — choosing a 30, 60, 90 or 120-hour KLiC or CCTP course." })}</li>
              <li>{L({ mr: "हे पाऊल सर्वात मोठेच असावे, अशी अपेक्षा नाही.", en: "This step need not be the biggest one — any forward step counts." })}</li>
              <li>{L({ mr: "प्रत्येक Learner ची प्रगती महत्त्वाची आहे. Learner ने निवडलेल्या Course च्या कालावधीची पर्वा न करता प्रत्येक Admission ला समान महत्त्व दिले जाईल.", en: "Every learner's progress matters. Regardless of the course duration chosen, every admission will be given equal importance." })}</li>
              <li>{L({ mr: "30 तासांचा Course हा KLiC मध्ये प्रवेशाचा नैसर्गिक पहिला टप्पा बनेल, तर 90 व 120 तासांच्या Courses मधील उत्कृष्ट कामगिरीला स्वतंत्र Special Recognitions द्वारे गौरवण्यात येईल.", en: "The 30-hour course becomes the natural entry step into KLiC, while outstanding performance in 90- and 120-hour courses will be honoured through separate Special Recognitions." })}</li>
            </ol>
          </Reveal>

          <Reveal>
            <h3 className={b.subHead}>{L({ mr: "आपला स्पष्ट रोडमॅप", en: "Our Clear Roadmap" })}</h3>
            <div className={b.journey}>
              {journey.map((j, i) => (
                <div className={b.journeyItem} key={j.y}>
                  <span className={b.year}>{j.y}</span>
                  <strong>{L(j.tag)}</strong>
                  <p>{L(j.d)}</p>
                  {i < journey.length - 1 && <i className={b.joiner} />}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className={b.district}>
              <Garden side="right" />
              <h3>District Excellence Championship</h3>
              <p>{L({ mr: "जिल्ह्याचा विजय हा एकट्या ALC मुळे नाही, तर संपूर्ण जिल्ह्यातील ALCs च्या सहकार्यामुळे घडतो. याच सामूहिक उत्कृष्टतेचा गौरव District Excellence Championship द्वारे करण्यात येईल.", en: "A district's victory is never the achievement of one ALC alone — it comes from the collaboration of every ALC in the district. This collective excellence will be honoured through the District Excellence Championship." })}</p>
            </div>
            <p className={b.belief}>{L({ mr: "आपला विश्वास — Admission दार उघडते…… Learning क्षमता घडवते…… Progression करिअर घडवते.", en: "Our belief — Admission opens the door…… Learning builds capability…… Progression builds careers." })}</p>
            <FlowerDivider />
          </Reveal>
        </div>
      </section>
    </>
  );
}