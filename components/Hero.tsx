"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Award, Building2, CheckCircle2, ChevronLeft, ChevronRight, Crown, Medal, MapPin, RefreshCw, Sparkles, Trophy } from "lucide-react";
import { useDashboardData } from "@/lib/useDashboardData";
import { INDEX_MIN_POINTS, computeAwardLevels } from "@/lib/calculations";
import { useLang } from "./LanguageProvider";
import Garden from "./Garden";
import h from "./Hero.module.css";

/** Official ALC count for Vidarbha East (595) — every "total" on this page is measured against it. */
const TOTAL_ALC = 595;
/** Optional: fill per-district ALC counts here (should add up to 595). Empty = counted from live data. */
const DISTRICT_ALC: Partial<Record<string, number>> = {};

const IMAGES = ["/banner1.png", "/img4.png", "/25year.png"]; // each image: 1413 × 255
const SLIDE_MS = 4000;

const DISTRICTS = ["Nagpur", "Chandrapur", "Bhandara", "Gondiya", "Gadchiroli", "Wardha"];
const DISTRICT_MR: Record<string, string> = {
  Nagpur: "नागपूर", Chandrapur: "चंद्रपूर", Bhandara: "भंडारा", Gondiya: "गोंदिया", Gadchiroli: "गडचिरोली", Wardha: "वर्धा",
};
const LEVELS = ["Platinum", "Gold", "Silver", "Bronze"] as const;
type Level = (typeof LEVELS)[number];
const LEVEL_COLOR: Record<Level, string> = { Platinum: "#ff7b00", Gold: "#e0a100", Silver: "#9c9590", Bronze: "#cd7f32" };
const LEVEL_ICON = { Platinum: Crown, Gold: Trophy, Silver: Medal, Bronze: Award } as const;
const IDX = [1, 2, 3, 4] as const;
const MIN = [INDEX_MIN_POINTS.index1, INDEX_MIN_POINTS.index2, INDEX_MIN_POINTS.index3, INDEX_MIN_POINTS.index4];

type Row = { district: string; alcs: number; cleared: number[]; levels: Record<Level, number>; awarded: number };

/** Spelling variants seen in sheets (English / Marathi / Hindi). Matching ignores case, spaces and punctuation. */
const ALIASES: Record<string, string[]> = {
  nagpur: ["nagpur", "nagpurcity", "नागपूर", "नागपुर"],
  chandrapur: ["chandrapur", "chanda", "chandrpur", "चंद्रपूर", "चंद्रपुर"],
  bhandara: ["bhandara", "bhandra", "भंडारा"],
  gondiya: ["gondiya", "gondia", "gondya", "gondiaa", "gondea", "gondiy", "गोंदिया", "गोंदीया", "गोंदिया"],
  gadchiroli: ["gadchiroli", "gadchirolli", "gadhchiroli", "gadchiroly", "गडचिरोली"],
  wardha: ["wardha", "vardha", "wardhaa", "वर्धा"],
};
const norm = (s: string) => (s ?? "").toLowerCase().replace(/[^a-z\u0900-\u097f]/g, "");
const same = (a: string, b: string) => {
  const x = norm(a);
  if (!x) return false;
  const key = norm(b);
  return (ALIASES[key] ?? [key]).some((al) => x.includes(norm(al)) || (x.length > 3 && norm(al).includes(x)));
};
const rise = (i: number): CSSProperties => ({ ["--d" as string]: `${i * 70}ms` });
const pctOf = (n: number, d: number) => (d ? Math.min(100, Math.round((n / d) * 100)) : 0);

