"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import s from "./site.module.css";

/**
 * Site-wide "timed reveal" on scroll + a thin scroll-progress bar.
 * - Anything with a `data-fx` attribute, plus the children of the grids/lists below, fades up (blur → sharp)
 *   one after another (staggered) the moment it enters the viewport.
 * - Respects prefers-reduced-motion and degrades to "visible" if IntersectionObserver is missing.
 */
const AUTO = [
  '[class*="grid2"] > *', '[class*="grid3"] > *', '[class*="cards"] > *', '[class*="list"] > *',
  '[class*="norms"] > li', '[class*="rules"] > li', '[class*="journey"] > *', '[class*="dates"] > *',
  '[class*="sentence"] > li', '[class*="stairs"] > *', '[class*="culture"] > *', '[class*="preface"] > *',
  '[class*="legend"] > *', '[class*="chips"] > li', '[class*="tags"] > *',
].join(",");

export default function ScrollFX() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      main.querySelectorAll("[data-fx]").forEach((el) => el.setAttribute("data-fx", "in"));
      return;
    }

    const targets = new Set<HTMLElement>();
    main.querySelectorAll<HTMLElement>(`[data-fx], ${AUTO}`).forEach((el) => {
      if (el.closest("[data-fx-skip]")) return;
      targets.add(el);
    });

    // stagger: index among the tagged siblings of the same parent
    const seen = new Map<Element, number>();
    targets.forEach((el) => {
      const p = el.parentElement!;
      const i = seen.get(p) ?? 0;
      seen.set(p, i + 1);
      el.style.setProperty("--fx-d", `${Math.min(i, 8) * 90}ms`);
      if (el.getAttribute("data-fx") !== "in") el.setAttribute("data-fx", "");
    });

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-fx", "in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return <div className={s.progress} aria-hidden="true"><div ref={bar} className={s.progressBar} /></div>;
}
