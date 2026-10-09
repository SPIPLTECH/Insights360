"use client";
import Link from "next/link";
import { Infinity as Inf, Trophy, Medal, GraduationCap, Briefcase, Rocket, Sprout, BarChart3, ArrowRight, MapPinned } from "lucide-react";
import { Sec, Flow, Reveal } from "./ui";
import { useLang } from "./LanguageProvider";

export default function LiveRace() {
  const { t } = useLang();
  return (
    <>
      <Sec tone="dark" title={t("There Is No Ceiling to Excellence.", "उत्कृष्टतेला मर्यादा नाही.")}>
        <span className="ico"><Inf /></span>
        <p className="big" style={{ color: "#FF9A5C", margin: "16px 0 4px", fontSize: "clamp(40px,8vw,88px)" }}>UNCAPPED</p>
        <p className="serif" style={{ fontSize: 22 }}>Learning Excellence Credits</p>
        <Flow items={["Perform", "Improve", "Excel", "Get Recognised"]} />
        <p className="sub" style={{ margin: "0 auto" }}>{t("Credits are tracked separately — they are not added to the Base Score or the overall 850.", "Credits स्वतंत्रपणे नोंदवले जातात — ते Base Score किंवा 850 मध्ये जोडले जात नाहीत.")}</p>
      </Sec>

      <Sec title={t("Beyond the Score", "गुणसंख्येच्या पलीकडे")}>
        <div className="grid g2">
          <div className="card"><span className="ico"><Medal /></span><h3>Vidarbha Learning Excellence Citation</h3><p>Top 10 ALCs</p></div>
          <div className="card"><span className="ico"><Trophy /></span><h3>District Excellence Championship</h3><p>{t("Collective Excellence", "सामूहिक उत्कृष्टता")}</p></div>
        </div>
        <p className="lead">{t("Sometimes the greatest achievement isn't standing first — it's helping everyone move forward.", "कधी कधी सर्वात मोठे यश पहिले येणे नसते — सर्वांना पुढे नेणे असते.")}</p>
      </Sec>

      <Sec tone="tint" title={t("The Race Has Begun.", "शर्यत सुरू झाली आहे.")}>
        <div className="dl"><small>{t("Contest deadline", "Contest ची अंतिम तारीख")}</small><b className="serif">{t("30 NOVEMBER 2026", "30 नोव्हेंबर 2026")}</b></div>
        <Reveal>
          <ol className="tl">
            {[["Jan 2026", t("Admissions start counting", "Admissions मोजणी सुरू")], ["2026", "MEASURE"], ["2027", "IMPROVE"], ["2028", "EXCEL"]].map(([y, d]) => <li key={y}><b className="serif">{y}</b><span>{d}</span></li>)}
          </ol>
        </Reveal>
      </Sec>

      <Sec title={t("One ALC Can Inspire. An Entire District Can Transform.", "एक ALC प्रेरणा देते. संपूर्ण जिल्हा परिवर्तन घडवतो.")}>
        <Flow items={["ALC + ALC + ALC + ALC", "District", "Transformation"]} />
        <span className="ico"><MapPinned /></span>
        <p className="lead">District Excellence Championship</p>
      </Sec>

      <Sec tone="warm" title={t("Behind Every Number, There Is a Learner.", "प्रत्येक आकड्यामागे एक Learner आहे.")} sub="1 Admission might mean">
        <div className="grid g4">
          {[[GraduationCap, "First Digital Skill", "पहिले Digital Skill"], [Briefcase, "New Career", "नवे Career"], [Rocket, "New Opportunity", "नवी संधी"], [Sprout, "New Future", "नवे भविष्य"]].map(([I, en, mr]) => {
            const Icon = I as typeof Rocket;
            return <div className="card" key={en as string}><span className="ico"><Icon /></span><h3>{t(en as string, mr as string)}</h3></div>;
          })}
        </div>
        <p className="lead">{t("Our work is ultimately not about numbers. It is about people.", "आपले काम आकड्यांबद्दल नाही. ते माणसांबद्दल आहे.")}</p>
      </Sec>

      <Sec title={t("See Your Position", "तुमचे स्थान पहा")}>
        <div className="grid g2">
          <Link href="/dashboard" className="card"><span className="ico"><Trophy /></span><h3>Leaderboard — {t("See Where You Stand", "आपण कुठे उभे आहात")}</h3><p className="go">{t("Go to Dashboard", "Dashboard वर जा")} <ArrowRight size={15} /></p></Link>
          <Link href="/index-1" className="card"><span className="ico"><BarChart3 /></span><h3>My Progress — {t("Your Journey. Your Recognition.", "आपला प्रवास. आपले Recognition.")}</h3><p className="go">{t("Check Index Points", "Index Points तपासा")} <ArrowRight size={15} /></p></Link>
        </div>
      </Sec>
      <style jsx>{`
        .dl{margin:0 auto 26px;max-width:500px;padding:24px;border:2px solid var(--ember);border-radius:20px;background:#fff}
        .dl b{display:block;font-size:clamp(28px,5vw,44px);color:var(--ember)}
        .tl{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:left}
        .tl li{background:#fff;border:1px solid var(--line);border-top:5px solid var(--ember);border-radius:14px;padding:18px}
        .tl b{display:block;color:var(--ember);font-size:20px}.tl span{font-size:14px;color:var(--dim)}
        .go{display:flex;gap:6px;align-items:center;color:var(--ember)!important;font-weight:600;margin-top:12px!important}
        @media(max-width:900px){.tl{grid-template-columns:1fr}}
      `}</style>
    </>
  );
}