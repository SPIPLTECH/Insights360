"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Framework", href: "/#framework" },
  { label: "Levels", href: "/#levels" },
  { label: "Announcements", href: "/#announcements" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>

          <span className="brand-text">
            Vidarbha East <em>— Race to Recognition</em>
          </span>
        </Link>

        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/dashboard" className="nav-cta">
          Check Your Score
        </Link>

        <button
          className={`nav-burger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="nav-cta nav-cta--mobile"
            onClick={() => setOpen(false)}
          >
            Check Your Score
          </Link>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 61, 110, 0.18);
        }
        .navbar-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-right: auto;
          min-width: 0;
        }
        .brand-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff7a2e, #ff3d6e);
          color: #fff;
          font-family: "JetBrains Mono", monospace;
          font-weight: 700;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-text {
          font-family: "Fraunces", serif;
          font-weight: 600;
          font-size: 17px;
          color: #1a1310;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .brand-text em {
          font-style: normal;
          background: linear-gradient(90deg, #ff7a2e, #ff3d6e);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          gap: 26px;
          flex-shrink: 0;
        }
        .nav-links a {
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 500;
          color: #4a3f38;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .nav-links a:hover {
          color: #ff3d6e;
        }
        .nav-cta {
          text-decoration: none;
          background: #ff7a2e;
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          padding: 11px 22px;
          border-radius: 100px;
          white-space: nowrap;
          flex-shrink: 0;
          box-shadow: 0 6px 16px rgba(255, 122, 46, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .nav-cta:hover {
          background: #ff8f4d;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255, 122, 46, 0.45);
        }
        .nav-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          flex-shrink: 0;
        }
        .nav-burger span {
          width: 22px;
          height: 2px;
          background: #1a1310;
          border-radius: 2px;
          transition: all 0.2s ease;
          transform-origin: center;
        }
        .nav-burger.is-open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .nav-burger.is-open span:nth-child(2) {
          opacity: 0;
        }
        .nav-burger.is-open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
        .nav-mobile {
          display: none;
        }

        @media (max-width: 860px) {
          .navbar-inner {
            gap: 16px;
          }
          .brand-text {
            font-size: 15px;
          }
          .nav-links,
          .nav-cta {
            display: none;
          }
          .nav-burger {
            display: flex;
          }
          .nav-mobile {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 10px 24px 20px;
            border-top: 1px solid rgba(255, 61, 110, 0.18);
          }
          .nav-mobile a {
            text-decoration: none;
            padding: 12px 0;
            font-size: 15px;
            color: #1a1310;
            border-bottom: 1px solid rgba(255, 61, 110, 0.1);
          }
          .nav-cta--mobile {
            margin-top: 10px;
            text-align: center;
            border-bottom: none !important;
            background: #ff7a2e !important;
            color: #ffffff !important;
            border-radius: 100px;
            padding: 12px 0;
            font-weight: 700;
            box-shadow: 0 6px 16px rgba(255, 122, 46, 0.35);
          }
        }

        @media (max-width: 480px) {
          .brand-text {
            max-width: 160px;
          }
        }
      `}</style>
    </header>
  );
}