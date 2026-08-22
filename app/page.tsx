import Link from "next/link";

/**
 * Landing / framework page — explains the "Vidarbha East Race to
 * Recognition" scheme (Annual Regional Meet Awards 2026-27) before the
 * user goes into the live dashboard. Pure static content, no data
 * fetching — everything here mirrors the official Recognition
 * Framework document.
 */

const urbanTargets = [
  { param: "MS-CIT Admissions", target: 425, points: 200 },
  { param: "KLiC Admissions", target: 250, points: 100 },
  { param: "CCTP Admissions", target: 150, points: 50 },
];

const ruralTargets = [
  { param: "MS-CIT Admissions", target: 250, points: 200 },
  { param: "KLiC Admissions", target: 125, points: 100 },
  { param: "CCTP Admissions", target: 75, points: 50 },
];

const ecosystemRows = [
  { initiative: "MoM", measurement: "District target achieved (Dashboard)", target: "100", points: 50 },
  { initiative: "AI Masterclass", measurement: "Target achieved (Dashboard)", target: "250", points: 60 },
  { initiative: "SSC / HSC", measurement: "Conducted. SOLAR, DCUs to verify & confirm", target: "250", points: 60 },
  { initiative: "ODOT 1", measurement: "Participated", target: "—", points: 15 },
  { initiative: "ODOT 2", measurement: "Participated", target: "—", points: 15 },
];

const mscitLearningRows: [string, string, number][] = [
  ["Timely Learning Start", "Started learning on ERA within the expected window after admission confirmation.", 20],
  ["Learning Consistency", "Learned regularly and consistently on ERA, rather than staying inactive and bunching it all at the end.", 20],
  ["Course Completion", "Completed the required learning sessions and all mandatory course requirements.", 20],
  ["Biometric Attendance", "Maintained regular physical attendance at the ALC, reflecting consistency and discipline.", 20],
  ["Learner App", "Downloaded and activated the Learner App and used it as part of the learning journey.", 20],
  ["Certification Success", "Completed the full learning journey, appeared for the exam, and successfully earned the certificate.", 20],
];

const klicLearningRows: [string, string, number][] = [
  ["Timely Learning Start", "Started learning on ERA within the expected window after admission / learning access.", 20],
  ["Learning Consistency", "Learned regularly and consistently on ERA, rather than bunching it all at the end.", 20],
  ["Course Completion", "Completed the required learning sessions and all mandatory course requirements.", 20],
  ["Certification Success", "Completed the full learning journey, appeared for the exam, and successfully earned the certificate.", 20],
];

const professionalRows = [
  { param: "Meeting Attendance", measurement: "Attendance %: from DCU", evidence: "Attendance Register", points: 25 },
  { param: "Examination Compliance", measurement: "CCTV — DCU", evidence: "Audit Report", points: 25 },
  { param: "Social Media Presence", measurement: "DCU Approved", evidence: "Link", points: 25 },
  { param: "Month-wise Enrolment Consistency", measurement: "Admissions in every month", evidence: "SOLAR", points: 25 },
];

const contentsTable = [
  { n: 1, name: "Business Growth Index", max: 350, min: 88, bonus: "As per bonus table" },
  { n: 2, name: "Ecosystem Participation Index", max: 200, min: 50, bonus: "As per bonus table" },
  { n: 3, name: "Learning Excellence Index", max: 200, min: 30, bonus: "No limit" },
  { n: 4, name: "Professional Excellence Index", max: 100, min: 25, bonus: "As per bonus table" },
];

const awardLevels = [
  { level: "Platinum", pct: "90% & above", score: "765+" },
  { level: "Gold", pct: "75% to 89.9%", score: "637–764" },
  { level: "Silver", pct: "60% to 74.9%", score: "510–636" },
  { level: "Bronze", pct: "50% to 59.9%", score: "425–509" },
];

