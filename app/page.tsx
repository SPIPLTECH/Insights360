"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import FrameworkRoad from "@/components/FrameworkRoad";
import LevelSteps from "@/components/LevelSteps";
import Link from "next/link";

type Lang = "mr" | "en";
type Bi = { mr: string; en: string };

const t = (lang: Lang, s: Bi) => s[lang];

/* ============================================================
   STATIC BILINGUAL CONTENT
   ============================================================ */

const journey: { y: string; tag: Bi; d: Bi }[] = [
  { y: "2026", tag: { mr: "मोजमाप (MEASURE)", en: "MEASURE" }, d: { mr: "Learning चे मोजमाप सुरू करू आणि योग्य Benchmarks निश्चित करू.", en: "Begin measuring learning and establish meaningful benchmarks." } },
  { y: "2027", tag: { mr: "सुधारणा (IMPROVE)", en: "IMPROVE" }, d: { mr: "मिळालेल्या माहितीचा वापर करून Learning Practices मध्ये सातत्याने सुधारणा करू.", en: "Use what we learn to continuously improve learning practices." } },
  { y: "2028", tag: { mr: "उत्कृष्टता (EXCEL)", en: "EXCEL" }, d: { mr: "Learning मधील उत्कृष्टतेचा गौरव आणि उत्सव साजरा करू.", en: "Celebrate and recognise excellence in learning." } },
];

const leaderboardChips: Bi[] = [
  { mr: "ALC", en: "ALC" },
  { mr: "जिल्हा (District)", en: "District" },
  { mr: "Recognition Level", en: "Recognition Level" },
  { mr: "कामगिरी (Performance)", en: "Performance" },
  { mr: "वाढ (Growth)", en: "Growth" },
];

const progressChips: Bi[] = [
  { mr: "सद्यस्थिती गुण (Current Score)", en: "Current Score" },
  { mr: "Recognition Level", en: "Recognition Level" },
  { mr: "Index-निहाय कामगिरी", en: "Index-wise Performance" },
  { mr: "Target Achievement", en: "Target Achievement" },
  { mr: "वाढ (Growth)", en: "Growth" },
  { mr: "Learning Excellence", en: "Learning Excellence" },
  { mr: "Bonus / Credits", en: "Bonus / Credits" },
  { mr: "पुढील Level कडे वाटचाल", en: "Progress towards the next level" },
];

/* ---- Index 1: Business Growth ---- */
const businessGrowthUrban = [
  { param: { mr: "MS-CIT Admissions", en: "MS-CIT Admissions" }, target: 425, points: 200 },
  { param: { mr: "KLiC Admissions", en: "KLiC Admissions" }, target: 250, points: 100 },
  { param: { mr: "CCTP Admissions", en: "CCTP Admissions" }, target: 150, points: 50 },
];
const businessGrowthRural = [
  { param: { mr: "MS-CIT Admissions", en: "MS-CIT Admissions" }, target: 250, points: 200 },
  { param: { mr: "KLiC Admissions", en: "KLiC Admissions" }, target: 125, points: 100 },
  { param: { mr: "CCTP Admissions", en: "CCTP Admissions" }, target: 75, points: 50 },
];

/* ---- Index 2: Ecosystem Participation ---- */
const ecosystemRows = [
  { init: { mr: "MoM", en: "MoM" }, measure: { mr: "District Target साध्य (Dashboard)", en: "District target achieved (Dashboard)" }, target: 100, points: 50 },
  { init: { mr: "AI Masterclass", en: "AI Masterclass" }, measure: { mr: "Target साध्य (Dashboard)", en: "Target achieved (Dashboard)" }, target: 250, points: 60 },
  { init: { mr: "SSC / HSC", en: "SSC / HSC" }, measure: { mr: "आयोजित. SOLAR वर DCUs verify व Confirm करतील", en: "Conducted. SOLAR, DCUs to verify & Confirm" }, target: 250, points: 60 },
  { init: { mr: "ODOT 1", en: "ODOT 1" }, measure: { mr: "सहभाग नोंदवला", en: "Participated" }, target: null, points: 15 },
  { init: { mr: "ODOT 2", en: "ODOT 2" }, measure: { mr: "सहभाग नोंदवला", en: "Participated" }, target: null, points: 15 },
];

/* ---- Index 3: Learning Excellence — MS-CIT ---- */
const learningMSCIT = [
  { m: { mr: "वेळेत शिक्षणाची सुरुवात", en: "Timely Learning Start" }, d: { mr: "Admission Confirmation नंतर अपेक्षित कालावधीत Learner ने ERA वरील शिक्षणास प्रारंभ केला का?", en: "Did the learner start learning on ERA within the expected period after admission confirmation?" }, points: 20 },
  { m: { mr: "सातत्यपूर्ण शिक्षण", en: "Learning Consistency" }, d: { mr: "Learner ने ERA वर नियमित व सातत्यपूर्ण पद्धतीने शिक्षण घेतले, की शेवटच्या टप्प्यात एकत्रित (Bunched) शिक्षण पूर्ण केले?", en: "Did the learner study on ERA regularly and consistently, or complete it in a last-minute bunch?" }, points: 20 },
  { m: { mr: "अभ्यासक्रम पूर्णता", en: "Course Completion" }, d: { mr: "निर्धारित Learning Sessions व Course पूर्ण करण्यासाठी आवश्यक अनिवार्य बाबी यशस्वीरीत्या पूर्ण केल्या का?", en: "Were all required learning sessions and mandatory course-completion elements finished?" }, points: 20 },
  { m: { mr: "बायोमेट्रिक उपस्थिती", en: "Biometric Attendance" }, d: { mr: "Learner ने ALC मध्ये नियमित प्रत्यक्ष उपस्थिती राखली का?", en: "Did the learner maintain regular physical attendance at the ALC?" }, points: 20 },
  { m: { mr: "Learner App वापर", en: "Learner App Usage" }, d: { mr: "Learner ने Learner App Download करून Activate केले व वापरास सुरुवात केली का?", en: "Did the learner download, activate and start using the Learner App?" }, points: 20 },
  { m: { mr: "यशस्वी प्रमाणपत्र प्राप्ती", en: "Certification Success" }, d: { mr: "Learner ने संपूर्ण प्रवास पूर्ण करून परीक्षा दिली व प्रमाणपत्र (Certification) प्राप्त केले का?", en: "Did the learner complete the journey, take the exam, and earn certification?" }, points: 20 },
];

const learningKLiC = [
  { m: { mr: "वेळेत शिक्षणाची सुरुवात", en: "Timely Learning Start" }, d: { mr: "Learning Access मिळाल्यानंतर अपेक्षित कालावधीत ERA वरील शिक्षणास प्रारंभ केला का?", en: "Did the learner start ERA learning within the expected period after access was granted?" }, points: 20 },
  { m: { mr: "सातत्यपूर्ण शिक्षण", en: "Learning Consistency" }, d: { mr: "ERA वर नियमित व सातत्यपूर्ण पद्धतीने शिक्षण घेतले, की शेवटच्या टप्प्यात एकत्रित शिक्षण पूर्ण केले?", en: "Was learning regular and consistent, or bunched at the end?" }, points: 20 },
  { m: { mr: "अभ्यासक्रम पूर्णता", en: "Course Completion" }, d: { mr: "निर्धारित Sessions व अनिवार्य बाबी यशस्वीरीत्या पूर्ण केल्या का?", en: "Were required sessions and mandatory elements completed successfully?" }, points: 20 },
  { m: { mr: "यशस्वी प्रमाणपत्र प्राप्ती", en: "Certification Success" }, d: { mr: "परीक्षा देऊन प्रमाणपत्र यशस्वीरीत्या प्राप्त केले का?", en: "Was the exam taken and certification successfully earned?" }, points: 20 },
];

/* ---- Index 4: Professional Excellence ---- */
const professionalRows = [
  { param: { mr: "Meeting Attendance", en: "Meeting Attendance" }, measure: { mr: "उपस्थिती % — DCU कडून", en: "Attendance %: from DCU" }, evidence: { mr: "Attendance Register", en: "Attendance Register" }, points: 25 },
  { param: { mr: "Examination Compliance (CCTV)", en: "Examination Compliance (CCTV)" }, measure: { mr: "DCU", en: "DCU" }, evidence: { mr: "Audit Report", en: "Audit Report" }, points: 25 },
  { param: { mr: "Social Media Presence", en: "Social Media Presence" }, measure: { mr: "DCU Approved", en: "DCU Approved" }, evidence: { mr: "Link", en: "link" }, points: 25 },
  { param: { mr: "Month-wise Enrolment Consistency", en: "Month-wise Enrolment Consistency" }, measure: { mr: "प्रत्येक महिन्यात Admissions", en: "Admissions in every month" }, evidence: { mr: "SOLAR", en: "SOLAR" }, points: 25 },
];

