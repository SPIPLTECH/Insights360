"use client";

import Link from "next/link";

const STOPS = [
  {
    n: "01",
    kicker: "Building the foundation",
    t: "Business Growth",
    d: "Building a strong and sustainable ALC.",
    href: "/index1",
    x: 340,
    y: 430,
    pos: "below",
  },
  {
    n: "02",
    kicker: "Being part of something bigger",
    t: "Ecosystem Participation",
    d: "Being an active part of the larger MKCL ecosystem.",
    href: "/index2",
    x: 560,
    y: 270,
    pos: "above",
  },
  {
    n: "03",
    kicker: "Turning admissions into outcomes",
    t: "Learning Excellence",
    d: "Ensuring that Admissions translate into meaningful learning and progression.",
    href: "/index3",
    x: 880,
    y: 430,
    pos: "below",
  },
  {
    n: "04",
    kicker: "Discipline and compliance",
    t: "Professional Excellence",
    d: "Building a culture of discipline, compliance and professional practice.",
    href: "/index4",
    x: 1180,
    y: 270,
    pos: "above",
  },
];

const ROAD_PATH =
  "M150,470 C 220,470 260,430 340,430 " +
  "C 420,430 480,270 560,270 " +
  "C 660,270 780,430 880,430 " +
  "C 980,430 1100,270 1180,270 " +
  "C 1260,270 1320,370 1380,370";

const VB_W = 1560;
const VB_H = 560;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;

export default function FrameworkRoad() {
  return (
    <div className="road-wrap">
      <div className="road-scroll" style={{ position: "relative" }}>
        <svg
          className="road-svg"
          viewBox="0 0 1560 560"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <defs>
            <linearGradient id="roadFill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFE3D3" />
              <stop offset="50%" stopColor="#FFD7E2" />
              <stop offset="100%" stopColor="#FFE3D3" />
            </linearGradient>
          </defs>

          <path d={ROAD_PATH} stroke="url(#roadFill)" strokeWidth="48" strokeLinecap="round" />
          <path
            d={ROAD_PATH}
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="15 17"
            strokeLinecap="round"
          />

          {/* Start marker */}
          <circle cx="150" cy="470" r="26" fill="#1A1310" />
          <text x="150" y="476" textAnchor="middle" fontFamily="'Work Sans',sans-serif" fontSize="15" fontWeight="700" fill="#fff">S</text>

          {/* Goal marker */}
          <circle cx="1380" cy="370" r="26" fill="#1A1310" />
          <text x="1380" y="376" textAnchor="middle" fontFamily="'Work Sans',sans-serif" fontSize="15" fontWeight="700" fill="#fff">🚩</text>

          {STOPS.map((s) => (
            <g key={s.n}>
              <circle cx={s.x} cy={s.y} r="34" fill="#FFFFFF" stroke="#FF3D6E" strokeWidth="4" />
              <text
                x={s.x}
                y={s.y + 6}
                textAnchor="middle"
                fontFamily="'Fraunces', serif"
                fontSize="20"
                fontWeight="700"
                fill="#FF3D6E"
              >
                {s.n}
              </text>
            </g>
          ))}
        </svg>

        {/* Start / Future tags — inline positioned, guaranteed to apply */}
        <span
          style={{
            position: "absolute",
            left: pct(150, VB_W),
            top: pct(512, VB_H),
            transform: "translate(-50%, 0)",
            fontFamily: "'Work Sans',sans-serif",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#1a1310",
            whiteSpace: "nowrap",
          }}
        >
          Start
        </span>
        <span
          style={{
            position: "absolute",
            left: pct(1380, VB_W),
            top: pct(412, VB_H),
            transform: "translate(-50%, 0)",
            fontFamily: "'Work Sans',sans-serif",
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: "#1a1310",
            whiteSpace: "nowrap",
          }}
        >
       Excellence
        </span>

        {STOPS.map((s) => {
          const isAbove = s.pos === "above";
          return (
            <Link
              href={s.href}
              key={s.n}
              className="road-label"
              style={{
                position: "absolute",
                left: pct(s.x, VB_W),
                top: pct(isAbove ? s.y - 46 : s.y + 46, VB_H),
                transform: isAbove ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                width: 230,
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <span className="kicker" style={{ fontSize: 12, color: "#8a7a70" }}>
                {s.kicker}
              </span>
              <span
                className="title"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#1a1310",
                }}
              >
                {s.t}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="road-legend">
        {STOPS.map((s) => (
          <p key={s.n}>
            <strong>{s.n}</strong> {s.d}
          </p>
        ))}
      </div>

      <style jsx>{`
        .road-wrap {
          max-width: 1120px;
          margin: 0 auto;
        }
        .road-scroll {
          width: 100%;
          min-width: 760px;
          aspect-ratio: 1560 / 560;
        }
        .road-label .title {
          transition: color 0.2s ease;
        }
        .road-label:hover .title {
          color: #ff3d6e;
        }

        .road-legend {
          max-width: 900px;
          margin: 40px auto 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 32px;
          text-align: left;
        }
        .road-legend p {
          font-size: 13.5px;
          color: #4a3f38;
          margin: 0;
        }
        .road-legend strong {
          color: #ff3d6e;
          font-family: "Work Sans", sans-serif;
          margin-right: 6px;
        }

        @media (max-width: 860px) {
          .road-scroll {
            overflow-x: auto;
          }
          .road-legend {
            grid-template-columns: 1fr;
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}