export default function Hero() {
  const { lang, L } = useLang();
  const { data, error, loading, refresh, refreshing } = useDashboardData();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((p) => (p + 1) % IMAGES.length), SLIDE_MS);
    return () => clearInterval(id);
  }, [paused, active]);

  const rows = useMemo<Row[] | null>(() => {
    if (!data) return null;
    const stats = [data.index1, data.index2, data.index3, data.index4];
    const levelMap = computeAwardLevels(data.index1, data.index2, data.index3, data.index4);
    const codeDistrict = new Map<string, string>();
    stats.forEach((st) => st.records.forEach((r) => !codeDistrict.has(r.alcCode) && codeDistrict.set(r.alcCode, r.district)));

    if (process.env.NODE_ENV !== "production") {
      const unmatched = new Set<string>();
      codeDistrict.forEach((dist) => { if (!DISTRICTS.some((d) => same(dist, d))) unmatched.add(dist); });
      if (unmatched.size) console.warn("[Hero] District names not matched:", [...unmatched]);
    }

    return DISTRICTS.map((d) => {
      const codes = new Set<string>();
      codeDistrict.forEach((dist, code) => same(dist, d) && codes.add(code));
      const cleared = stats.map((st, i) => st.records.filter((r) => same(r.district, d) && r.totalPoints >= MIN[i]).length);
      const levels: Record<Level, number> = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 };
      levelMap.forEach((lv, code) => {
        if (lv !== "Not Eligible" && same(codeDistrict.get(code) ?? "", d)) levels[lv] += 1;
      });
      return { district: d, alcs: DISTRICT_ALC[d] ?? codes.size, cleared, levels, awarded: LEVELS.reduce((a, k) => a + levels[k], 0) };
    });
  }, [data]);

  const sum = (f: (r: Row) => number) => (rows ? rows.reduce((a, r) => a + f(r), 0) : 0);
  const awardedAll = sum((r) => r.awarded);
  const name = (d: string) => (lang === "mr" ? DISTRICT_MR[d] : d);
  const prev = () => setActive((p) => (p - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setActive((p) => (p + 1) % IMAGES.length);

  const chips = (r: Row) => (
    <div className={h.levels}>
      {LEVELS.map((lv) => {
        const I = LEVEL_ICON[lv];
        return (
          <span key={lv} className={r.levels[lv] ? h.lv : `${h.lv} ${h.lvOff}`} title={lv}>
            <I size={11} strokeWidth={2.4} color={LEVEL_COLOR[lv]} />{lv[0]} {r.levels[lv]}
          </span>
        );
      })}
    </div>
  );

  return (
    <section className={h.hero}>
      {/* ---------- banner carousel (1413 : 255) ---------- */}
      <div className={`${h.carousel} ${h.rise}`} style={rise(0)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} width={1413} height={255} alt={`Vidarbha East highlight ${i + 1}`} className={`${h.slide} ${i === active ? h.slideOn : ""}`} />
        ))}
        <button className={`${h.arrow} ${h.arrowL}`} onClick={prev} aria-label="Previous"><ChevronLeft size={20} /></button>
        <button className={`${h.arrow} ${h.arrowR}`} onClick={next} aria-label="Next"><ChevronRight size={20} /></button>
        <div className={h.dots}>
          {IMAGES.map((_, i) => (
            <button key={i} className={`${h.dot} ${i === active ? h.dotOn : ""}`} onClick={() => setActive(i)} aria-label={`Image ${i + 1}`}>
              {i === active && !paused && <span key={active} className={h.dotFill} style={{ animationDuration: `${SLIDE_MS}ms` }} />}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- title (always centred) ---------- */}
      <div className={`${h.titleWrap} ${h.rise}`} style={rise(2)}>
        <div className={`${h.fxWrap} ${h.fxL}`}><Garden side="left" /></div>
        <div className={`${h.fxWrap} ${h.fxR}`}><Garden side="right" /></div>
        <h1 className={h.title}>
          <span className={h.t1}>VIDARBHA EAST</span>
          <span className={h.dash}>–</span>
          <em className={h.t2}>RACE TO RECOGNITION</em>
        </h1>
      </div>

      {/* ---------- dashboard ---------- */}
      <div className={h.dash2}>
        <div className={`${h.pillWrap} ${h.rise}`} style={rise(3)}>
          <span className={h.glancePill}><Sparkles size={15} /> {L({ mr: "एका दृष्टिक्षेपात", en: "All at a Glance" })}</span>
        </div>

        {/* desktop / tablet: district table */}
        {(loading || rows) && (
          <div className={`${h.tableScroll} ${h.rise}`} style={rise(4)}>
            <table className={h.table}>
              <thead>
                <tr>
                  <th className={h.left}>{L({ mr: "जिल्हे", en: "District" })}</th>
                  {IDX.map((n) => (
                    <th key={n}>
                      <Link href={`/index-${n}`} className={h.thLink}>
                        Index {n}
                        <small>{L({ mr: "उत्तीर्ण ALC", en: "ALCs cleared" })}</small>
                      </Link>
                    </th>
                  ))}
                  <th className={h.awardTh}>
                    {L({ mr: "पुरस्कार स्तर", en: "Award level" })}
                    <small>{L({ mr: "उत्तीर्ण ALC व कोणता", en: "Cleared & which" })}</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading &&
                  DISTRICTS.map((d) => (
                    <tr key={d}>
                      <td className={h.left}>{name(d)}</td>
                      {[0, 1, 2, 3, 4].map((c) => <td key={c}><span className={h.skel} /></td>)}
                    </tr>
                  ))}

                {!loading && rows &&
                  rows.map((r, ri) => (
                    <tr key={r.district} className={h.rowIn} style={rise(5 + ri)}>
                      <td className={h.left}>{name(r.district)}</td>
                      {IDX.map((n, i) => (
                        <td key={n}>
                          <span className={h.big}>{r.cleared[i]}</span>
                          <span className={h.of}> / {r.alcs}</span>
                          <div className={h.bar}><i style={{ width: `${pctOf(r.cleared[i], r.alcs)}%` }} /></div>
                        </td>
                      ))}
                      <td>
                        <div className={h.awardCell}>
                          <span className={`${h.big} ${h.accent}`}>{r.awarded}</span>
                          {chips(r)}
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && rows && (
                  <tr className={h.totalRow}>
                    <td className={h.left}>{L({ mr: "एकूण", en: "Vidarbha East" })}</td>
                    {IDX.map((n, i) => (
                      <td key={n}>
                        <span className={h.big}>{sum((r) => r.cleared[i])}</span>
                        <span className={h.of}> / {TOTAL_ALC}</span>
                      </td>
                    ))}
                    <td><span className={`${h.big} ${h.accent}`}>{awardedAll}</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* mobile: one card per district */}
        {(loading || rows) && (
          <div className={h.mCards}>
            {loading && DISTRICTS.slice(0, 3).map((d) => <div key={d} className={`${h.mCard} ${h.mSkel}`} />)}
            {!loading && rows && rows.map((r, ri) => (
              <div key={r.district} className={h.mCard} style={rise(ri)}>
                <div className={h.mHead}>
                  <span className={h.mName}><i><MapPin size={14} /></i>{name(r.district)}</span>
                  <span className={h.mAward}><Trophy size={13} /> <b>{r.awarded}</b> {L({ mr: "पुरस्कार", en: "awarded" })}</span>
                </div>
                <div className={h.mGrid}>
                  {IDX.map((n, i) => (
                    <Link key={n} href={`/index-${n}`} className={h.mCell}>
                      <span>Index {n}</span>
                      <b>{r.cleared[i]}<em> / {r.alcs}</em></b>
                      <div className={h.bar}><i style={{ width: `${pctOf(r.cleared[i], r.alcs)}%` }} /></div>
                    </Link>
                  ))}
                </div>
                {chips(r)}
              </div>
            ))}
            {!loading && rows && (
              <div className={`${h.mCard} ${h.mTotal}`}>
                <div className={h.mHead}>
                  <span className={h.mName}><i><Trophy size={14} /></i>{L({ mr: "एकूण", en: "Vidarbha East" })}</span>
                  <span className={h.mAward}><b>{awardedAll}</b> {L({ mr: "पुरस्कार", en: "awarded" })}</span>
                </div>
                <div className={h.mGrid}>
                  {IDX.map((n, i) => (
                    <div key={n} className={h.mCell}><span>Index {n}</span><b>{sum((r) => r.cleared[i])}<em> / {TOTAL_ALC}</em></b></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !rows && (
          <div className={h.errBox}>
            {L({ mr: "डेटा लोड होऊ शकला नाही.", en: "Couldn't load live data." })} {error?.message ? `(${error.message.slice(0, 90)})` : ""}
            <button onClick={refresh} className={h.retry}><RefreshCw size={13} /> {L({ mr: "पुन्हा प्रयत्न", en: "Retry" })}</button>
          </div>
        )}

        <p className={h.legend}>
          <span>{L({ mr: "उत्तीर्ण = किमान गुण पार:", en: "Cleared = minimum points met:" })}{" "}{IDX.map((n, i) => `I${n} ≥ ${MIN[i]}${i < 3 ? " · " : ""}`)}</span>
          <span className={h.legendLv}>P Platinum · G Gold · S Silver · B Bronze</span>
          <span className={h.live}>
            <i className={refreshing ? h.pulse : ""} />
            {data ? `${L({ mr: "अद्यतन", en: "Updated" })} ${new Date(data.fetchedAt).toLocaleTimeString("en-IN")}` : "…"}
          </span>
        </p>

        {/* summary — below the fold, revealed on scroll */}
        <div className={h.stats}>
          <div className={`${h.stat} ${h.statMain}`} data-fx>
            <i className={h.sIcon}><Building2 size={18} /></i><span className={h.statLabel}>{L({ mr: "एकूण ALC", en: "Total ALCs" })}</span>
            <b>{TOTAL_ALC}</b>
            <small>Vidarbha East</small>
          </div>
          {IDX.map((n, i) => (
            <Link key={n} href={`/index-${n}`} className={h.stat} data-fx>
              <i className={h.sIcon}><CheckCircle2 size={18} /></i><span className={h.statLabel}>Index {n}</span>
              <b>{rows ? sum((r) => r.cleared[i]) : "–"}<em> / {TOTAL_ALC}</em></b>
              <div className={h.bar}><i style={{ width: `${pctOf(sum((r) => r.cleared[i]), TOTAL_ALC)}%` }} /></div>
              <small>{L({ mr: "किमान", en: "Min" })} {MIN[i]} {L({ mr: "गुण", en: "pts" })}</small>
            </Link>
          ))}
          <div className={h.stat} data-fx>
            <i className={h.sIcon}><Trophy size={18} /></i><span className={h.statLabel}>{L({ mr: "पुरस्कार पात्र", en: "Award eligible" })}</span>
            <b>{rows ? awardedAll : "–"}<em> / {TOTAL_ALC}</em></b>
            <div className={h.bar}><i style={{ width: `${pctOf(awardedAll, TOTAL_ALC)}%` }} /></div>
            <small>{pctOf(awardedAll, TOTAL_ALC)}%</small>
          </div>
        </div>

        {rows && (
          <div className={h.levelsRow}>
            {LEVELS.map((lv) => {
              const c = sum((r) => r.levels[lv]);
              const I = LEVEL_ICON[lv];
              return (
                <div key={lv} className={h.levelBox} data-fx style={{ ["--c" as string]: LEVEL_COLOR[lv] }}>
                  <i><I size={16} /></i>
                  <span>{lv}</span>
                  <b>{c}</b>
                </div>
              );
            })}
          </div>
        )}

        <p className={h.tagline} data-fx>
          {L({ mr: "वार्षिक विभागीय मेळावा पुरस्कार 2026-27", en: "Annual Regional Meet Awards 2026-27" })} · Together Towards Excellence · Together Towards Growth
        </p>
      </div>
    </section>
  );
}
