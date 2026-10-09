"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children }: { children: ReactNode }) {
  const r = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const e = r.current;
    if (!e) return;
    const io = new IntersectionObserver(([x]) => { if (x.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(e);
    return () => io.disconnect();
  }, []);
  return <div ref={r} className={`rv${on ? " in" : ""}`}>{children}</div>;
}

export function Sec({ id, tone = "", title, sub, children }: { id?: string; tone?: string; title?: ReactNode; sub?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className={`sec ${tone}`}>
      <div className="wrap">
        {title && <h2>{title}</h2>}
        {sub && <p className="sub">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function Flow({ items }: { items: string[] }) {
  return (
    <Reveal>
      <div className="flow">{items.map((x, i) => <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>{x}</span>)}</div>
    </Reveal>
  );
}

export function Tbl({ head, rows, total }: { head: string[]; rows: ReactNode[][]; total?: ReactNode[] }) {
  return (
    <div className="tw">
      <table className="tbl">
        <thead><tr>{head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}
          {total && <tr className="tot">{total.map((c, j) => <td key={j}>{c}</td>)}</tr>}
        </tbody>
      </table>
    </div>
  );
}