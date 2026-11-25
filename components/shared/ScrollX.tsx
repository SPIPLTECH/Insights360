"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Horizontal scroller with a small control bar ABOVE the table (never on top of it):
 *   ◀  ▮▮▮▮▯▯▯▯  ▶    — arrows + a progress track that also shows how far you've scrolled.
 * - The bar shows only on phones / tablets (hidden from md / 768px up) and only when the content really overflows.
 * - `className` / `style` go to the scrolling element itself (keeps sticky headers working).
 */
export default function ScrollX({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const [st, setSt] = useState({ overflow: false, left: false, right: false, ratio: 0, thumb: 1 });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setSt({
      overflow: max > 8,
      left: el.scrollLeft > 4,
      right: el.scrollLeft < max - 4,
      ratio: max > 0 ? el.scrollLeft / max : 0,
      thumb: el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    window.addEventListener("resize", update);
    const t = window.setTimeout(update, 400); // after fonts / data settle
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.clearTimeout(t);
    };
  }, [update]);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(140, Math.round(el.clientWidth * 0.6));
    const target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + dir * step));
    try {
      el.scrollTo({ left: target, behavior: "smooth" });
    } catch {
      el.scrollLeft = target;
    }
  };

  const btn = (enabled: boolean): CSSProperties => ({
    flex: "none",
    width: 42,
    height: 36,
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontSize: 22,
    fontWeight: 700,
    lineHeight: 1,
    cursor: enabled ? "pointer" : "default",
    opacity: enabled ? 1 : 0.35,
    background: "linear-gradient(135deg,#f5762e,#ec1e63)",
    touchAction: "manipulation",
  });

  return (
    <div>
      {phone && st.overflow && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 2px" }}>
          <button type="button" aria-label="Scroll left" disabled={!st.left} onClick={() => go(-1)} style={btn(st.left)}>
            ‹
          </button>
          <div style={{ flex: 1, height: 6, borderRadius: 6, background: "#ffe3cc", position: "relative", overflow: "hidden" }} aria-hidden>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: `${st.thumb * 100}%`,
                left: `${st.ratio * (1 - st.thumb) * 100}%`,
                borderRadius: 6,
                background: "linear-gradient(90deg,#f5762e,#ec1e63)",
              }}
            />
          </div>
          <button type="button" aria-label="Scroll right" disabled={!st.right} onClick={() => go(1)} style={btn(st.right)}>
            ›
          </button>
        </div>
      )}
      <div ref={ref} onScroll={update} className={className} style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain", ...style }}>
        {children}
      </div>
    </div>
  );
}