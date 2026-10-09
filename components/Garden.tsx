"use client";

import { Award, Crown, Medal, Sparkles, Star, Trophy } from "lucide-react";
import g from "./Garden.module.css";

const STAR = "M0,-1 C0,-0.15 0.15,0 1,0 C0.15,0 0,0.15 0,1 C0,0.15 -0.15,0 -1,0 C-0.15,0 0,-0.15 0,-1Z";
const W = 220;

const SPARKS = [
  { x: 52, y: 14, s: 11, d: 0, c: "#f5762e" },
  { x: 168, y: 66, s: 7, d: 0.9, c: "#ec1e63" },
  { x: 24, y: 128, s: 8, d: 1.7, c: "#e0a100" },
  { x: 130, y: 176, s: 10, d: 0.5, c: "#ec1e63" },
  { x: 76, y: 232, s: 6, d: 2.3, c: "#f5762e" },
  { x: 188, y: 222, s: 6, d: 1.2, c: "#e0a100" },
];

/** Glass icon chips — each floats on its own rhythm. tone picks the gradient. */
const CHIPS = {
  left: [
    { Icon: Trophy, x: 44, y: 28, size: 54, tone: "t1", d: 0 },
    { Icon: Star, x: 132, y: 112, size: 40, tone: "t3", d: 1.1 },
    { Icon: Medal, x: 40, y: 178, size: 46, tone: "t2", d: 2.1 },
  ],
  right: [
    { Icon: Crown, x: 44, y: 28, size: 54, tone: "t2", d: 0.6 },
    { Icon: Sparkles, x: 132, y: 112, size: 40, tone: "t1", d: 1.7 },
    { Icon: Award, x: 40, y: 178, size: 46, tone: "t3", d: 2.6 },
  ],
} as const;

/** Decorative glow: aurora orbs + floating glass icon chips + twinkling sparkles + rising bokeh. */
export default function Garden({ side = "left" }: { side?: "left" | "right" }) {
  const flip = (x: number, w: number) => (side === "right" ? W - x - w : x);
  return (
    <div className={`${g.fx} ${side === "left" ? g.left : g.right}`} aria-hidden="true">
      <span className={`${g.orb} ${g.o1}`} />
      <span className={`${g.orb} ${g.o2}`} />

      {CHIPS[side].map(({ Icon, x, y, size, tone, d }, k) => (
        <span
          key={k}
          className={`${g.chip} ${g[tone]}`}
          style={{ left: flip(x, size), top: y, width: size, height: size, animationDelay: `${d}s` }}
        >
          <Icon size={Math.round(size * 0.46)} strokeWidth={2.2} />
        </span>
      ))}

      {[0, 1, 2, 3, 4, 5].map((k) => (
        <b key={k} className={g.bokeh} style={{ left: 20 + k * 28, animationDelay: `${k * 0.9}s`, animationDuration: `${6 + (k % 3)}s` }} />
      ))}
      {SPARKS.map(({ x, y, s, d, c }, k) => (
        <svg key={k} className={g.spark} style={{ left: flip(x, 0), top: y, width: s * 2, height: s * 2, animationDelay: `${d}s` }} viewBox="-1 -1 2 2">
          <path d={STAR} fill={c} />
        </svg>
      ))}
    </div>
  );
}

/** Small divider: line — sparkle — line */
export function FlowerDivider() {
  return (
    <div className={g.divider} aria-hidden="true">
      <span />
      <svg width="22" height="22" viewBox="-1 -1 2 2"><path d={STAR} fill="#ec1e63" /></svg>
      <span />
    </div>
  );
}
