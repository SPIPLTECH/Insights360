"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Bell, Footprints, HeartHandshake } from "lucide-react";
import { leaderboardChips, progressChips, recognitionSentence } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import Garden, { FlowerDivider } from "./Garden";
import s from "./site.module.css";
import c from "./ClosingSection.module.css";

/** District excellence + Learner-at-centre, dashboard CTAs, announcements teaser, one-sentence & closing message. */
export default function ClosingSection() {
  const { L } = useLang();
  return (
    <>
      {/* ===== District Excellence / Learner at the centre ===== */}
      <section className={`${s.section} ${s.tint}`}>
        <div className={s.inner}>
          <div className={s.grid2}>
            <Reveal>
              <div className={c.panel}>
                <span className={s.label}><HeartHandshake size={14} /> {L({ mr: "जिल्हा उत्कृष्टता", en: "District Excellence" })}</span>
                <h2 className={c.pTitle}>{L({ mr: "एक ALC वाढते तेव्हा प्रेरणा मिळते. जिल्हा वाढतो तेव्हा परिवर्तन घडते.", en: "When One ALC Grows, It Inspires. When a District Grows, It Transforms." })}</h2>
                <p>{L({ mr: "जिल्हा उत्कृष्टता ही कधीच एका केंद्राची एकट्याची कामगिरी नसते. ती शेकडो प्रयत्नांतून घडते — एक Learner, एक वर्ग, एक ALC यातून.", en: "District excellence is never the achievement of one centre alone. It is built through hundreds of efforts — one learner, one classroom, one ALC at a time." })}</p>
                <p className={s.em}>{L({ mr: "District Excellence Championship हा सामूहिक प्रवास साजरा करते आणि आठवण करून देते की आपले सर्वात मोठे विजय हे एकत्र घडवलेले असतात.", en: "The District Excellence Championship celebrates this collective journey and reminds us that our biggest victories are the ones we create together." })}</p>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className={c.panel}>
                <span className={s.label}><Footprints size={14} /> {L({ mr: "केंद्रस्थानी Learner", en: "The Learner at the Centre" })}</span>
                <h2 className={c.pTitle}>{L({ mr: "प्रत्येक आकड्यामागे एक Learner आहे.", en: "Behind Every Number, There Is a Learner." })}</h2>
                <p>{L({ mr: "Dashboard वरील एखादा आकडा छोटा वाटू शकतो. पण त्यामागे कदाचित पहिले Digital Skill शिकणारा विद्यार्थी असतो, नवीन Career संधी शोधणारा तरुण असतो किंवा अधिक आत्मविश्वासपूर्ण भविष्याकडे पहिले पाऊल टाकणारी व्यक्ती असते.", en: "A number on a dashboard may look small. But behind it could be a student learning their first digital skill, a young person discovering a new career possibility, or someone taking their first step towards a more confident future." })}</p>
                <p className={s.em}>{L({ mr: "म्हणूनच Learning Excellence महत्त्वाचे आहे. कारण आपले काम शेवटी आकड्यांबद्दल नसते. ते माणसांबद्दल असते.", en: "That is why Learning Excellence matters. Because our work is ultimately not about numbers. It is about people." })}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Leaderboard / Centre-wise progress ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <div className={s.grid2}>
            <Reveal>
              <Link href="/dashboard" className={c.cta}>
                <span className={c.ctaIcon}><BarChart3 size={24} /></span>
                <span className={s.kicker}>{L({ mr: "Leaderboard", en: "Leaderboard" })}</span>
                <h2>{L({ mr: "आपण कुठे उभे आहात ते पहा.", en: "See Where You Stand." })}</h2>
                <p>{L({ mr: "आपण एकत्र किती पुढे जाऊ शकतो ते पहा. विदर्भ ईस्टमधील ALCs ची प्रगती खालील निकषांनुसार पहा:", en: "See how far we can go together. Track the progress of ALCs across Vidarbha East. Explore rankings by:" })}</p>
                <ul className={s.chips}>{leaderboardChips.map((x) => <li key={x.en}>{L(x)}</li>)}</ul>
                <span className={c.go}>{L({ mr: "Dashboard वर जा", en: "Go to Dashboard" })} <ArrowRight size={16} /></span>
              </Link>
            </Reveal>
            <Reveal delay={140}>
              <Link href="/index-1" className={`${c.cta} ${c.ctaAlt}`}>
                <span className={c.ctaIcon}><Footprints size={24} /></span>
                <span className={s.kicker}>{L({ mr: "Centre-Wise Progress", en: "Centre-Wise Progress" })}</span>
                <h2>{L({ mr: "आपला प्रवास. आपली प्रगती. आपले Recognition.", en: "Your Journey. Your Progress. Your Recognition." })}</h2>
                <p>{L({ mr: "प्रत्येक Recognition Index वर आपल्या ALC ची कामगिरी पहा. ट्रॅक करा:", en: "See your ALC's performance across every Recognition Index. Track:" })}</p>
                <ul className={s.chips}>{progressChips.map((x) => <li key={x.en}>{L(x)}</li>)}</ul>
                <span className={c.go}>{L({ mr: "Index Points तपासा", en: "Check Index Points" })} <ArrowRight size={16} /></span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== Announcements teaser ===== */}
      <section className={`${s.section} ${s.center}`} id="announcements">
        <div className={s.inner} style={{ maxWidth: 720 }}>
          <Reveal>
            <span className={s.label}><Bell size={14} /> {L({ mr: "घोषणा", en: "Announcements" })}</span>
            <h2 className={s.h2}>{L({ mr: "जोडलेले रहा. पुढे रहा.", en: "Stay Connected. Stay Ahead." })}</h2>
            <p>{L({ mr: "नवीनतम अद्यतने, महत्त्वाच्या घोषणा, Recognition Updates आणि Regional Meet ची माहिती फॉलो करा.", en: "Follow the latest updates, important announcements, recognition updates and Regional Meet information." })}</p>
            <p className={s.em}>{L({ mr: "प्रत्येक टप्पा साजरा करण्यास पात्र आहे. प्रत्येक महत्त्वाचा क्षण शेअर करण्यास पात्र आहे.", en: "Every milestone deserves to be celebrated. Every important moment deserves to be shared." })}</p>
            <Link href="/announcements" className={s.btn}>{L({ mr: "सर्व घोषणा पहा", en: "View all announcements" })} <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* ===== The whole framework in one sentence ===== */}
      <section className={`${s.section} ${s.green} ${s.center}`}>
        <div className={s.inner} style={{ maxWidth: 880 }}>
          <Reveal>
            <span className={s.label} style={{ background: "#c9efd5", color: "#14532d" }}>{L({ mr: "Recognition follows Contribution", en: "Recognition Follows Contribution" })}</span>
            <h2 className={s.h2}>{L({ mr: "संपूर्ण Framework एका वाक्यात", en: "The Whole Framework in One Sentence" })}</h2>
            <p>{L({ mr: "प्रत्येक केंद्र आणि जिल्ह्याला काय करायचे आहे, ते एका वाक्यात असे वाचता येते:", en: "The whole framework can be read as one sentence about what every centre and district is asked to do:" })}</p>
          </Reveal>
          <ol className={c.sentence}>
            {recognitionSentence.map((r, i) => (
              <Reveal key={i} delay={(i % 2) * 80}><li>{L(r)}</li></Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Closing message ===== */}
      <section className={`${s.section} ${s.center} ${c.closing}`}>
        <Garden side="left" />
        <Garden side="right" />
        <div className={s.inner} style={{ maxWidth: 760 }}>
          <Reveal>
            <span className={s.label}>{L({ mr: "समारोप संदेश", en: "Closing Message" })}</span>
            <h2 className={`${s.h2} ${s.gradText}`} style={{ fontStyle: "italic", fontSize: "clamp(28px,5vw,44px)" }}>{L({ mr: "ही केवळ एक शर्यत नाही.", en: "This Is More Than a Race." })}</h2>
            <p>{L({ mr: "ही प्रत्येक पहाटे, प्रत्येक मार्गदर्शन केलेल्या Learner, प्रत्येक पार केलेल्या आव्हानाची आणि इथवर पोहोचवणाऱ्या प्रत्येक छोट्या पावलाची पावती आहे. ही अशा लोकांची पावती आहे ज्यांनी बांधणी करत राहणे, शिकत राहणे आणि पुढे जात राहणे निवडले.", en: "It is a recognition of every early morning, every learner guided, every challenge overcome and every small step that brought us here. It is a recognition of the people who chose to keep building, keep learning and keep moving forward." })}</p>
            <p><b>{L({ mr: "आणि हा नवा अध्याय सुरू करताना, आपण लक्षात ठेवूया:", en: "And as we begin this new chapter, let us remember:" })}</b></p>
            <p className={c.line}>{L({ mr: "आपण फक्त वाढण्यासाठी इथे नाही. आपण उद्देशाने वाढण्यासाठी इथे आहोत.", en: "We are not here only to grow. We are here to grow with purpose." })}</p>
            <p className={c.line}>{L({ mr: "फक्त पुढे जाण्यासाठी नाही. तर इतरांनाही सोबत पुढे नेण्यासाठी.", en: "Not just to move ahead. But to take others ahead with us." })}</p>
            <div className={c.tags}><span>Together Towards Excellence.</span><span>Together Towards Growth.</span></div>
            <FlowerDivider />
          </Reveal>
        </div>
      </section>
    </>
  );
}