/* ---- Glance / Contents table ---- */
const glanceRows = [
  { n: 1, idx: { mr: "Business Growth Index", en: "Business Growth Index" }, max: 350, min: 88, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
  { n: 2, idx: { mr: "Ecosystem Participation Index", en: "Ecosystem Participation Index" }, max: 200, min: 50, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
  { n: 3, idx: { mr: "Learning Excellence Index", en: "Learning Excellence Index" }, max: 200, min: 30, bonus: { mr: "मर्यादा नाही (NO LIMIT)", en: "NO LIMIT" } },
  { n: 4, idx: { mr: "Professional Excellence Index", en: "Professional Excellence Index" }, max: 100, min: 25, bonus: { mr: "खालील तक्त्याप्रमाणे", en: "As per table below" } },
];

const awardLevels = [
  { level: { mr: "Platinum", en: "Platinum" }, pct: "90% & above", score: "765+" },
  { level: { mr: "Gold", en: "Gold" }, pct: "75% – 89.9%", score: "637 – 764" },
  { level: { mr: "Silver", en: "Silver" }, pct: "60% – 74.9%", score: "510 – 636" },
  { level: { mr: "Bronze", en: "Bronze" }, pct: "50% – 59.9%", score: "425 – 509" },
];

const bonusSlabs = [
  { range: { mr: "Target पेक्षा 10% पर्यंत जास्त", en: "Till 10% beyond the target" }, rate: { mr: "काहीही नाही", en: "None" } },
  { range: { mr: "10.1% ते 40%", en: "Between 10.1% to 40%" }, rate: { mr: "Max. Points च्या 35%", en: "35% of the Max. Points" } },
  { range: { mr: "40.1% ते 80%", en: "Between 40.1% to 80%" }, rate: { mr: "Max. Points च्या 75%", en: "75% of the Max. Points" } },
  { range: { mr: "80.1% ते 100%", en: "Between 80.1% to 100%" }, rate: { mr: "Max. Points च्या 100%", en: "100% of the Max. Points" } },
  { range: { mr: "Target च्या पलीकडे (100% हून अधिक)", en: "Beyond 100% of the target" }, rate: { mr: "Max. Points च्या 120%", en: "120% of the Max. Points" } },
];

const contestNorms: Bi[] = [
  { mr: "Contest ची अंतिम तारीख: 30 नोव्हेंबर 2026.", en: "Last date of contest: 30 November 2026." },
  { mr: "1 जानेवारी 2026 ते 30 नोव्हेंबर 2026 दरम्यान झालेल्या सर्व Admissions गणल्या जातील.", en: "All admissions done from Jan 1, 2026 till 30th Nov. 2026 will be counted." },
  { mr: "Course च्या तासांचा विचार न करता प्रत्येक Admission ही ONE म्हणूनच गणली जाईल.", en: "Every admission is counted as ONE, irrespective of course hours." },
  { mr: "Eligibility Floor: प्रत्येक Index मध्ये सहभाग असणे आवश्यक आहे.", en: "Eligibility Floor: Participation in every Index is required." },
  { mr: "Excellence Bonus स्वतंत्र, Uncapped आणि Accelerating आहे — Target च्या पलीकडे मिळणाऱ्या प्रत्येक गुणासाठी Slab-निहाय दराने Bonus मिळतो.", en: "Excellence Bonus is separate, uncapped, and accelerating — every point beyond target earns a bonus, applied slab by slab." },
  { mr: "Growth Bonus हा 850 गुणांमध्ये जोडला जात नाही व Recognition Level बदलत नाही — तो फक्त एकाच Level मधील ALCs ना खऱ्या वाढीनुसार क्रमवारी देण्यासाठी वापरला जातो.", en: "The Growth Bonus is not added to the 850 and does not change the recognition level — it only ranks centres within the same level by real growth." },
  { mr: "Bonus ची गणना प्रत्येक Index साठी आणि Index मधील प्रत्येक Parameter साठी स्वतंत्रपणे केली जाते.", en: "The bonus is computed separately for every index and for every parameter within the index." },
];

const recognitionSentence: Bi[] = [
  { mr: "Business वाढवा.", en: "Grow the business." },
  { mr: "प्रत्येक Learner ला पुढे घेऊन जा.", en: "Progress every learner." },
  { mr: "MKCL Ecosystem आपलेसे करा.", en: "Embrace the MKCL ecosystem." },
  { mr: "Learning Excellence घडवा.", en: "Build learning excellence." },
  { mr: "व्यावसायिकतेने कार्य करा.", en: "Operate professionally." },
  { mr: "जिल्ह्याचे रूपांतर घडवा.", en: "Transform the district." },
];

/* ============================================================ */

export default function Home() {
  const [lang, setLang] = useState<Lang>("mr");
  const L = (b: Bi) => t(lang, b);

  return (
    <>
      <Navbar />

      {/* ===== LANGUAGE SWITCH ===== */}
      <div className="lang-switch" role="tablist" aria-label="Language">
        <button
          role="tab"
          aria-selected={lang === "mr"}
          className={lang === "mr" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLang("mr")}
        >
          मराठी
        </button>
        <button
          role="tab"
          aria-selected={lang === "en"}
          className={lang === "en" ? "lang-btn active" : "lang-btn"}
          onClick={() => setLang("en")}
        >
          English
        </button>
      </div>

      <main className="page">
        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-media">
            <ImageCarousel />
          </div>
        </section>

        {/* ===== TITLE BLOCK ===== */}
        <section className="titleblock">
          <span className="section-label">
            {L({ mr: "वार्षिक विभागीय मेळावा पुरस्कार 2026-27", en: "Annual Regional Meet Awards 2026-27" })}
          </span>
          <h1 className="titleblock-h1">VIDARBHA EAST RACE TO RECOGNITION</h1>
          <p className="titleblock-sub">
            {L({ mr: "Recognition Framework", en: "Recognition Framework" })}
          </p>
          <p className="titleblock-tag">
            {L({ mr: "Together Towards Excellence • Together Towards Growth", en: "Together Towards Excellence • Together Towards Growth" })}
          </p>
        </section>

        {/* ===== PREFACE ===== */}
        <section className="preface">
          <span className="section-label">{L({ mr: "प्रस्तावना", en: "Preface" })}</span>
          <h2>{L({ mr: "Recognition Beyond Numbers", en: "Recognition Beyond Numbers" })}</h2>
          <p className="preface-text">
              {L({
                mr: "गेल्या दोन दशकांहून अधिक काळात आपण सर्वांनी मिळून विदर्भ ईस्टमध्ये लाखो Learners पर्यंत Digital Literacy आणि Career-oriented Education पोहोचवले. या यशामध्ये आपल्या प्रत्येकाचे मोलाचे योगदान आहे.",
                en: "Over more than two decades, together we have brought Digital Literacy and Career-oriented Education to lakhs of learners across Vidarbha East. Every one of you has contributed meaningfully to this achievement.",
              })}
              {" "}
              {L({
                mr: "आज मात्र आपल्या सभोवतालचे जग वेगाने बदलत आहे. Artificial Intelligence मुळे शिकण्याची, काम करण्याची आणि Career घडवण्याची पद्धतच बदलली आहे. Learners आता केवळ Computer Course शोधत नाहीत; त्यांना Future Ready व्हायचे आहे.",
                en: "Today the world around us is changing fast. Artificial Intelligence has changed how people learn, work and build careers. Learners no longer just want a computer course — they want to become future-ready.",
              })}
              {" "}
              {L({
                mr: "याच भूमिकेतून Vidarbha East Race to Recognition Framework सादर करत आहोत. ही केवळ Award Scheme नसून, आपल्या Business Growth, Learner Progression, Learning Excellence, Ecosystem Participation आणि Professional Contribution चा व्यापक गौरव करणारी Leadership Framework आहे.",
                en: "With this in mind, we present the Vidarbha East Race to Recognition Framework — not merely an award scheme, but a leadership framework that recognises Business Growth, Learner Progression, Learning Excellence, Ecosystem Participation and Professional Contribution together.",
              })}
          </p>
          <p className="emphasis">
            {L({
              mr: "Race to Recognition ही केवळ Competition नाही — ती Excellence, Continuous Learning आणि Contribution मधून Leadership घडवण्याची आणि AI Era साठी समाजाला तयार करण्याची आपल्या सर्वांची सामूहिक Commitment आहे.",
              en: "Race to Recognition is not just a competition — it is our collective commitment to building leadership through excellence, continuous learning and contribution, and to preparing society for the AI era.",
            })}
          </p>
          <p className="pref-sign">
            {L({ mr: "खूप खूप शुभेच्छा — सर्व MRCU व DCUs, पूर्व विदर्भ विभाग", en: "With very best wishes — All MRCUs & DCUs, East Vidarbha Division" })}
          </p>
        </section>

        {/* ===== MISSION / VISION / PHILOSOPHY ===== */}
        <section className="triad">
          <article className="card">
            <span className="card-kicker">{L({ mr: "आमचे ध्येय", en: "Our Mission" })}</span>
            <h2>{L({ mr: "प्रत्येक Learner ला पुढे घेऊन जाणे", en: "To Move Every Learner Forward" })}</h2>
            <ul className="pillars">
              <li>{L({ mr: "Business वाढवणे", en: "Grow the business" })}</li>
              <li>{L({ mr: "प्रत्येक Learner ची प्रगती", en: "Progress every learner" })}</li>
              <li>{L({ mr: "Learning Excellence घडवणे", en: "Build learning excellence" })}</li>
              <li>{L({ mr: "Ecosystem अधिक मजबूत करणे", en: "Strengthen the ecosystem" })}</li>
              <li>{L({ mr: "अर्थपूर्ण प्रभाव निर्माण करणे", en: "Create meaningful impact" })}</li>
            </ul>
            <p className="card-close">
              {L({ mr: "कारण वाढ खऱ्या अर्थाने तेव्हाच सार्थक ठरते, जेव्हा ती इतरांसाठी संधी निर्माण करते.", en: "Because growth becomes truly meaningful when it creates opportunities for others." })}
            </p>
          </article>

          <article className="card">
            <span className="card-kicker">{L({ mr: "आमची दृष्टी", en: "Our Vision" })}</span>
            <h2>{L({ mr: "वैयक्तिक प्रयत्नांपासून सामूहिक उत्कृष्टतेकडे", en: "From Individual Effort to Collective Excellence" })}</h2>
            <p>
              {L({
                mr: "आम्ही अशा विदर्भ ईस्टचे स्वप्न पाहतो जिथे प्रत्येक ALC संधीचे केंद्र बनेल, प्रत्येक Learner ला पुढे जाण्याची संधी मिळेल आणि प्रत्येक जिल्हा सामूहिक उत्कृष्टतेतून वाढेल.",
                en: "We envision a Vidarbha East where every ALC becomes a centre of opportunity, every learner gets the chance to progress, and every district grows through collective excellence.",
              })}
            </p>
            <p className="card-close">
              {L({ mr: "हा एक अधिक सक्षम, बळकट आणि भविष्यासाठी सज्ज असा समुदाय घडवण्याचा प्रवास आहे.", en: "It is about creating a stronger, more capable and future-ready community." })}
            </p>
          </article>

          <article className="card">
            <span className="card-kicker">{L({ mr: "आमचे तत्त्वज्ञान", en: "Our Philosophy" })}</span>
            <h2>{L({ mr: "आकड्यांच्या पलीकडचे Recognition", en: "Recognition Beyond Numbers" })}</h2>
            <p>
              {L({
                mr: "आकडे आपण किती साध्य केले हे सांगतात, पण त्याचा खरा अर्थ नेहमीच सांगत नाहीत. प्रत्येक Admission मागे एक Learner असतो. प्रत्येक Learner मागे एक स्वप्न असते.",
                en: "Numbers tell us how much we have achieved, but not always what that achievement means. Behind every admission is a learner. Behind every learner is a dream.",
              })}
            </p>
            <p className="card-close">
              {L({ mr: "Admission दार उघडते. Learning क्षमता घडवते. Progression करिअर घडवते.", en: "Admission opens the door. Learning builds capability. Progression builds careers." })}
            </p>
          </article>
        </section>

        {/* ===== WHY RECOGNITION / WHAT WE BELIEVE ===== */}
        <section className="split">
          <div className="split-block">
            <span className="section-label">{L({ mr: "Recognition का?", en: "Why Recognition?" })}</span>
            <h2>{L({ mr: "प्रत्येक योगदान पाहिले जाण्यास पात्र आहे", en: "Because Every Contribution Deserves to Be Seen" })}</h2>
            <p>
              {L({
                mr: "प्रत्येकाचे योगदान सारखे नसते. कुणी Business वाढवतो, कुणी शिकण्याचा अनुभव अधिक चांगला बनवतो, कुणी अधिक Learners ना ecosystem मध्ये आणतो, तर कुणी शांतपणे प्रत्येक Learner पुढे जात राहील याची खात्री करतो.",
                en: "Not every contribution looks the same. Some build their business. Some transform the learning experience. Some bring more learners into the ecosystem. Some quietly ensure that every learner keeps moving forward.",
              })}
            </p>
            <p className="emphasis">
              {L({ mr: "Recognition हे सर्व योगदान एकत्र आणते. कारण उत्कृष्टतेला केवळ मोजमापच नाही, तर कृतज्ञतापूर्वक स्वीकृतीही हवी असते.", en: "Recognition brings these contributions together. Because excellence deserves more than measurement — it deserves acknowledgement." })}
            </p>
          </div>
          <div className="split-block">
            <span className="section-label">{L({ mr: "आम्हाला काय वाटते", en: "What We Believe" })}</span>
            <h2>{L({ mr: "यश म्हणजे एकट्याने पुढे जाणे नव्हे", en: "Success Is Not About Moving Ahead Alone" })}</h2>
            <p>
              {L({
                mr: "सर्वात मजबूत ALC ती नाही जी सर्वात वेगाने वाढते, तर ती आहे जी आपल्या Learners ना सोबत घेऊन वाढते — जी सहभागी होते, जुळवून घेते, शिकते, सुधारते आणि योगदान देते.",
                en: "We believe the strongest ALC is not simply the one that grows the fastest. It is the one that grows while taking its learners forward — the one that participates, adapts, learns, improves and contributes.",
              })}
            </p>
            <p className="emphasis">
              {L({ mr: "अशा शेकडो ALCs जेव्हा एकत्र वाटचाल करतात, तेव्हा एक संपूर्ण जिल्हा पुढे जातो.", en: "When hundreds of such ALCs move together, something bigger happens — an entire district moves forward." })}
            </p>
          </div>
        </section>

        {/* ===== FRAMEWORK BACKGROUND ===== */}
        <section className="fw-bg">
          <span className="section-label">{L({ mr: "Framework मागील भूमिका", en: "Framework Background" })}</span>
          <h2>{L({ mr: "Recognition follows Contribution — योगदानानुसारच गौरव", en: "Recognition Follows Contribution" })}</h2>
          <p>
            {L({
              mr: "अनेक वर्षे आपल्या नेटवर्कमध्ये यशाचे प्रमुख मोजमाप Admissions होते. यावर्षीपासून आपण केवळ Admissions नव्हे, तर Learner आणि ALC यांच्या संपूर्ण प्रवासातील योगदानाचे मोजमाप करणार आहोत.",
              en: "For many years, admissions were the key measure of success in our network. From this year, we will measure not just admissions, but the full journey of contribution by the learner and the ALC.",
            })}
          </p>
          <p className="fw-flow">
            {L({
              mr: "Business वाढवा → प्रत्येक Learner ला पुढे घेऊन जा → MKCL Ecosystem शी सक्रियपणे जोडा → प्रत्येक Learner प्रत्यक्ष शिकत आहे याची खात्री करा → व्यावसायिक उत्कृष्टतेने कार्य करा.",
              en: "Grow the business → Take every learner forward → Actively connect with the MKCL Ecosystem → Ensure every learner is genuinely learning → Work with professional excellence.",
            })}
          </p>

          <div className="fw-culture">
            <div className="fw-culture-col">
              <span className="fw-culture-label">{L({ mr: "यापूर्वी", en: "Until Now" })}</span>
              <p className="fw-culture-val">Admission = Success</p>
            </div>
            <span className="fw-culture-arrow">→</span>
            <div className="fw-culture-col">
              <span className="fw-culture-label">{L({ mr: "यापुढे", en: "From Now On" })}</span>
              <p className="fw-culture-val">Admission → Learning → Completion → Progression = Success</p>
            </div>
          </div>

          <div className="fw-rules">
            <h3>{L({ mr: "आपल्याला कोणती कार्यसंस्कृती निर्माण करायची आहे?", en: "What Kind of Culture Are We Building?" })}</h3>
            <ol>
              <li>{L({ mr: "प्रत्येक MS-CIT Learner ने पुढील शिक्षणाच्या प्रवासात किमान एक पाऊल पुढे टाकावे — म्हणजे 30, 60, 90 किंवा 120 तासांचा KLiC किंवा CCTP Course निवडावा.", en: "Every MS-CIT learner should take at least one step forward in their learning journey — choosing a 30, 60, 90 or 120-hour KLiC or CCTP course." })}</li>
              <li>{L({ mr: "हे पाऊल सर्वात मोठेच असावे, अशी अपेक्षा नाही.", en: "This step need not be the biggest one — any forward step counts." })}</li>
              <li>{L({ mr: "प्रत्येक Learner ची प्रगती महत्त्वाची आहे. Learner ने निवडलेल्या Course च्या कालावधीची पर्वा न करता प्रत्येक Admission ला समान महत्त्व दिले जाईल.", en: "Every learner's progress matters. Regardless of the course duration chosen, every admission will be given equal importance." })}</li>
              <li>{L({ mr: "30 तासांचा Course हा KLiC मध्ये प्रवेशाचा नैसर्गिक पहिला टप्पा बनेल, तर 90 व 120 तासांच्या Courses मधील उत्कृष्ट कामगिरीला स्वतंत्र Special Recognitions द्वारे गौरवण्यात येईल.", en: "The 30-hour course becomes the natural entry step into KLiC, while outstanding performance in 90- and 120-hour courses will be honoured through separate Special Recognitions." })}</li>
            </ol>
          </div>

          <div className="fw-roadmap">
            <h3>{L({ mr: "आपला स्पष्ट रोडमॅप", en: "Our Clear Roadmap" })}</h3>
            <div className="journey-row">
              {journey.map((j) => (
                <div className="journey-item" key={j.y}>
                  <span className="journey-year">{j.y}</span>
                  <span className="journey-tag">{L(j.tag)}</span>
                  <p>{L(j.d)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="fw-district">
            <h3>District Excellence Championship</h3>
            <p>
              {L({
                mr: "जिल्ह्याचा विजय हा एकट्या ALC मुळे नाही, तर संपूर्ण जिल्ह्यातील ALCs च्या सहकार्यामुळे घडतो. याच सामूहिक उत्कृष्टतेचा गौरव District Excellence Championship द्वारे करण्यात येईल.",
                en: "A district's victory is never the achievement of one ALC alone — it comes from the collaboration of every ALC in the district. This collective excellence will be honoured through the District Excellence Championship.",
              })}
            </p>
          </div>

          <p className="fw-belief">
            {L({ mr: "आपला विश्वास — Admission दार उघडते…… Learning क्षमता घडवते…… Progression करिअर घडवते.", en: "Our belief — Admission opens the door…… Learning builds capability…… Progression builds careers." })}
          </p>
        </section>

        {/* ===== FRAMEWORK — ZIGZAG ROAD ===== */}
        <section className="framework" id="framework">
          <span className="section-label">{L({ mr: "Recognition Framework", en: "The Recognition Framework" })}</span>
          <h2 className="framework-title">
            {L({ mr: "चार Indices. उत्कृष्टतेकडे जाणारा एक प्रवास.", en: "Four Dimensions. One Journey Towards Excellence." })}
          </h2>
          <p className="framework-sub">
            {L({ mr: "हा Framework एकूण 850 गुणांमधून ALC च्या कामगिरीचे संपूर्ण चित्र मांडतो.", en: "The framework looks at the complete picture of an ALC's performance across a total of 850 points." })}
          </p>

          <FrameworkRoad />

          <p className="framework-foot">
            {L({
              mr: "निर्धारित Target पेक्षा जास्त कामगिरी ही, त्याच Recognition Level मधील ALCs मध्ये लागू असलेल्या Growth Bonus द्वारे वेगळेपण दाखवते. Learning Excellence मध्ये सातत्यपूर्ण व अपवादात्मक कामगिरी ही स्वतंत्रपणे Learning Excellence Credits द्वारे गौरवली जाते.",
              en: "Performance beyond defined targets can further distinguish ALCs within the same recognition level through the applicable Growth Bonus. Within Learning Excellence, exceptional and continuous performance is recognised separately through Learning Excellence Credits.",
            })}
          </p>
        </section>

        {/* ===== CONTENTS AT A GLANCE ===== */}
        <section className="glance">
          <span className="section-label">{L({ mr: "एका दृष्टिक्षेपात Framework", en: "The Framework at a Glance" })}</span>
          <h2>{L({ mr: "चार Indices, एकूण 850 गुण", en: "Four Indices, 850 Points Total" })}</h2>

          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{L({ mr: "Recognition Index", en: "Recognition Index" })}</th>
                  <th>{L({ mr: "कमाल गुण", en: "Max. Points" })}</th>
                  <th>{L({ mr: "किमान गुण", en: "Min. Points" })}</th>
                  <th>{L({ mr: "Bonus", en: "Bonus Points" })}</th>
                </tr>
              </thead>
              <tbody>
                {glanceRows.map((r) => (
                  <tr key={r.n}>
                    <td>{r.n}</td>
                    <td>{L(r.idx)}</td>
                    <td>{r.max}</td>
                    <td>{r.min}</td>
                    <td>{L(r.bonus)}</td>
                  </tr>
                ))}
                <tr className="tbl-total">
                  <td colSpan={2}>{L({ mr: "अंतिम ALC Excellence Score", en: "Final ALC Excellence Score" })}</td>
                  <td colSpan={3}>850</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== INDEX 1 ===== */}
        <section className="index-section">
          <span className="index-num">01</span>
          <h2>{L({ mr: "Business Growth Index · 350 गुण", en: "Business Growth Index · 350 Points" })}</h2>
          <p className="index-phil">
            <strong>{L({ mr: "तत्त्व. ", en: "Philosophy. " })}</strong>
            {L({
              mr: "मूळ Business वाढवा. MS-CIT, KLiC आणि CCTP admissions मधील वाढ ही Business Revenue मधील वाढ दर्शवते, जी प्रत्येक ALC च्या Sustainability चा पाया आहे. प्रत्येक ALC Urban किंवा Rural क्षेत्रात कार्यरत असतो आणि त्याच्या स्वतःच्या श्रेणीतील तीन Parameters वरच त्याचे मूल्यांकन होते — MS-CIT + KLiC + CCTP = 350 गुण.",
              en: "Grow the core business. Growth in MS-CIT, KLiC and CCTP admissions reflects growth in business revenue, which remains the foundation of every ALC's sustainability. Each ALC operates in either an Urban or a Rural area, and is scored only on the three parameters of its own category — MS-CIT + KLiC + CCTP = 350 points.",
            })}
          </p>

          <div className="index-grid">
            <div className="table-wrap">
              <h4 className="table-caption">{L({ mr: "Urban ALC साठी", en: "For an Urban ALC" })}</h4>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>{L({ mr: "Parameter", en: "Parameter" })}</th>
                    <th>{L({ mr: "Target", en: "Target" })}</th>
                    <th>{L({ mr: "गुण", en: "Points" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {businessGrowthUrban.map((r) => (
                    <tr key={r.param.en}>
                      <td>{L(r.param)}</td>
                      <td>{r.target}</td>
                      <td>{r.points}</td>
                    </tr>
                  ))}
                  <tr className="tbl-total">
                    <td>{L({ mr: "एकूण (Urban Total)", en: "Urban Total" })}</td>
                    <td></td>
                    <td>350</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-wrap">
              <h4 className="table-caption">{L({ mr: "Rural ALC साठी", en: "For a Rural ALC" })}</h4>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>{L({ mr: "Parameter", en: "Parameter" })}</th>
                    <th>{L({ mr: "Target", en: "Target" })}</th>
                    <th>{L({ mr: "गुण", en: "Points" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {businessGrowthRural.map((r) => (
                    <tr key={r.param.en}>
                      <td>{L(r.param)}</td>
                      <td>{r.target}</td>
                      <td>{r.points}</td>
                    </tr>
                  ))}
                  <tr className="tbl-total">
                    <td>{L({ mr: "एकूण (Rural Total)", en: "Rural Total" })}</td>
                    <td></td>
                    <td>350</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="index-note">
            {L({ mr: "मोजमाप व पुरावा: Achievement vs. Target — Admission Portal.", en: "Measurement & evidence: Achievement vs. target — Admission Portal." })}
          </p>
        </section>

        {/* ===== INDEX 2 ===== */}
        <section className="index-section index-tint">
          <span className="index-num">02</span>
          <h2>{L({ mr: "Ecosystem Participation Index · 200 गुण", en: "Ecosystem Participation Index · 200 Points" })}</h2>
          <p className="index-phil">
            <strong>{L({ mr: "तत्त्व. ", en: "Philosophy. " })}</strong>
            {L({
              mr: "प्रत्येक ALC ने MKCL ने शिफारस केलेल्या सर्व उपक्रमांमध्ये सहभागी होणे अपेक्षित आहे — संपूर्ण Ecosystem मध्ये सहभाग, निवडक सहभाग नव्हे.",
              en: "Each ALC must participate in all the programmes recommended by MKCL — full-ecosystem participation, not selective adoption.",
            })}
          </p>

          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{L({ mr: "उपक्रम", en: "Initiative" })}</th>
                  <th>{L({ mr: "मोजमाप", en: "Measurement" })}</th>
                  <th>{L({ mr: "Target", en: "Target" })}</th>
                  <th>{L({ mr: "गुण", en: "Points" })}</th>
                </tr>
              </thead>
              <tbody>
                {ecosystemRows.map((r) => (
                  <tr key={r.init.en}>
                    <td>{L(r.init)}</td>
                    <td>{L(r.measure)}</td>
                    <td>{r.target ?? "—"}</td>
                    <td>{r.points}</td>
                  </tr>
                ))}
                <tr className="tbl-total">
                  <td colSpan={3}>{L({ mr: "एकूण (Pillar Total)", en: "Pillar Total" })}</td>
                  <td>200</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="index-note emphasis">
            {L({ mr: "संपूर्ण MKCL Ecosystem मधील सहभाग हा एक मानदंड आहे, पर्याय नाही.", en: "Participation across the whole MKCL ecosystem is a standard, not a choice." })}
          </p>
        </section>

        {/* ===== INDEX 3 ===== */}
        <section className="index-section">
          <span className="index-num">03</span>
          <h2>{L({ mr: "Learning Excellence Index (2026 पासून नवीन) · 200 गुण", en: "Learning Excellence Index (New in 2026) · 200 Points" })}</h2>
          <p className="index-phil">
            {L({
              mr: "Admission हा Learner च्या प्रवासाचा प्रारंभ आहे; शेवट नाही. हा Index Admission नंतरच्या Learner च्या संपूर्ण शिक्षण प्रवासाची दखल घेतो — प्रत्येक Admission चे रूपांतर अर्थपूर्ण शिक्षण, यशस्वी Course Completion आणि Career Progression मध्ये व्हावे यासाठी. 2026 मध्ये या Index ला मर्यादित Weightage देण्यात आले आहे; मात्र येत्या प्रत्येक वर्षी त्याचे महत्त्व टप्प्याटप्प्याने वाढत जाईल.",
              en: "Admission is the start of the learner's journey, not the end. This index tracks the learner's full journey after admission — so that every admission converts into meaningful learning, successful course completion and career progression. Limited weightage is given to this index in 2026; its importance will increase progressively each year.",
            })}
          </p>

          <div className="index-grid">
            <div className="table-wrap">
              <h4 className="table-caption">{L({ mr: "MS-CIT साठी", en: "The Scheme for MS-CIT" })}</h4>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{L({ mr: "काय मोजले जाते", en: "What it broadly measures" })}</th>
                    <th>{L({ mr: "गुण", en: "Points" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {learningMSCIT.map((r) => (
                    <tr key={r.m.en}>
                      <td>{L(r.m)}</td>
                      <td>{L(r.d)}</td>
                      <td>{r.points}</td>
                    </tr>
                  ))}
                  <tr className="tbl-total">
                    <td colSpan={2}>Total</td>
                    <td>120</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-wrap">
              <h4 className="table-caption">{L({ mr: "KLiC साठी", en: "The Scheme for KLiC" })}</h4>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{L({ mr: "काय मोजले जाते", en: "What it broadly measures" })}</th>
                    <th>{L({ mr: "गुण", en: "Points" })}</th>
                  </tr>
                </thead>
                <tbody>
                  {learningKLiC.map((r) => (
                    <tr key={r.m.en}>
                      <td>{L(r.m)}</td>
                      <td>{L(r.d)}</td>
                      <td>{r.points}</td>
                    </tr>
                  ))}
                  <tr className="tbl-total">
                    <td colSpan={2}>Total</td>
                    <td>80</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ===== INDEX 4 ===== */}
        <section className="index-section index-tint">
          <span className="index-num">04</span>
          <h2>{L({ mr: "Professional Excellence Index · 100 गुण", en: "Professional Excellence Index · 100 Points" })}</h2>
          <p className="index-phil">
            <strong>{L({ mr: "तत्त्व. ", en: "Philosophy. " })}</strong>
            {L({
              mr: "सर्व काही वस्तुनिष्ठ (Objective). हा Index Centre ला व्यावसायिकरीत्या चालवण्यासाठी आवश्यक असलेली शिस्त, अनुपालन (Compliance) आणि सहकार्य यांना गौरवतो.",
              en: "Everything objective. This index rewards the discipline, compliance and collaboration that let a Centre operate professionally.",
            })}
          </p>

          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{L({ mr: "Parameter", en: "Parameter" })}</th>
                  <th>{L({ mr: "मोजमाप", en: "Measurement" })}</th>
                  <th>{L({ mr: "पुरावा", en: "Evidence" })}</th>
                  <th>{L({ mr: "गुण", en: "Points" })}</th>
                </tr>
              </thead>
              <tbody>
                {professionalRows.map((r) => (
                  <tr key={r.param.en}>
                    <td>{L(r.param)}</td>
                    <td>{L(r.measure)}</td>
                    <td>{L(r.evidence)}</td>
                    <td>{r.points}</td>
                  </tr>
                ))}
                <tr className="tbl-total">
                  <td colSpan={3}>{L({ mr: "एकूण (Pillar Total)", en: "Pillar Total" })}</td>
                  <td>100</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="index-note">
            {L({
              mr: "जी ALC Learners ना पुढे घेऊन जाते तिने व्यावसायिकरीत्याही चालणे आवश्यक आहे — वेळेवर उपस्थिती, प्रशिक्षण, अहवाल व परीक्षा-अनुपालन. सर्व मापदंड वस्तुनिष्ठ व पुराव्यावर आधारित आहेत — कोणतीही व्यक्तिनिष्ठता नाही.",
              en: "A centre that grows and progresses learners must also run professionally — attend, train, report on time and stay exam-compliant. All measures are objective and evidence-based — no subjectivity.",
            })}
          </p>
        </section>

        {/* ===== RECOGNITION LEVELS — STAIRCASE ===== */}
        <section className="levels" id="levels">
          <span className="section-label">{L({ mr: "Recognition Levels", en: "Recognition Levels" })}</span>
          <h2>{L({ mr: "प्रत्येक Level एक प्रवास दर्शवते", en: "Every Level Represents a Journey" })}</h2>
          <p className="levels-sub">{L({ mr: "आपल्या ALC ची उत्कृष्टता जसजशी वाढेल, तसतसे Bronze पासून Platinum पर्यंत चढत जा.", en: "Climb from Bronze to Platinum as your ALC's excellence grows." })}</p>
          <LevelSteps />

          <div className="table-wrap levels-table">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{L({ mr: "Level", en: "Level" })}</th>
                  <th>{L({ mr: "टक्केवारी", en: "Percentage" })}</th>
                  <th>{L({ mr: "गुण", en: "Points Score" })}</th>
                </tr>
              </thead>
              <tbody>
                {awardLevels.map((r) => (
                  <tr key={r.level.en}>
                    <td>{L(r.level)}</td>
                    <td>{r.pct}</td>
                    <td>{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="table-fn">{L({ mr: "टीप: एकाच Level च्या आत, Bonus Points त्यांचा नेमका क्रम ठरवतात.", en: "Please Note: Inside the levels the bonus points will decide their exact position or sequence." })}</p>
          </div>

          <p className="levels-foot">{L({ mr: "प्रत्येक Level महत्त्वाचे आहे. प्रत्येक पाऊल पुढे महत्त्वाचे आहे.", en: "Every level matters. Every step forward matters." })}</p>
        </section>

        {/* ===== EXCELLENCE BONUS ===== */}
        <section className="bonus">
          <span className="section-label">{L({ mr: "Excellence Bonus", en: "Excellence Bonus" })}</span>
          <h2>{L({ mr: "Target पेक्षा जास्त कामगिरीचा गौरव", en: "Rewarding Performance Beyond Target" })}</h2>
          <p>
            {L({
              mr: "कोणत्याही Index किंवा Parameter च्या Target पेक्षा जास्त मिळालेल्या Admissions साठी Bonus लागू होतो. दर टप्प्याटप्प्याने (Slab-wise) वाढत जातो.",
              en: "A bonus applies to admissions beyond the target of any parameter in any index. The rate increases slab by slab as performance climbs.",
            })}
          </p>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>{L({ mr: "Target च्या पलीकडे मिळालेल्या Admissions", en: "Admissions beyond the Target" })}</th>
                  <th>{L({ mr: "Bonus दर", en: "Bonus Rate" })}</th>
                </tr>
              </thead>
              <tbody>
                {bonusSlabs.map((r, i) => (
                  <tr key={i}>
                    <td>{L(r.range)}</td>
                    <td>{L(r.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== LEARNING EXCELLENCE CREDITS ===== */}
        <section className="credits">
          <span className="section-label">{L({ mr: "शिक्षण उत्कृष्टता श्रेयांक", en: "Learning Excellence Credits" })}</span>
          <h2>{L({ mr: "Learning Excellence Credits — कोणतीही कमाल मर्यादा नाही", en: "Learning Excellence Credits — Uncapped" })}</h2>
          <div className="credits-grid">
            <p>
              {L({
                mr: "Learning Excellence मध्ये \"Bonus\" ऐवजी \"Learning Excellence Credits\" ही संज्ञा वापरली जाते. Learner च्या शिक्षणातील सातत्यपूर्ण सुधारणा व उत्कृष्टतेला प्रोत्साहन देण्यासाठी Learning Excellence Index (Index 3) अंतर्गत या Credits ना कोणतीही कमाल मर्यादा (Uncapped) नाही.",
                en: "Within Learning Excellence, the term \"Learning Excellence Credits\" is used instead of \"Bonus.\" To encourage consistent improvement and excellence in learner outcomes, these credits under the Learning Excellence Index (Index 3) have no upper cap.",
              })}
            </p>
            <p>
              {L({
                mr: "हे Credits Learning Excellence च्या Base Index Score मध्ये जोडले जाणार नाहीत तसेच Race to Recognition च्या एकूण गुणांवर त्यांचा कोणताही परिणाम होणार नाही.",
                en: "These credits will not be added to the Base Index Score of Learning Excellence, nor will they affect the overall Race to Recognition score.",
              })}
            </p>
            <p>
              {L({
                mr: "निर्धारित Benchmarks पेक्षा सातत्याने अधिक उत्कृष्ट कामगिरी करणाऱ्या ALCs च्या विशेष गौरवासाठी हे Credits स्वतंत्रपणे नोंदविले व प्रदर्शित केले जातील. यामागील उद्देश केवळ निश्चित स्तर गाठणे नसून, सातत्यपूर्ण उत्कृष्टतेची कार्यसंस्कृती (Culture of Continuous Excellence) निर्माण करणे हा आहे.",
                en: "These credits will be tracked and displayed separately to specially honour ALCs that consistently outperform defined benchmarks — the aim being to build a Culture of Continuous Excellence, not just to hit a fixed level.",
              })}
            </p>
          </div>
          <div className="citation-box">
            <h3>{L({ mr: "विदर्भ Learning Excellence Citation", en: "Vidarbha Learning Excellence Citation" })}</h3>
            <p>
              {L({
                mr: "Learning Excellence Index मध्ये सर्वोच्च कामगिरी करणाऱ्या Top 10 ALCs चा Vidarbha Learning Excellence Citation प्रदान करून विशेष गौरव करण्यात येईल.",
                en: "The Top 10 ALCs with the highest performance in the Learning Excellence Index will be specially honoured with the Vidarbha Learning Excellence Citation.",
              })}
            </p>
          </div>
        </section>

        {/* ===== SPECIAL RECOGNITIONS ===== */}
        <section className="special">
          <span className="section-label">{L({ mr: "विशेष गौरव", en: "Special Recognitions" })}</span>
          <h2>{L({ mr: "गुणसंख्येच्या पलीकडे", en: "Beyond the Score" })}</h2>
          <div className="special-grid">
            <div className="special-card">
              <h3>{L({ mr: "विदर्भ Learning Excellence Citation", en: "Vidarbha Learning Excellence Citation" })}</h3>
              <p>{L({ mr: "Learning Excellence मध्ये उत्कृष्ट कामगिरी दाखवणाऱ्या Top 10 ALCs चा गौरव.", en: "Celebrating the Top 10 ALCs demonstrating outstanding performance in Learning Excellence." })}</p>
            </div>
            <div className="special-card">
              <h3>District Excellence Championship</h3>
              <p>{L({ mr: "संपूर्ण जिल्ह्याला बदलण्यास मदत करणाऱ्या ALCs च्या सामूहिक उत्कृष्टतेचा व योगदानाचा गौरव.", en: "Celebrating the collective excellence of ALCs and the contribution that helps transform an entire district." })}</p>
            </div>
          </div>
          <p className="special-foot">{L({ mr: "कारण कधी कधी सर्वात मोठे यश म्हणजे पहिले येणे नसते — तर सर्वांना पुढे नेण्यास मदत करणे असते.", en: "Because sometimes the greatest achievement is not standing first — it is helping everyone move forward." })}</p>
        </section>

        {/* ===== TIMELINE ===== */}
        <section className="timeline">
          <span className="section-label">{L({ mr: "Contest Timeline आणि महत्त्वाच्या तारखा", en: "Contest Timeline & Key Dates" })}</span>
          <h2>{L({ mr: "शर्यत सुरू झाली आहे.", en: "The Race Has Begun." })}</h2>
          <div className="timeline-grid">
            <div className="timeline-card">
              <span className="timeline-label">{L({ mr: "गणल्या जाणाऱ्या Admissions", en: "Admissions counted" })}</span>
              <span className="timeline-value">1 {L({ mr: "जानेवारी", en: "January" })} 2026 – 30 {L({ mr: "नोव्हेंबर", en: "November" })} 2026</span>
            </div>
            <div className="timeline-card">
              <span className="timeline-label">{L({ mr: "Contest ची अंतिम तारीख", en: "Contest last date" })}</span>
              <span className="timeline-value">30 {L({ mr: "नोव्हेंबर", en: "November" })} 2026</span>
            </div>
          </div>
          <p className="timeline-foot">{L({ mr: "Course च्या कालावधीचा विचार न करता प्रत्येक Admission एक गणली जाते. प्रत्येक दिवस म्हणजे पुढे जाण्याची आणखी एक संधी.", en: "Every admission counts as one, irrespective of course duration. Every day is another opportunity to move forward." })}</p>
        </section>

        {/* ===== CONTEST NORMS ===== */}
        <section className="norms">
          <span className="section-label">{L({ mr: "Contest Norms", en: "Contest Norms" })}</span>
          <h2>{L({ mr: "मूळ तत्त्व आणि दिशा", en: "Essence & Direction" })}</h2>
          <ul className="norms-list">
            {contestNorms.map((n, i) => (
              <li key={i}>{L(n)}</li>
            ))}
          </ul>
        </section>

        {/* ===== DISTRICT EXCELLENCE / LEARNER AT CENTRE ===== */}
        <section className="split split--tint">
          <div className="split-block">
            <span className="section-label">{L({ mr: "जिल्हा उत्कृष्टता", en: "District Excellence" })}</span>
            <h2>{L({ mr: "एक ALC वाढते तेव्हा प्रेरणा मिळते. जिल्हा वाढतो तेव्हा परिवर्तन घडते.", en: "When One ALC Grows, It Inspires. When a District Grows, It Transforms." })}</h2>
            <p>
              {L({
                mr: "जिल्हा उत्कृष्टता ही कधीच एका केंद्राची एकट्याची कामगिरी नसते. ती शेकडो प्रयत्नांतून घडते — एक Learner, एक वर्ग, एक ALC यातून.",
                en: "District excellence is never the achievement of one centre alone. It is built through hundreds of efforts — one learner, one classroom, one ALC at a time.",
              })}
            </p>
            <p className="emphasis">
              {L({ mr: "District Excellence Championship हा सामूहिक प्रवास साजरा करते आणि आठवण करून देते की आपले सर्वात मोठे विजय हे एकत्र घडवलेले असतात.", en: "The District Excellence Championship celebrates this collective journey and reminds us that our biggest victories are the ones we create together." })}
            </p>
          </div>
          <div className="split-block">
            <span className="section-label">{L({ mr: "केंद्रस्थानी Learner", en: "The Learner at the Centre" })}</span>
            <h2>{L({ mr: "प्रत्येक आकड्यामागे एक Learner आहे.", en: "Behind Every Number, There Is a Learner." })}</h2>
            <p>
              {L({
                mr: "Dashboard वरील एखादा आकडा छोटा वाटू शकतो. पण त्यामागे कदाचित पहिले Digital Skill शिकणारा विद्यार्थी असतो, नवीन Career संधी शोधणारा तरुण असतो किंवा अधिक आत्मविश्वासपूर्ण भविष्याकडे पहिले पाऊल टाकणारी व्यक्ती असते.",
                en: "A number on a dashboard may look small. But behind it could be a student learning their first digital skill, a young person discovering a new career possibility, or someone taking their first step towards a more confident future.",
              })}
            </p>
            <p className="emphasis">
              {L({ mr: "म्हणूनच Learning Excellence महत्त्वाचे आहे. कारण आपले काम शेवटी आकड्यांबद्दल नसते. ते माणसांबद्दल असते.", en: "That is why Learning Excellence matters. Because our work is ultimately not about numbers. It is about people." })}
            </p>
          </div>
        </section>

        {/* ===== LEADERBOARD / CENTRE-WISE PROGRESS ===== */}
        <section className="dashboards">
          <Link href="/dashboard" className="dash-card">
            <span className="section-label">{L({ mr: "Leaderboard", en: "Leaderboard" })}</span>
            <h2>{L({ mr: "आपण कुठे उभे आहात ते पहा.", en: "See Where You Stand." })}</h2>
            <p>{L({ mr: "आपण एकत्र किती पुढे जाऊ शकतो ते पहा. विदर्भ ईस्टमधील ALCs ची प्रगती खालील निकषांनुसार पहा:", en: "See how far we can go together. Track the progress of ALCs across Vidarbha East. Explore rankings by:" })}</p>
            <ul className="chips">
              {leaderboardChips.map((x) => <li key={x.en}>{L(x)}</li>)}
            </ul>
            <span className="dash-link">{L({ mr: "Dashboard वर जा →", en: "Go to Dashboard →" })}</span>
          </Link>
          <Link href="/index-1" className="dash-card">
            <span className="section-label">{L({ mr: "Centre-Wise Progress", en: "Centre-Wise Progress" })}</span>
            <h2>{L({ mr: "आपला प्रवास. आपली प्रगती. आपले Recognition.", en: "Your Journey. Your Progress. Your Recognition." })}</h2>
            <p>{L({ mr: "प्रत्येक Recognition Index वर आपल्या ALC ची कामगिरी पहा. ट्रॅक करा:", en: "See your ALC's performance across every Recognition Index. Track:" })}</p>
            <ul className="chips">
              {progressChips.map((x) => <li key={x.en}>{L(x)}</li>)}
            </ul>
            <span className="dash-link">{L({ mr: "Index Points तपासा →", en: "Check Index Points →" })}</span>
          </Link>
        </section>

        {/* ===== IMPORTANT RULES ===== */}
        <section className="rules" id="rules">
          <span className="section-label">{L({ mr: "महत्त्वाचे नियम", en: "Important Rules" })}</span>
          <h2>{L({ mr: "पुढे जाण्यापूर्वी कृपया वाचा", en: "Please Read Before You Proceed" })}</h2>
          <ul className="rules-list">
            <li>
              <span className="rule-num">{L({ mr: "नियम 1)", en: "Rule 1)" })}</span>
              <span className="rule-text">
                {L({
                  mr: "Home Dashboard वर, प्रत्येक ALC समोर तुम्हाला ",
                  en: "In the Home Dashboard, you will see ",
                })}
                <strong className="dot-green">{L({ mr: "हिरवे", en: "Green" })}</strong>
                {L({ mr: " आणि ", en: " and " })}
                <strong className="dot-red">{L({ mr: "लाल", en: "Red" })}</strong>
                {L({ mr: " गुण दिसतील. ", en: " points against each ALC. " })}
                <strong className="dot-green">{L({ mr: "हिरवे", en: "Green" })}</strong>
                {L({ mr: " म्हणजे तुम्ही Eligible आहात, आणि ", en: " means you are Eligible, and " })}
                <strong className="dot-red">{L({ mr: "लाल", en: "Red" })}</strong>
                {L({ mr: " म्हणजे तुम्ही Not Eligible आहात.", en: " means you are Not Eligible." })}
              </span>
            </li>
          </ul>
        </section>

        {/* ===== ANNOUNCEMENTS ===== */}
        <section className="announce" id="announcements">
          <span className="section-label">{L({ mr: "घोषणा", en: "Announcements" })}</span>
          <h2>{L({ mr: "जोडलेले रहा. पुढे रहा.", en: "Stay Connected. Stay Ahead." })}</h2>
          <p>{L({ mr: "नवीनतम अद्यतने, महत्त्वाच्या घोषणा, Recognition Updates आणि Regional Meet ची माहिती फॉलो करा.", en: "Follow the latest updates, important announcements, recognition updates and Regional Meet information." })}</p>
          <p className="emphasis">{L({ mr: "प्रत्येक टप्पा साजरा करण्यास पात्र आहे. प्रत्येक महत्त्वाचा क्षण शेअर करण्यास पात्र आहे.", en: "Every milestone deserves to be celebrated. Every important moment deserves to be shared." })}</p>
        </section>

        {/* ===== RECOGNITION SENTENCE ===== */}
        <section className="one-sentence">
          <span className="section-label">{L({ mr: "Recognition follows Contribution", en: "Recognition Follows Contribution" })}</span>
          <h2>{L({ mr: "संपूर्ण Framework एका वाक्यात", en: "The Whole Framework in One Sentence" })}</h2>
          <p className="one-sentence-sub">
            {L({ mr: "प्रत्येक केंद्र आणि जिल्ह्याला काय करायचे आहे, ते एका वाक्यात असे वाचता येते:", en: "The whole framework can be read as one sentence about what every centre and district is asked to do:" })}
          </p>
          <ol className="one-sentence-list">
            {recognitionSentence.map((r, i) => (
              <li key={i}>{L(r)}</li>
            ))}
          </ol>
        </section>

        {/* ===== CLOSING ===== */}
        <section className="closing">
          <span className="section-label">{L({ mr: "समारोप संदेश", en: "Closing Message" })}</span>
          <h2 className="closing-title">{L({ mr: "ही केवळ एक शर्यत नाही.", en: "This Is More Than a Race." })}</h2>
          <p>
            {L({
              mr: "ही प्रत्येक पहाटे, प्रत्येक मार्गदर्शन केलेल्या Learner, प्रत्येक पार केलेल्या आव्हानाची आणि इथवर पोहोचवणाऱ्या प्रत्येक छोट्या पावलाची पावती आहे. ही अशा लोकांची पावती आहे ज्यांनी बांधणी करत राहणे, शिकत राहणे आणि पुढे जात राहणे निवडले.",
              en: "It is a recognition of every early morning, every learner guided, every challenge overcome and every small step that brought us here. It is a recognition of the people who chose to keep building, keep learning and keep moving forward.",
            })}
          </p>
          <p className="closing-remember">{L({ mr: "आणि हा नवा अध्याय सुरू करताना, आपण लक्षात ठेवूया:", en: "And as we begin this new chapter, let us remember:" })}</p>
          <p className="closing-line">{L({ mr: "आपण फक्त वाढण्यासाठी इथे नाही. आपण उद्देशाने वाढण्यासाठी इथे आहोत.", en: "We are not here only to grow. We are here to grow with purpose." })}</p>
          <p className="closing-line">{L({ mr: "फक्त पुढे जाण्यासाठी नाही. तर इतरांनाही सोबत पुढे नेण्यासाठी.", en: "Not just to move ahead. But to take others ahead with us." })}</p>
          <div className="closing-tags">
            <span>{L({ mr: "Together Towards Excellence.", en: "Together Towards Excellence." })}</span>
            <span>{L({ mr: "Together Towards Growth.", en: "Together Towards Growth." })}</span>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');

        :root {
          --ink: #FFFFFF;
          --surface: #FFF4EC;
          --surface-2: #FFE8DA;
          --line: rgba(255, 61, 110, 0.22);
          --cream: #1A1310;
          --cream-dim: #4A3F38;
          /* darker, higher-contrast accent colors so text is legible on the peach/cream card backgrounds */
          --gold: #B8560E;
          --gold-onlight: #A34D0C;
          --ember: #D81B54;
          --muted: #7A6B60;
          --green: #1E8E3E;
          --red: #D93025;
          --content-max: 1180px;
          --text-max: 900px;
        }

        * { box-sizing: border-box; }
        html, body { background: var(--ink); margin: 0; padding: 0; }

        .page {
          background: var(--ink);
          color: var(--cream);
          font-family: 'Work Sans', 'Noto Sans Devanagari', sans-serif;
          overflow-x: hidden;
        }

        h1, h2, h3 { font-family: 'Fraunces', 'Noto Sans Devanagari', serif; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
        p { line-height: 1.7; color: var(--cream-dim); margin: 0 0 12px; }

        .section-label {
          display: inline-block;
          font-family: 'JetBrains Mono', 'Noto Sans Devanagari', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: var(--ember);
          margin-bottom: 14px;
        }

        /* ---------- LANGUAGE SWITCH ---------- */
        .lang-switch {
          position: fixed;
          top: 14px;
          right: 18px;
          z-index: 60;
          display: flex;
          gap: 2px;
          background: rgba(26, 19, 16, 0.9);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 122, 46, 0.4);
          border-radius: 100px;
          padding: 4px;
        }
        .lang-btn {
          font-family: 'Work Sans', 'Noto Sans Devanagari', sans-serif;
          font-size: 13px;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 100px;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .lang-btn.active {
          background: var(--ember);
          color: #fff;
        }
                  .index-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .index-grid > .table-wrap { min-width: 0; }
        .table-wrap { overflow-x: auto; margin: 0 auto 12px; max-width: 100%; min-width: 0; }
        .table-caption { text-align: left; font-size: 14px; color: var(--gold-onlight); font-weight: 600; margin-bottom: 6px; white-space: nowrap; }
        .tbl { width: 100%; min-width: 420px; border-collapse: collapse; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; font-size: 13px; }

        /* ---------- HERO ---------- */
        .hero { position: relative; width: 100%; height: 680px; overflow: hidden; }
        .hero-media { width: 100%; height: 100%; }

        /* ---------- TITLE BLOCK ---------- */
        .titleblock { max-width: var(--text-max); margin: 0 auto; padding: 22px 24px 4px; text-align: center; }
        .titleblock-h1 { font-size: clamp(24px, 4.5vw, 38px); color: var(--cream); margin-bottom: 6px; }
        .titleblock-sub { font-size: 15px; color: var(--gold); font-weight: 600; margin-bottom: 4px; }
        .titleblock-tag { font-style: italic; color: var(--ember); font-size: 13px; }

        /* ---------- PREFACE (now uses horizontal space via 2-col text grid) ---------- */
        .preface { max-width: var(--content-max); margin: 0 auto; padding: 18px 24px 6px; }
        .preface h2 { font-size: clamp(20px, 3.4vw, 27px); margin-bottom: 12px; }
        .preface-text { font-size: 14px; line-height: 1.8; margin-bottom: 12px; }
        .preface p { font-size: 14px; margin-bottom: 10px; }
        .pref-sign { margin-top: 10px; font-style: italic; color: var(--gold); }

        /* ---------- TRIAD ---------- */
        .triad { max-width: var(--content-max); margin: 0 auto; padding: 10px 24px 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 22px 20px; }
        .card-kicker { display: block; font-family: 'JetBrains Mono', 'Noto Sans Devanagari', monospace; font-size: 11px; letter-spacing: 0.1em; color: var(--ember); margin-bottom: 8px; }
        .card h2 { font-size: 19px; margin-bottom: 10px; }
        .card p { font-size: 13.5px; margin-bottom: 8px; }
        .card-close { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line); font-style: italic; color: var(--gold-onlight); font-weight: 500; font-size: 13px; }
        .pillars { list-style: none; margin: 0 0 10px; padding: 0; display: flex; flex-direction: column; gap: 5px; }
        .pillars li { font-size: 13.5px; padding-left: 18px; position: relative; color: var(--cream-dim); }
        .pillars li::before { content: ''; position: absolute; left: 0; top: 8px; width: 6px; height: 6px; border-radius: 50%; background: var(--ember); }

        /* ---------- SPLIT ---------- */
        .split { max-width: var(--content-max); margin: 0 auto; padding: 20px 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 36px; }
        .split--tint { max-width: 100%; background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .split--tint { display: grid; grid-template-columns: repeat(2, 1fr); max-width: var(--content-max); margin: 0 auto; padding: 30px 24px; gap: 36px; }
        .split-block h2 { font-size: 21px; margin-bottom: 10px; }
        .split-block p { font-size: 13.5px; margin-bottom: 8px; }
        .emphasis { color: var(--ember); font-style: italic; font-weight: 500; font-size: 13.5px; }

        /* ---------- FRAMEWORK BACKGROUND ---------- */
        .fw-bg { max-width: var(--content-max); margin: 0 auto; padding: 24px 24px; }
        .fw-bg h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 10px; }
        .fw-bg p { font-size: 13.5px; margin-bottom: 10px; max-width: 820px; }
        .fw-flow { font-weight: 500; color: var(--cream); background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 18px; font-size: 13.5px; max-width: 100% !important; }
        .fw-culture { display: flex; align-items: center; justify-content: center; gap: 16px; margin: 18px 0; flex-wrap: wrap; }
        .fw-culture-col { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 14px 20px; text-align: center; min-width: 220px; flex: 1; max-width: 360px; }
        .fw-culture-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 6px; }
        .fw-culture-val { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14.5px; color: var(--cream); margin: 0; }
        .fw-culture-arrow { color: var(--gold-onlight); font-size: 20px; }
        .fw-rules { margin-top: 18px; }
        .fw-rules h3 { font-size: 17px; margin-bottom: 10px; color: var(--cream); }
        .fw-rules ol { padding-left: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px 24px; margin: 0; }
        .fw-rules li { font-size: 13.5px; color: var(--cream-dim); line-height: 1.55; }
        .fw-roadmap { margin-top: 22px; }
        .fw-roadmap h3 { font-size: 17px; margin-bottom: 12px; color: var(--cream); }
        .fw-district { margin-top: 18px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; }
        .fw-district h3 { font-size: 16.5px; color: var(--ember); margin-bottom: 6px; }
        .fw-district p { font-size: 13.5px; margin: 0; max-width: 100% !important; }
        .fw-belief { margin-top: 16px; text-align: center; font-style: italic; color: var(--gold-onlight); font-weight: 500; font-size: 14px; }

        /* ---------- JOURNEY ROW ---------- */
        .journey-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .journey-item { text-align: left; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px; }
        .journey-year { display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--ember); margin-bottom: 5px; }
        .journey-tag { display: block; font-family: 'Fraunces', serif; font-weight: 600; font-size: 15.5px; margin-bottom: 5px; color: var(--cream); }
        .journey-item p { font-size: 12.5px; margin: 0; }

        /* ---------- FRAMEWORK ---------- */
        .framework { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 28px 24px 32px; text-align: center; }
        .framework-title { max-width: 900px; margin: 0 auto; font-size: clamp(21px, 3.6vw, 30px); margin-bottom: 8px; }
        .framework-sub { max-width: 640px; margin: 0 auto 18px; font-size: 13.5px; }
        .framework-foot { max-width: 780px; margin: 18px auto 0; font-size: 13px; color: var(--muted); }

        /* ---------- GLANCE / TABLES ---------- */
        .glance { max-width: var(--content-max); margin: 0 auto; padding: 28px 24px; text-align: center; }
        .glance h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 16px; }
        .table-wrap { overflow-x: auto; margin: 0 auto 12px; max-width: 100%; }
        .table-caption { text-align: left; font-size: 14px; color: var(--gold-onlight); font-weight: 600; margin-bottom: 6px; }
        .tbl { width: 100%; border-collapse: collapse; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; font-size: 13px; }
        .tbl th, .tbl td { padding: 9px 14px; text-align: left; border-bottom: 1px solid var(--line); color: var(--cream); }
        .tbl th { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em; color: var(--ember); background: var(--surface-2); }
        .tbl td { color: var(--cream-dim); }
        .tbl tr:last-child td { border-bottom: none; }
        .tbl-total td { font-weight: 700; color: var(--cream); background: var(--surface-2); }
        .table-fn { font-size: 12px; color: var(--muted); margin-top: 6px; text-align: left; }

        /* ---------- INDEX SECTIONS ---------- */
        .index-section { max-width: var(--content-max); margin: 0 auto; padding: 26px 24px; position: relative; }
        .index-tint { max-width: 100%; background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .index-tint > * { max-width: var(--content-max); margin-left: auto; margin-right: auto; }
        .index-num { display: block; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--gold-onlight); letter-spacing: 0.1em; margin-bottom: 6px; }
        .index-section h2 { font-size: clamp(19px, 3.2vw, 25px); margin-bottom: 10px; }
        .index-phil { font-size: 13.5px; margin-bottom: 14px; max-width: 900px; }
        .index-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .index-note { font-size: 12.5px; color: var(--muted); margin-top: 4px; }

        /* ---------- LEVELS ---------- */
        .levels { max-width: var(--content-max); margin: 0 auto; padding: 30px 24px 28px; text-align: center; }
        .levels h2 { font-size: clamp(21px, 3.6vw, 28px); margin-bottom: 6px; }
        .levels-sub { max-width: 540px; margin: 0 auto 20px; font-size: 13.5px; }
        .levels-table { margin: 20px auto 0; max-width: 600px; }
        .levels-foot { margin-top: 16px; font-style: italic; color: var(--gold-onlight); font-weight: 500; }

        /* ---------- BONUS ---------- */
        .bonus { max-width: 860px; margin: 0 auto; padding: 28px 24px; text-align: center; }
        .bonus h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 8px; }
        .bonus p { font-size: 13.5px; max-width: 640px; margin-left: auto; margin-right: auto; margin-bottom: 12px; }

        /* ---------- CREDITS ---------- */
        .credits { background: var(--surface-2); padding: 28px 24px; }
        .credits > * { max-width: var(--content-max); margin-left: auto; margin-right: auto; }
        .credits h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 10px; }
        .credits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 4px; }
        .credits p { font-size: 13.5px; margin-bottom: 10px; }
        .citation-box { margin-top: 16px; background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; }
        .citation-box h3 { font-size: 16.5px; color: var(--ember); margin-bottom: 6px; }
        .citation-box p { font-size: 13.5px; margin: 0; max-width: 100% !important; }

        /* ---------- SPECIAL ---------- */
        .special { background: var(--surface-2); padding: 28px 24px 32px; text-align: center; }
        .special h2 { font-size: clamp(21px, 3.6vw, 28px); margin-bottom: 18px; }
        .special-grid { max-width: var(--content-max); margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; text-align: left; }
        .special-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 20px; }
        .special-card h3 { font-size: 16.5px; color: var(--ember); margin-bottom: 6px; }
        .special-card p { font-size: 13.5px; margin: 0; }
        .special-foot { margin-top: 16px; font-style: italic; color: var(--cream-dim); }

        /* ---------- TIMELINE ---------- */
        .timeline { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 28px 24px; text-align: center; }
        .timeline h2 { font-size: clamp(21px, 3.6vw, 28px); margin-bottom: 18px; }
        .timeline-grid { max-width: 760px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .timeline-card { background: #fff; border: 1px solid var(--line); border-radius: 14px; padding: 16px; text-align: left; }
        .timeline-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--muted); margin-bottom: 6px; }
        .timeline-value { font-size: 14.5px; color: var(--ember); font-weight: 600; }
        .timeline-foot { max-width: 600px; margin: 16px auto 0; font-size: 13px; }

        /* ---------- NORMS ---------- */
        .norms { max-width: var(--content-max); margin: 0 auto; padding: 24px 24px; }
        .norms h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 14px; }
        .norms-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .norms-list li { background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 16px; font-size: 13.5px; color: var(--cream-dim); line-height: 1.55; }

        /* ---------- DASHBOARDS ---------- */
        .dashboards { max-width: var(--content-max); margin: 0 auto; padding: 30px 24px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        .dash-card { text-decoration: none; display: block; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; padding: 24px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .dash-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(216, 27, 84, 0.16); }
        .dash-card h2 { font-size: 20px; margin-bottom: 8px; color: var(--cream); }
        .dash-card p { font-size: 13.5px; margin-bottom: 8px; }
        .chips { list-style: none; margin: 10px 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
        .chips li { font-family: 'JetBrains Mono', 'Noto Sans Devanagari', monospace; font-size: 11.5px; padding: 6px 12px; border-radius: 100px; border: 1px solid var(--line); background: #fff; color: var(--ember); }
        .dash-link { font-family: 'JetBrains Mono', 'Noto Sans Devanagari', monospace; font-size: 12px; font-weight: 700; color: var(--gold-onlight); }

        /* ---------- RULES ---------- */
        .rules { max-width: var(--content-max); margin: 0 auto; padding: 8px 24px 28px; text-align: center; }
        .rules h2 { font-size: clamp(21px, 3.6vw, 28px); margin-bottom: 16px; }
        .rules-list { list-style: none; margin: 0; padding: 0; text-align: left; display: flex; flex-direction: column; gap: 10px; }
        .rules-list li { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px 20px; display: flex; gap: 10px; align-items: flex-start; }
        .rule-num { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--ember); white-space: nowrap; }
        .rule-text { font-size: 13.5px; color: var(--cream-dim); line-height: 1.55; }
        .dot-green { color: var(--green); font-weight: 700; }
        .dot-green::before { content: ''; display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: var(--green); margin-right: 6px; }
        .dot-red { color: var(--red); font-weight: 700; }
        .dot-red::before { content: ''; display: inline-block; width: 9px; height: 9px; border-radius: 50%; background: var(--red); margin-right: 6px; }

        /* ---------- ANNOUNCE ---------- */
        .announce { max-width: 700px; margin: 0 auto; padding: 14px 24px 28px; text-align: center; }
        .announce h2 { font-size: clamp(21px, 3.6vw, 28px); margin-bottom: 8px; }

        /* ---------- ONE SENTENCE ---------- */
        .one-sentence { max-width: 820px; margin: 0 auto; padding: 24px 24px; text-align: center; }
        .one-sentence h2 { font-size: clamp(20px, 3.2vw, 26px); margin-bottom: 6px; }
        .one-sentence-sub { font-size: 13.5px; margin-bottom: 14px; }
        .one-sentence-list { list-style: none; counter-reset: step; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; text-align: left; }
        .one-sentence-list li { counter-increment: step; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px 16px 10px 42px; position: relative; font-size: 13.5px; color: var(--cream-dim); }
        .one-sentence-list li::before { content: counter(step); position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--ember); }

        /* ---------- CLOSING ---------- */
        .closing { background: var(--surface); border-top: 1px solid var(--line); max-width: 100%; padding: 28px 24px 34px; text-align: center; }
        .closing > * { max-width: 760px; margin-left: auto; margin-right: auto; }
        .closing-title { font-size: clamp(24px, 4.4vw, 34px); margin-bottom: 14px; color: var(--ember); font-style: italic; }
        .closing p { font-size: 14px; margin-bottom: 10px; }
        .closing-remember { color: var(--cream); margin-top: 10px; }
        .closing-line { color: var(--cream); font-size: 15px; font-family: 'Fraunces', 'Noto Sans Devanagari', serif; margin-bottom: 6px; }
        .closing-tags { margin-top: 18px; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
        .closing-tags span { font-family: 'JetBrains Mono', 'Noto Sans Devanagari', monospace; font-size: 11px; letter-spacing: 0.06em; padding: 8px 14px; border: 1px solid var(--ember); border-radius: 100px; color: var(--ember); font-weight: 600; }

        /* ---------- BRONZE ACCENT (best-effort — adjust selector to match your LevelSteps DOM) ---------- */
        .levels [data-level="bronze"],
        .levels .bronze,
        .levels .level-bronze,
        .levels [class*="bronze" i] {
          background: linear-gradient(135deg, #CD7F32, #A9642A) !important;
          color: #fff !important;
          border-color: #A9642A !important;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 1000px) {
          .credits-grid, .fw-rules ol, .norms-list, .one-sentence-list {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 900px) {
          .triad, .split, .split--tint, .special-grid, .journey-row, .timeline-grid, .dashboards, .index-grid {
            grid-template-columns: 1fr;
          }
          .hero { height: 340px; }
          .fw-culture { flex-direction: column; }
        }
      `}</style>
    </>
  );
}