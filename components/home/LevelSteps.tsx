"use client";

type Level = {
  key: string;
  tag: string;
  range: string;
  copy: string;
  num: number;
  points: string;
  h: number; // card height in cqw (scales with width)
  bg: string;
  edge: string;
  boxBg: string;
  boxLabel: string;
  boxValue: string;
  icon: "star" | "crown";
};

const LEVELS: Level[] = [
  {
    key: "bronze",
    tag: "BRONZE",
    range: "50% – 59.9%",
    copy: "Taking meaningful steps towards excellence.",
    num: 1,
    points: "425 – 509",
    h: 27.5,
    bg: "linear-gradient(180deg, #f39a2b 0%, #dc7a17 45%, #b85a0a 100%)",
    edge: "#f7b04a",
    boxBg: "linear-gradient(180deg, #fff1de 0%, #fbdcb7 100%)",
    boxLabel: "#7a3a0a",
    boxValue: "#3d1a06",
    icon: "star",
  },
  {
    key: "silver",
    tag: "SILVER",
    range: "60% – 74.9%",
    copy: "Building a strong foundation of excellence.",
    num: 2,
    points: "510 – 636",
    h: 31.4,
    bg: "linear-gradient(180deg, #b9b4b1 0%, #8f8a88 40%, #77726f 100%)",
    edge: "#c9c5c2",
    boxBg: "linear-gradient(180deg, #f6f6f6 0%, #e6e6e6 100%)",
    boxLabel: "#4a4745",
    boxValue: "#1e1b1a",
    icon: "star",
  },
  {
    key: "gold",
    tag: "GOLD",
    range: "75% – 89.9%",
    copy: "Strong and consistent performance.",
    num: 3,
    points: "637 – 764",
    h: 34.7,
    bg: "linear-gradient(180deg, #ffd91f 0%, #f5bb12 45%, #e3a00a 100%)",
    edge: "#ffe45a",
    boxBg: "linear-gradient(180deg, #fff3dc 0%, #fbe1b5 100%)",
    boxLabel: "#b4640f",
    boxValue: "#3d1a06",
    icon: "star",
  },
  {
    key: "platinum",
    tag: "PLATINUM",
    range: "90% & Above",
    copy: "Exceptional all-round excellence.",
    num: 4,
    points: "765+",
    h: 38.2,
    bg: "linear-gradient(180deg, #ff9d22 0%, #fb7c10 45%, #f2600a 100%)",
    edge: "#ffb349",
    boxBg: "linear-gradient(180deg, #fff1de 0%, #fbdcb7 100%)",
    boxLabel: "#c4520a",
    boxValue: "#3d1a06",
    icon: "crown",
  },
];

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8L12 3.2z" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 48 36" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
      <path d="M5 10l9 9 10-15 10 15 9-9-3 18H8L5 10z" />
      <path d="M8 32h32" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#f0145f" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="12" cy="9" r="6.2" />
      <circle cx="12" cy="9" r="2.6" />
      <path d="M8.6 14.2L7 21l5-2.6 5 2.6-1.6-6.8" />
    </svg>
  );
}

