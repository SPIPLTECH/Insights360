"use client";

const LEVELS = [
  { tag: "BRONZE", range: "50% – 59.9%", copy: "Taking meaningful steps towards excellence.", h: 130, color: "#e37950" },
  { tag: "SILVER", range: "60% – 74.9%", copy: "Building a strong foundation of excellence.", h: 170, color: "#9c9590" },
  { tag: "GOLD", range: "75% – 89.9%", copy: "Strong and consistent performance.", h: 220, color: "#ffe206" },
  { tag: "PLATINUM", range: "90% & Above", copy: "Exceptional all-round excellence.", h: 270, color: "#ff7b00" },
];

export default function LevelSteps() {
  return (
    <div className="stairs">
      {LEVELS.map((l) => (
        <div className="stair" key={l.tag} style={{ height: `${l.h}px` }}>
          <div className="stair-card">
            <span className="stair-tag" style={{ color: l.color }}>
              {l.tag}
            </span>
            <span className="stair-range">{l.range}</span>
            <p>{l.copy}</p>
          </div>
          <div className="stair-block" style={{ background: l.color }}>
            <span className="stair-face" style={{ background: l.color }} />
          </div>
        </div>
      ))}

      <style jsx>{`
        .stairs {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 12px;
        }
        .stair {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          position: relative;
        }
        .stair-card {
          width: 100%;
          text-align: center;
          margin-bottom: 14px;
        }
        .stair-tag {
          display: block;
          font-family: "Fraunces", serif;
          font-weight: 600;
          font-size: 19px;
          margin-bottom: 2px;
        }
        .stair-range {
          display: block;
          font-family: "Work Sans", sans-serif;
          font-size: 11px;
          color: #8a7a70;
          margin-bottom: 8px;
        }
        .stair-card p {
          font-size: 12.5px;
          color: #4a3f38;
          margin: 0;
          line-height: 1.4;
          padding: 0 6px;
        }
        .stair-block {
          width: 100%;
          height: 100%;
          border-radius: 10px 10px 0 0;
          box-shadow: inset 0 6px 0 rgba(255, 255, 255, 0.25), 0 -6px 18px rgba(0, 0, 0, 0.08);
          position: relative;
        }
        .stair-block::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: rgba(255, 255, 255, 0.35);
          border-radius: 10px 10px 0 0;
        }

        @media (max-width: 700px) {
          .stairs {
            align-items: flex-end;
            gap: 6px;
          }
          .stair-card p {
            display: none;
          }
          .stair-range {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}