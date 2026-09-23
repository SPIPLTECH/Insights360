"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
     
          <div>
            <p className="footer-title">Race to Recognition</p>
            <p className="footer-sub">MKCL Vidarbha East &middot; 2026&ndash;27</p>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Explore</span>
          <Link href="/#framework">Framework</Link>
          <Link href="/#levels">Recognition Levels</Link>
          <Link href="/#journey">Our Journey</Link>
          <Link href="/#announcements">Announcements</Link>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Track Performance</span>
          <Link href="/dashboard">Leaderboard</Link>
          <Link href="/index1">Business Growth</Link>
          <Link href="/index2">Ecosystem Participation</Link>
          <Link href="/index3">Learning Excellence</Link>
          <Link href="/index4">Professional Excellence</Link>
        </div>

        <div className="footer-col">
          <span className="footer-heading">Key Dates</span>
          <p className="footer-text">Admissions counted</p>
          <p className="footer-text footer-text--strong">1 Jan &ndash; 30 Nov 2026</p>
          <p className="footer-text">Contest last date</p>
          <p className="footer-text footer-text--strong">30 November 2026</p>
        </div>
      </div>

      <div className="footer-tags">
        <span>Together Towards Excellence.</span>
        <span>Together Towards Growth.</span>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 MKCL &middot; Vidarbha East Race to Recognition. All rights reserved.</p>
      </div>

      <style jsx>{`
        .footer {
          background: #1a1310;
          color: #fff4ec;
          padding: 64px 24px 28px;
        }
        .footer-top {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 122, 46, 0.22);
        }
        .footer-brand {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .brand-mark {
          width: 38px;
          height: 38px;
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
        .footer-title {
          font-family: "Fraunces", serif;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px;
          color: #fff;
        }
        .footer-sub {
          font-size: 13px;
          color: #b8ab9f;
          margin: 0;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .footer-heading {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #ff7a2e;
          margin-bottom: 4px;
        }
        .footer-col :global(a) {
          text-decoration: none;
          color: #d9d3cc;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .footer-col :global(a:hover) {
          color: #ff3d6e;
        }
        .footer-text {
          font-size: 13px;
          color: #b8ab9f;
          margin: 0;
        }
        .footer-text--strong {
          color: #fff4ec;
          font-weight: 500;
          margin-bottom: 6px;
        }
        .footer-tags {
          max-width: 1240px;
          margin: 28px auto 0;
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .footer-tags span {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 8px 16px;
          border: 1px solid rgba(255, 122, 46, 0.4);
          border-radius: 100px;
          color: #ff7a2e;
        }
        .footer-bottom {
          max-width: 1240px;
          margin: 32px auto 0;
          text-align: center;
        }
        .footer-bottom p {
          font-size: 12.5px;
          color: #8a7a70;
          margin: 0;
        }

        @media (max-width: 860px) {
          .footer-top {
            grid-template-columns: 1fr 1fr;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  );
}