const bonusSlabs = [
  { range: "Till 10% beyond the target", rate: "None" },
  { range: "Between 10.1% to 40%", rate: "35% of the Max. Points" },
  { range: "Between 40.1% to 80%", rate: "75% of the Max. Points" },
  { range: "Between 80.1% to 100%", rate: "100% of the Max. Points" },
  { range: "Beyond 100% of the target", rate: "120% of the Max. Points" },
];

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-7">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SimpleTable({
  head,
  rows,
  align,
}: {
  head: string[];
  rows: (string | number)[][];
  align?: ("left" | "center" | "right")[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            {head.map((h, i) => (
              <th
                key={h}
                className={`px-3 py-2 font-bold whitespace-nowrap ${
                  align?.[i] === "right" ? "text-right" : align?.[i] === "center" ? "text-center" : "text-left"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-3 py-2 border-t border-slate-100 ${
                    align?.[j] === "right" ? "text-right" : align?.[j] === "center" ? "text-center" : "text-left"
                  } ${j === r.length - 1 ? "font-semibold text-brand-orange" : "text-slate-600"}`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RootPage() {
  return (
    <div className="pb-10">
      {/* Sticky top navbar */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-0 py-3 flex items-center justify-between">
          <span className="font-bold text-slate-800 text-lg">
            <span className="bg-brand-gradient bg-clip-text text-transparent">Race to Recognition</span>
          </span>
          <Link
            href="/dashboard"
            className="bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
          >
            Go to the Dashboard →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <header className="bg-brand-gradient text-white rounded-b-2xl md:rounded-2xl md:mt-4 mx-0 md:mx-0 px-5 py-8 md:px-10 md:py-12">
        <p className="text-xs tracking-widest font-semibold text-white/80 uppercase">Insights360™ · MKCL</p>
        <h1 className="text-2xl md:text-4xl font-bold mt-2">Vidarbha East Race to Recognition</h1>
        <p className="text-white/90 mt-1 text-sm md:text-base">Annual Regional Meet Awards 2026-27 · Recognition Framework</p>
        <p className="italic text-white/85 mt-3 text-sm md:text-base">
          Together Towards Excellence · Together Towards Growth
        </p>
      </header>

      <div className="px-4 md:px-0 mt-6 space-y-6">
        {/* Preamble */}
        <SectionCard title="🏆 Recognition Beyond Numbers" subtitle="Preamble to every ALC partner">
          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Over the last two decades, MKCL, the District Coordinators, the Regional Team and every Authorised
              Learning Centre (ALC) have together carried Digital Literacy and career-oriented education to lakhs of
              learners across Vidarbha East. Every one of those ALCs has contributed something valuable to that
              journey.
            </p>
            <p>
              The world around us is changing fast. Artificial Intelligence is reshaping how people learn, work,
              communicate and build careers. Learners no longer just want a computer course — they want to be
              future-ready. MKCL has responded by weaving AI into MS-CIT and expanding its career-oriented courses;
              carrying that change to every learner, every parent and every school is now a shared responsibility.
            </p>
            <p>
              <strong>Vidarbha East Ready</strong> is the collective commitment behind this transformation — not a
              campaign, but a regional movement to prepare students, parents, teachers and society for the AI era,
              and to make the MKCL ecosystem stronger.
            </p>
            <p>
              With this shift, the very definition of excellence has to widen too. Business Growth remains essential
              for every ALC's sustainability — but success can no longer be measured by admission numbers alone. How
              many learners you truly empower, whether you guide their career progression, how actively you
              participate in MKCL's initiatives, how professionally you operate, and how much you contribute to your
              district's educational transformation — all of it matters just as much.
            </p>
            <p>
              That is the spirit behind the <strong>Vidarbha East Race to Recognition Framework</strong>: not just an
              award scheme, but a leadership framework that honours Business Growth, Learner Progression, Learning
              Excellence, Ecosystem Participation and Professional Contribution together.
            </p>
            <p className="font-semibold text-slate-700">
              Race to Recognition is not a competition — it is our collective commitment to Excellence, Continuous
              Learning and Contribution, and to preparing society for the AI era through Leadership.
            </p>
          </div>
        </SectionCard>

        {/* Framework background */}
        <SectionCard title="Framework — The Background" subtitle="Recognition follows Contribution">
          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              For years, admissions were the headline measure of success on our network. From this year, we measure
              much more — the full journey of contribution by both the Learner and the ALC. Together, all the
              indices below describe what an ideal MKCL ALC looks like:
            </p>
            <p className="font-semibold text-slate-700 bg-orange-50 rounded-xl px-4 py-3 text-center">
              Grow the business → take every learner forward → actively connect them to the MKCL ecosystem → make
              sure every learner is truly learning → operate with professional excellence.
            </p>

            <h3 className="font-bold text-slate-800 mt-4">What culture are we trying to build?</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Every MS-CIT learner should take at least one step further in their education — a 30, 60, 90 or 120-hour KLiC or CCTP course.</li>
              <li>This next step doesn't have to be the biggest course available.</li>
              <li>Every learner's progress matters — every admission is given equal importance, regardless of the chosen course's duration.</li>
              <li>A 30-hour course becomes the natural first step into KLiC, while outstanding performance in 90 and 120-hour courses earns its own Special Recognitions.</li>
            </ol>

            <h3 className="font-bold text-slate-800 mt-4">The culture shift</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs uppercase text-slate-400 font-semibold">Until now</p>
                <p className="font-medium">Admission = Success</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 bg-orange-50">
                <p className="text-xs uppercase text-slate-400 font-semibold">From now</p>
                <p className="font-medium">Admission → Learning → Completion → Progression = Success</p>
              </div>
            </div>

            <h3 className="font-bold text-slate-800 mt-4">Our roadmap</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>2026</strong> — We measure Learning.</li>
              <li><strong>2027</strong> — We consistently improve Learning.</li>
              <li><strong>2028</strong> — We celebrate Excellence in Learning.</li>
            </ul>

            <h3 className="font-bold text-slate-800 mt-4">District Excellence Championship</h3>
            <p>
              A district's win never comes from a single ALC — it comes from every ALC in that district working
              together. That collective excellence is honoured through the District Excellence Championship.
            </p>

            <p className="italic text-center text-slate-500 mt-4">
              Admission opens the door… Learning builds capability… Progression builds a career.
            </p>
          </div>
        </SectionCard>

        {/* Contents at a glance */}
        <SectionCard title="Contents — The Framework at a Glance">
          <SimpleTable
            head={["#", "Recognition Index", "Max Points", "Min Points", "Bonus Points"]}
            align={["center", "left", "center", "center", "center"]}
            rows={contentsTable.map((r) => [r.n, r.name, r.max, r.min, r.bonus])}
          />
          <p className="text-sm font-bold text-slate-700 mt-3">Final ALC Excellence Score: 850 points</p>

          <div className="grid md:grid-cols-2 gap-5 mt-5">
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Award Levels</h3>
              <SimpleTable
                head={["Level", "Percentage", "Points Score"]}
                align={["left", "center", "center"]}
                rows={awardLevels.map((l) => [l.level, l.pct, l.score])}
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">Excellence Bonus</h3>
              <SimpleTable
                head={["Admissions beyond target (any parameter/index)", "Bonus rate"]}
                align={["left", "center"]}
                rows={bonusSlabs.map((b) => [b.range, b.rate])}
              />
              <p className="text-xs text-slate-400 mt-2">
                Note: within a level, bonus points decide the exact position/sequence.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Index 1 */}
        <SectionCard
          title="Index 1 — Business Growth Index · 350 Points"
          subtitle="Grow the core business. Every ALC is scored only on its own category (Urban or Rural) — MS-CIT + KLiC + CCTP = 350 points."
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <h3 className="font-bold text-slate-800 mb-2">For an Urban ALC</h3>
              <SimpleTable
                head={["Parameter", "Target", "Points"]}
                align={["left", "center", "center"]}
                rows={[...urbanTargets.map((r) => [r.param, r.target, r.points]), ["Urban Total", "", 350]]}
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 mb-2">For a Rural ALC</h3>
              <SimpleTable
                head={["Parameter", "Target", "Points"]}
                align={["left", "center", "center"]}
                rows={[...ruralTargets.map((r) => [r.param, r.target, r.points]), ["Rural Total", "", 350]]}
              />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Measurement: Achievement vs. target · Evidence: Admission Portal</p>
        </SectionCard>

        {/* Index 2 */}
        <SectionCard
          title="Index 2 — Ecosystem Participation Index · 200 Points"
          subtitle="Every ALC participates in all the programmes recommended by MKCL — full-ecosystem participation, not selective adoption."
        >
          <SimpleTable
            head={["Initiative", "Measurement", "Target", "Points"]}
            align={["left", "left", "center", "center"]}
            rows={[...ecosystemRows.map((r) => [r.initiative, r.measurement, r.target, r.points]), ["Pillar Total", "", "", 200]]}
          />
        </SectionCard>

        {/* Index 3 */}
        <SectionCard
          title="Index 3 — Learning Excellence Index (New in 2026) · 200 Points"
          subtitle="Admission is where a learner's journey begins, not where it ends."
        >
          <div className="text-sm text-slate-600 leading-relaxed space-y-3 mb-5">
            <p>
              This index tracks a learner's entire journey after admission — turning every admission into meaningful
              learning, successful course completion and career progression. It's introduced with limited weightage
              in its first year, and its role will grow in the years ahead as Learning Analytics mature.
            </p>
          </div>
          <h3 className="font-bold text-slate-800 mb-2">The Scheme for MS-CIT</h3>
          <SimpleTable
            head={["Metric", "What it broadly measures", "Points"]}
            align={["left", "left", "center"]}
            rows={[...mscitLearningRows.map((r) => [r[0], r[1], r[2]] as (string | number)[]), ["Total", "", 120]]}
          />
          <h3 className="font-bold text-slate-800 mt-5 mb-2">The Scheme for KLiC</h3>
          <SimpleTable
            head={["Metric", "What it broadly measures", "Points"]}
            align={["left", "left", "center"]}
            rows={[...klicLearningRows.map((r) => [r[0], r[1], r[2]] as (string | number)[]), ["Total", "", 80]]}
          />

          <div className="mt-5 rounded-xl bg-orange-50 border border-orange-100 p-4 text-sm text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">Learning Excellence Credits</p>
            <p>
              Inside Learning Excellence, "Bonus" is called <strong>Learning Excellence Credits</strong> — and these
              credits carry <strong>no upper cap</strong>. They are not added to the Base Index Score and have no
              effect on the overall Race to Recognition score; they exist purely to independently recognise ALCs that
              consistently outperform the set benchmarks, building a culture of continuous excellence.
            </p>
            <p className="font-bold text-slate-800 mt-2">Vidarbha Learning Excellence Citation</p>
            <p>The Top 10 ALCs on the Learning Excellence Index receive the Vidarbha Learning Excellence Citation.</p>
          </div>
        </SectionCard>

        {/* Index 4 */}
        <SectionCard
          title="Index 4 — Professional Excellence Index · 100 Points"
          subtitle="Everything objective — the discipline, compliance and collaboration that let a centre operate professionally."
        >
          <SimpleTable
            head={["Parameter", "Measurement", "Evidence", "Points"]}
            align={["left", "left", "left", "center"]}
            rows={[
              ...professionalRows.map((r) => [r.param, r.measurement, r.evidence, r.points]),
              ["Pillar Total", "", "", 100],
            ]}
          />
          <ul className="list-disc list-inside text-sm text-slate-600 mt-3 space-y-1">
            <li>A centre that grows and progresses learners must also run professionally — attend, train, report on time and stay exam-compliant.</li>
            <li>All measures are objective and evidence-based — no subjectivity.</li>
          </ul>
        </SectionCard>

        {/* Contest norms */}
        <SectionCard title="Contest Norms — Essence & Direction">
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5">
            <li>Last date of the contest: <strong>30 November 2026</strong>.</li>
            <li>All admissions from <strong>1 Jan 2026 to 30 Nov 2026</strong> are counted.</li>
            <li>Every admission counts as ONE, irrespective of course hours.</li>
            <li>Eligibility floor: participation is required in every index.</li>
            <li>
              Excellence Bonus is separate, uncapped and accelerating — every point beyond your target earns a bonus
              that rises as you cross each milestone, applied slab by slab, at the rate of the index it falls in.
            </li>
            <li>The Growth Bonus is not added to the 850 and does not change your recognition level — it only ranks centres within the same level by real growth.</li>
            <li>The bonus is computed separately for every index, and for every parameter within that index.</li>
          </ul>
        </SectionCard>

        {/* Closing */}
        <SectionCard title="Recognition Follows Contribution">
          <p className="text-sm text-slate-600 mb-3">
            The whole framework can be read as one sentence about what every centre and district is asked to do:
          </p>
          <ul className="list-disc list-inside text-sm text-slate-700 font-medium space-y-1">
            <li>Grow the business.</li>
            <li>Progress every learner.</li>
            <li>Embrace the MKCL ecosystem.</li>
            <li>Build learning excellence.</li>
            <li>Operate professionally.</li>
            <li>Transform the district.</li>
          </ul>
          <p className="text-center font-bold text-brand-orange mt-6">
            Together Towards Excellence · Together Towards Growth
          </p>
          <div className="text-center mt-5">
            <Link
              href="/dashboard"
              className="inline-block bg-brand-gradient text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
            >
              Go to the Dashboard →
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
