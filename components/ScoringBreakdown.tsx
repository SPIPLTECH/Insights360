"use client";

import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, Calculator, ShieldCheck, TrendingUp } from "lucide-react";
import {
  awardLevels, bonusSlabs, ecosystemRows, businessGrowthRural, businessGrowthUrban,
  learningKLiC, learningMSCIT, professionalRows, glanceRows, type Bi,
} from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Reveal from "./Reveal";
import ScrollX from "./shared/ScrollX";
import s from "./site.module.css";
import b from "./ScoringBreakdown.module.css";

const CARDS = [
  { n: 1, t: { mr: "Business Growth", en: "Business Growth" }, pts: 350, min: 88, Icon: TrendingUp, c: "#f5762e" },
  { n: 2, t: { mr: "Ecosystem Participation", en: "Ecosystem Participation" }, pts: 200, min: 50, Icon: BriefcaseBusiness, c: "#ec1e63" },
  { n: 3, t: { mr: "Learning Excellence", en: "Learning Excellence" }, pts: 200, min: 30, Icon: BookOpenCheck, c: "#1e8e3e" },
  { n: 4, t: { mr: "Professional Excellence", en: "Professional Excellence" }, pts: 100, min: 25, Icon: ShieldCheck, c: "#7c3aed" },
];

const bi = (mr: string, en: string): Bi => ({ mr, en });

function Head({ n, title, pts, id }: { n: number; title: Bi; pts: number; id: string }) {
  const { L } = useLang();
  return (
    <div id={id}>
      <span className={s.label}>Index {n}</span>
      <h2 className={s.h2}>{L(title)}</h2>
      <span className={b.pill}>{pts} {L(bi("गुण", "points"))}</span>
    </div>
  );
}