export default function LevelSteps({ showHeader = false }: { showHeader?: boolean }) {
  return (
    <section className="wrap">
      <div className="inner">
        {showHeader && (
        <div className="head">
          <span className="badge">
            <i className="badge-icon">
              <RibbonIcon />
            </i>
            RECOGNITION LEVELS
          </span>
          <h2>Every Level Represents a Journey</h2>
          <p>Climb from Bronze to Platinum as your ALC’s excellence grows.</p>
        </div>
        )}

        <div className="stairs">
          {LEVELS.map((l) => (
            <div
              key={l.key}
              className="card"
              style={{
                height: `${l.h}cqw`,
                background: l.bg,
                boxShadow: `inset 0 0.25cqw 0 ${l.edge}, 0 1.2cqw 2.4cqw rgba(60, 30, 0, 0.18)`,
              }}
            >
              <span className={l.icon === "crown" ? "icon crown" : "icon"}>
                {l.icon === "crown" ? <CrownIcon /> : <StarIcon />}
              </span>
              <span className="tag">{l.tag}</span>
              <span className="pill">{l.range}</span>
              <span className="rule" />
              <p className="copy">{l.copy}</p>
              <div className="num">
                <b>{l.num}</b>
              </div>
              <div className="points" style={{ background: l.boxBg }}>
                <span style={{ color: l.boxLabel }}>Points Score</span>
                <strong style={{ color: l.boxValue }}>{l.points}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wrap {
          container-type: inline-size;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .inner {
          padding: 1.6cqw 1.8cqw 2cqw;
          font-family: "Segoe UI", "Inter", system-ui, -apple-system, Arial, sans-serif;
        }
        .head {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 1.1cqw;
          background: #fdd5e2;
          color: #f0145f;
          font-weight: 700;
          font-size: 2cqw;
          letter-spacing: 0.01em;
          padding: 1.15cqw 2.2cqw;
          border-radius: 99cqw;
        }
        .badge-icon {
          display: inline-flex;
          width: 2.4cqw;
          height: 2.4cqw;
        }
        .badge-icon :global(svg) {
          width: 100%;
          height: 100%;
        }
        h2 {
          font-family: "Century Schoolbook", "Georgia", "Times New Roman", serif;
          font-weight: 800;
          font-size: 4.5cqw;
          line-height: 1.1;
          color: #0d1b4c;
          margin: 1.6cqw 0 0.5cqw;
          letter-spacing: -0.01em;
        }
        .head p {
          margin: 0;
          font-size: 2cqw;
          color: #1d2a4d;
        }

        .stairs {
          display: flex;
          align-items: flex-end;
          gap: 0.5cqw;
          margin-top: 2.6cqw;
        }
        .card {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.3cqw 1.2cqw 1.1cqw;
          border-radius: 2.6cqw 2.6cqw 1.6cqw 1.6cqw;
          color: #fff;
        }
        .icon {
          display: block;
          width: 2.9cqw;
          height: 2.9cqw;
        }
        .icon.crown {
          width: 4.4cqw;
          height: 3.3cqw;
        }
        .icon :global(svg) {
          width: 100%;
          height: 100%;
          display: block;
        }
        .tag {
          font-weight: 800;
          font-size: 3.2cqw;
          line-height: 1.1;
          margin-top: 0.2cqw;
          text-shadow: 0 0.15cqw 0.3cqw rgba(0, 0, 0, 0.18);
        }
        .pill {
          margin-top: 0.5cqw;
          background: #fff3e2;
          color: #3d1a06;
          font-weight: 700;
          font-size: 2.2cqw;
          padding: 0.7cqw 0;
          width: 82%;
          border-radius: 99cqw;
          box-shadow: 0 0.2cqw 0.5cqw rgba(0, 0, 0, 0.12);
        }
        .rule {
          display: block;
          width: 84%;
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
          margin-top: 1.1cqw;
        }
        .copy {
          margin: 0.8cqw 0 0;
          font-weight: 500;
          font-size: 1.75cqw;
          line-height: 1.2;
          padding: 0 0.3cqw;
        }
        .num {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.2cqw;
          width: 88%;
          margin-top: auto;
          margin-bottom: 0.2cqw;
        }
        .num::before,
        .num::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.55);
        }
        .num b {
          font-family: "Century Schoolbook", "Georgia", serif;
          font-weight: 800;
          font-size: 5.6cqw;
          line-height: 1;
          text-shadow: 0 0.2cqw 0.4cqw rgba(0, 0, 0, 0.18);
        }
        .points {
          width: 100%;
          margin-top: 0.4cqw;
          border-radius: 1.8cqw;
          padding: 1cqw 0 1.2cqw;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 0.2cqw 0.6cqw rgba(0, 0, 0, 0.15);
        }
        .points span {
          font-weight: 700;
          font-size: 2.05cqw;
          line-height: 1.2;
        }
        .points strong {
          font-weight: 800;
          font-size: 2.85cqw;
          line-height: 1.2;
        }
      `}</style>
    </section>
  );
}