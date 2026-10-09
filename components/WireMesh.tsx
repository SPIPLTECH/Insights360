"use client";

import { useId } from "react";
import m from "./WireMesh.module.css";

/**
 * Decorative wire-mesh panel (replaces the old flowers / leaves "Garden").
 * Pure SVG pattern: a woven diamond lattice with twisted joints, faded at the inner edge,
 * plus one slow saffron "glint" that travels across the wire. aria-hidden, pointer-events none.
 * The parent must be `position: relative` (and ideally `overflow: hidden`).
 */
function Lattice({ id, size }: { id: string; size: number }) {
  const c = size / 2;
  const b = size * 0.18; // wire bulge
  return (
    <svg className={m.svg} xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M0 ${c} Q${b} ${b} ${c} 0 Q${size - b} ${b} ${size} ${c} Q${size - b} ${size - b} ${c} ${size} Q${b} ${size - b} 0 ${c}Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {[[0, c], [size, c], [c, 0], [c, size]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="currentColor" />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function WireMesh({ side = "left", compact = false }: { side?: "left" | "right"; compact?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={`${m.mesh} ${side === "left" ? m.left : m.right} ${compact ? m.compact : ""}`} aria-hidden="true">
      <div className={m.fade}>
        <div className={m.base}><Lattice id={`wm${uid}a`} size={28} /></div>
        <div className={m.glint}><Lattice id={`wm${uid}b`} size={28} /></div>
      </div>
    </div>
  );
}

/** Thin horizontal strip of the same wire mesh, used as a section divider. */
export function MeshDivider() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div className={m.divider} aria-hidden="true">
      <Lattice id={`wd${uid}`} size={14} />
    </div>
  );
}