export default function ScoringBreakdown() {
  const { L } = useLang();

  return (
    <>
      {/* ===== Overview ===== */}
      <section className={`${s.section} ${s.tint} ${s.center} ${b.hero}`}>
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}><Calculator size={14} /> {L(bi("गुण कसे मोजले जातात", "How points are calculated"))}</span>
            <h1 className={s.h2}>Scoring Breakdown</h1>
            <p className={s.lead}>
              {L(
                bi(
                  "चारही Index मधील गुण कसे मोजले जातात, किमान गुणांची अट काय आहे आणि अंतिम Recognition Level कसा ठरतो — सर्व एकाच ठिकाणी.",
                  "How the points of all four Indices are calculated, what the minimum bar is, and how the final Recognition Level is decided — all in one place."
                )
              )}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className={b.sum}>
              {CARDS.map(({ n, t, pts, min, Icon, c }) => (
                <a key={n} href={`#index-${n}`} className={b.sumCard} style={{ ["--c" as string]: c }}>
                  <Icon size={22} color={c} style={{ margin: "0 auto" }} />
                  <span>Index {n}</span>
                  <b>{pts}</b>
                  <strong>{L(t)}</strong>
                  <small>{L(bi("किमान", "Min."))} {min}</small>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Big picture ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <Reveal>
            <div className={b.block}>
              <h3>{L(bi("एकूण गुणांचे गणित", "The big picture"))}</h3>
              <span className={b.formula}>
                Total = Index 1 (350) + Index 2 (200) + Index 3 (200) + Index 4 (100) = 850
              </span>
              <ol className={b.steps}>
                <li>{L(bi("प्रत्येक Index मध्ये Parameter-निहाय गुण दिले जातात आणि ते त्या Index च्या कमाल गुणांपर्यंतच मर्यादित असतात.", "Each Index awards points parameter by parameter, capped at that Index's maximum."))}</li>
                <li>
                  {L(bi("Eligibility Floor: प्रत्येक Index मध्ये किमान गुण आवश्यक —", "Eligibility floor: you must clear the minimum in every Index —"))}{" "}
                  <b>I1 ≥ 88 · I2 ≥ 50 · I3 ≥ 30 · I4 ≥ 25</b>.{" "}
                  {L(bi("एकाही Index मध्ये कमी पडल्यास एकूण गुण कितीही असले तरी Level मिळत नाही.", "Miss even one and no Level is awarded, however high the total."))}
                </li>
                <li>{L(bi("चारही Index चे किमान गुण पार केल्यावरच चार Index चे गुण बेरीज करून Award Level ठरतो.", "Only after all four minimums are cleared are the four Index scores added and compared against the Award Level bands."))}</li>
                <li>{L(bi("Excellence Bonus हा 850 गुणांमध्ये जोडला जात नाही; तो फक्त एकाच Level मधील ALCs ची क्रमवारी ठरवण्यासाठी वापरला जातो.", "Excellence Bonus is not added to the 850; it only ranks ALCs within the same Level."))}</li>
              </ol>

              <ScrollX className={s.tableWrap} style={{ marginTop: 16 }}>
                <table className={s.tbl}>
                  <thead>
                    <tr>
                      <th>Index</th><th>{L(bi("कमाल गुण", "Max points"))}</th><th>{L(bi("किमान गुण (Floor)", "Minimum (floor)"))}</th><th>Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glanceRows.map((r) => (
                      <tr key={r.n}>
                        <td><strong>{r.n}. {L(r.idx)}</strong></td>
                        <td className={s.num}>{r.max}</td>
                        <td className={s.num}>{r.min}</td>
                        <td>{L(r.bonus)}</td>
                      </tr>
                    ))}
                    <tr className={s.total}><td>Total</td><td>850</td><td colSpan={2}></td></tr>
                  </tbody>
                </table>
              </ScrollX>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Index 1 ===== */}
      <section className={`${s.section} ${s.tint}`}>
        <div className={s.inner}>
          <Reveal>
            <Head n={1} id="index-1" title={bi("Business Growth Index", "Business Growth Index")} pts={350} />
            <div className={b.block}>
              <p>{L(bi(
                "ALC Urban किंवा Rural यापैकी एका श्रेणीत मोडतो आणि फक्त स्वतःच्या श्रेणीच्या तीन Parameters वर मूल्यांकन होते. प्रत्येक Admission ONE म्हणून गणली जाते (Course च्या तासांशी संबंध नाही). 1 जाने. ते 30 नोव्हें. 2026 दरम्यानच्या Admissions गणल्या जातात.",
                "An ALC is either Urban or Rural and is scored only on the three parameters of its own category. Every admission counts as ONE (course hours do not matter). Admissions from 1 Jan to 30 Nov 2026 are counted."
              ))}</p>
              <span className={b.formula}>
                Index 1 = MS-CIT (200) + KLiC (100) + CCTP (50) = 350<br />
                {L(bi("Achievement vs. Target — Admission Portal वरून", "Achievement vs. Target — from the Admission Portal"))}
              </span>
              <div className={b.split}>
                <div>
                  <h3>{L(bi("Urban ALC", "Urban ALC"))}</h3>
                  <ScrollX className={s.tableWrap}><table className={s.tbl}>
                    <thead><tr><th>Parameter</th><th>Target</th><th>{L(bi("कमाल गुण", "Max points"))}</th></tr></thead>
                    <tbody>{businessGrowthUrban.map((r) => <tr key={r.param.en}><td>{L(r.param)}</td><td className={s.num}>{r.target}</td><td className={s.num}>{r.points}</td></tr>)}
                      <tr className={s.total}><td>Total</td><td></td><td>350</td></tr></tbody>
                  </table></ScrollX>
                </div>
                <div>
                  <h3>{L(bi("Rural ALC", "Rural ALC"))}</h3>
                  <ScrollX className={s.tableWrap}><table className={s.tbl}>
                    <thead><tr><th>Parameter</th><th>Target</th><th>{L(bi("कमाल गुण", "Max points"))}</th></tr></thead>
                    <tbody>{businessGrowthRural.map((r) => <tr key={r.param.en}><td>{L(r.param)}</td><td className={s.num}>{r.target}</td><td className={s.num}>{r.points}</td></tr>)}
                      <tr className={s.total}><td>Total</td><td></td><td>350</td></tr></tbody>
                  </table></ScrollX>
                </div>
              </div>
              <p style={{ marginTop: 12 }}>{L(bi(
                "KLiC Admissions चार प्लॅन्सची (KLiC 30 / 60 / 90 / 120) बेरीज (KLiC Total) म्हणून मोजल्या जातात. Target च्या पलीकडील Admissions साठी Excellence Bonus लागू होतो (खाली पहा).",
                "KLiC admissions are the sum of the four plans (KLiC 30 / 60 / 90 / 120), shown as KLiC Total. Admissions beyond the target earn the Excellence Bonus (see below)."
              ))}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Index 2 ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <Reveal>
            <Head n={2} id="index-2" title={bi("Ecosystem Participation Index", "Ecosystem Participation Index")} pts={200} />
            <div className={b.block}>
              <p>{L(bi("MKCL ने शिफारस केलेल्या प्रत्येक उपक्रमात सहभाग — प्रत्येक उपक्रमाचे स्वतंत्र गुण.", "Participation in every MKCL-recommended initiative — each initiative carries its own points."))}</p>
              <span className={b.formula}>Index 2 = MoM (50) + AI Masterclass (60) + SSC/HSC (60) + ODOT 1 (15) + ODOT 2 (15) = 200</span>
              <ScrollX className={s.tableWrap}><table className={s.tbl}>
                <thead><tr><th>{L(bi("उपक्रम", "Initiative"))}</th><th>{L(bi("कसे मोजले", "How it is measured"))}</th><th>Target</th><th>{L(bi("कमाल गुण", "Max points"))}</th></tr></thead>
                <tbody>
                  {ecosystemRows.map((r) => <tr key={r.init.en}><td><strong>{L(r.init)}</strong></td><td>{L(r.measure)}</td><td className={s.num}>{r.target ?? "—"}</td><td className={s.num}>{r.points}</td></tr>)}
                  <tr className={s.total}><td colSpan={3}>Total</td><td>200</td></tr>
                </tbody>
              </table></ScrollX>
              <p style={{ marginTop: 12 }}>{L(bi(
                "MoM, AI Masterclass आणि SSC/HSC साठी Target ओलांडल्यास Excellence Bonus मिळतो. ODOT 1 व ODOT 2 साठी सहभाग नोंदवला की (Completed? = Yes) पूर्ण गुण मिळतात.",
                "MoM, AI Masterclass and SSC/HSC earn Excellence Bonus beyond target. ODOT 1 and ODOT 2 give full points once participation is recorded (Completed? = Yes)."
              ))}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Index 3 ===== */}
      <section className={`${s.section} ${s.tint}`}>
        <div className={s.inner}>
          <Reveal>
            <Head n={3} id="index-3" title={bi("Learning Excellence Index", "Learning Excellence Index")} pts={200} />
            <div className={b.block}>
              <p>{L(bi("Admission नंतरचा Learner चा संपूर्ण प्रवास मोजला जातो. MS-CIT साठी सहा Metrics (प्रत्येकी 20) आणि KLiC साठी चार Metrics (प्रत्येकी 20).", "Measures the learner's whole journey after admission: six metrics for MS-CIT and four for KLiC, 20 points each."))}</p>
              <span className={b.formula}>Index 3 = MS-CIT (6 × 20 = 120) + KLiC (4 × 20 = 80) = 200</span>
              <div className={b.split}>
                <div>
                  <h3>MS-CIT (120)</h3>
                  <ScrollX className={s.tableWrap}><table className={s.tbl}>
                    <thead><tr><th>Metric</th><th>{L(bi("गुण", "Points"))}</th></tr></thead>
                    <tbody>{learningMSCIT.map((r) => <tr key={r.m.en}><td>{L(r.m)}</td><td className={s.num}>{r.points}</td></tr>)}
                      <tr className={s.total}><td>Total</td><td>120</td></tr></tbody>
                  </table></ScrollX>
                </div>
                <div>
                  <h3>KLiC (80)</h3>
                  <ScrollX className={s.tableWrap}><table className={s.tbl}>
                    <thead><tr><th>Metric</th><th>{L(bi("गुण", "Points"))}</th></tr></thead>
                    <tbody>{learningKLiC.map((r) => <tr key={r.m.en}><td>{L(r.m)}</td><td className={s.num}>{r.points}</td></tr>)}
                      <tr className={s.total}><td>Total</td><td>80</td></tr></tbody>
                  </table></ScrollX>
                </div>
              </div>
              <p style={{ marginTop: 12 }}>{L(bi(
                "प्रत्येक Metric ची तपशीलवार व्याख्या Index 3 च्या मुख्य विभागात आहे. Index 3 मध्ये Bonus ऐवजी \"Learning Excellence Credits\" दिले जातात आणि त्यांना कोणतीही मर्यादा नाही (Uncapped).",
                "Each metric's detailed definition is on the Index 3 section of the Home page. Index 3 uses \"Learning Excellence Credits\" instead of Bonus, and they have no cap."
              ))}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Index 4 ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <Reveal>
            <Head n={4} id="index-4" title={bi("Professional Excellence Index", "Professional Excellence Index")} pts={100} />
            <div className={b.block}>
              <p>{L(bi("चार Parameters, प्रत्येकी 25 गुण — सर्व वस्तुनिष्ठ व पुराव्यावर आधारित.", "Four parameters, 25 points each — all objective and evidence-based."))}</p>
              <span className={b.formula}>Index 4 = Attendance (25) + Exam Compliance (25) + Social Media (25) + Enrolment Consistency (25) = 100</span>
              <ScrollX className={s.tableWrap}><table className={s.tbl}>
                <thead><tr><th>Parameter</th><th>{L(bi("मोजमाप", "Measurement"))}</th><th>{L(bi("पुरावा", "Evidence"))}</th><th>{L(bi("कमाल गुण", "Max"))}</th></tr></thead>
                <tbody>
                  {professionalRows.map((r) => <tr key={r.param.en}><td><strong>{L(r.param)}</strong></td><td>{L(r.measure)}</td><td>{L(r.evidence)}</td><td className={s.num}>{r.points}</td></tr>)}
                  <tr className={s.total}><td colSpan={3}>Total</td><td>100</td></tr>
                </tbody>
              </table></ScrollX>

              <div className={b.block}>
                <h3>{L(bi("प्रत्येक Parameter चे गणित", "How each parameter is scored"))}</h3>
                <ol className={b.steps}>
                  <li><b>Meeting Attendance (25)</b> — {L(bi("उपस्थिती % च्या प्रमाणात.", "proportional to attendance %."))} <b>25 × (Attendance % ÷ 100)</b>. {L(bi("उदा. 80% उपस्थिती = 20 गुण.", "e.g. 80% attendance = 20 points."))}</li>
                  <li>
                    <b>Examination Compliance — CCTV (25)</b> — {L(bi("दोन भाग:", "two parts:"))}
                    <br />• {L(bi("भाग 1 (12.5): CCTV सादर केलेले Exam Events ÷ झालेले Exam Events × 12.5", "Part 1 (12.5): Exam events with CCTV submitted ÷ events allotted & conducted × 12.5"))}
                    <br />• {L(bi("भाग 2 (12.5): वार्षिक Observation — Bad 0 · Poor 25% · Average 50% · Good 75% · Best 100% (× 12.5)", "Part 2 (12.5): Annual observation — Bad 0 · Poor 25% · Average 50% · Good 75% · Best 100% (× 12.5)"))}
                  </li>
                  <li><b>Social Media Presence (25)</b> — {L(bi("DCU Approved: Regular = 25, Irregular = 15.5, अन्यथा 0.", "DCU approved: Regular = 25, Irregular = 15.5, otherwise 0."))}</li>
                  <li>
                    <b>Month-wise Enrolment Consistency (25)</b> — {L(bi("किती महिन्यांत Admissions झाल्या त्यावर:", "based on the number of months with admissions:"))}
                    <ScrollX className={s.tableWrap} style={{ marginTop: 8 }}><table className={s.tbl}>
                      <thead><tr><th>{L(bi("महिने", "Months"))}</th><th>10+</th><th>8–9</th><th>6–7</th><th>4–5</th><th>&lt; 4</th></tr></thead>
                      <tbody><tr><td>{L(bi("गुण", "Points"))}</td><td className={s.num}>25</td><td className={s.num}>20</td><td className={s.num}>15</td><td className={s.num}>10</td><td className={s.num}>0</td></tr></tbody>
                    </table></ScrollX>
                  </li>
                </ol>
                <div className={b.example}>
                  <b>{L(bi("उदाहरण:", "Example:"))}</b>{" "}
                  {L(bi(
                    "उपस्थिती 80% → 20. CCTV: 3 पैकी 4 Events सादर → 9.375, Observation \"Good\" → 9.375; एकूण 18.75. Social Media \"Regular\" → 25. 9 महिने Admissions → 20. Index 4 = 20 + 18.75 + 25 + 20 = 83.75.",
                    "Attendance 80% → 20. CCTV: 3 of 4 events submitted → 9.375, observation \"Good\" → 9.375; total 18.75. Social media \"Regular\" → 25. Admissions in 9 months → 20. Index 4 = 20 + 18.75 + 25 + 20 = 83.75."
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Bonus ===== */}
      <section className={`${s.section} ${s.tint}`}>
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}>Excellence Bonus</span>
            <h2 className={s.h2}>{L(bi("Bonus कसा मोजला जातो", "How the bonus works"))}</h2>
            <div className={b.block}>
              <p>{L(bi(
                "Bonus प्रत्येक Index साठी आणि Index मधील प्रत्येक Parameter साठी स्वतंत्रपणे मोजला जातो, फक्त Target च्या पलीकडील Admissions साठी. दर टप्प्याटप्प्याने (Slab-wise) वाढतो आणि तो Parameter च्या Max. Points चा % म्हणून मिळतो.",
                "The bonus is computed separately for every Index and every parameter, only on admissions beyond the target. The rate rises slab by slab and is paid as a % of that parameter's Max. Points."
              ))}</p>
              <ScrollX className={s.tableWrap}><table className={s.tbl}>
                <thead><tr><th>{L(bi("Target च्या पलीकडे", "Beyond the target"))}</th><th>{L(bi("Bonus दर", "Bonus rate"))}</th></tr></thead>
                <tbody>{bonusSlabs.map((r, i) => <tr key={i}><td>{L(r.range)}</td><td><strong>{L(r.rate)}</strong></td></tr>)}</tbody>
              </table></ScrollX>
              <p style={{ marginTop: 12 }}>{L(bi(
                "Bonus 850 गुणांमध्ये जोडला जात नाही आणि Recognition Level बदलत नाही — तो फक्त एकाच Level मधील ALCs ना क्रमवारी देतो.",
                "Bonus is not added to the 850 and never changes the Recognition Level — it only ranks ALCs within the same Level."
              ))}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Award levels ===== */}
      <section className={s.section}>
        <div className={s.inner}>
          <Reveal>
            <span className={s.label}>Recognition Levels</span>
            <h2 className={s.h2}>{L(bi("अंतिम Level कसा ठरतो", "How the final Level is decided"))}</h2>
            <div className={b.block}>
              <p>{L(bi("चारही Index चे किमान गुण पार केले असतील तरच एकूण गुण (850 पैकी) खालील Bands शी तपासले जातात.", "Only when all four minimums are met is the total (out of 850) compared with these bands."))}</p>
              <ScrollX className={s.tableWrap}><table className={s.tbl}>
                <thead><tr><th>Level</th><th>% of 850</th><th>{L(bi("एकूण गुण", "Total points"))}</th></tr></thead>
                <tbody>{awardLevels.map((r) => <tr key={r.level.en}><td><strong>{L(r.level)}</strong></td><td>{r.pct}</td><td className={s.num}>{r.score}</td></tr>)}</tbody>
              </table></ScrollX>
              <div className={b.example}>
                <b>{L(bi("उदाहरण:", "Example:"))}</b>{" "}
                {L(bi(
                  "Index 1 = 300, Index 2 = 150, Index 3 = 120, Index 4 = 80 → चारही Floor पार (≥ 88, 50, 30, 25). एकूण = 650 → Gold (637 – 764).",
                  "Index 1 = 300, Index 2 = 150, Index 3 = 120, Index 4 = 80 → all four floors cleared (≥ 88, 50, 30, 25). Total = 650 → Gold (637 – 764)."
                ))}
              </div>
              <div className={b.cta}>
                <Link href="/dashboard" className={s.btn}>{L(bi("तुमचे स्थान तपासा", "Check Your Position"))} <ArrowRight size={16} /></Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
