"use client";

import Link from "next/link";
import { Trophy } from "lucide-react";
import { useLang } from "./LanguageProvider";
import f from "./Footer.module.css";

export default function Footer() {
  const { L } = useLang();
  return (
    <footer className={f.footer}>
      <div className={f.top}>
        <div className={f.brand}>
          <span className={f.mark}><Trophy size={18} /></span>
          <div>
            <p className={f.title}>Race to Recognition</p>
            <p className={f.sub}>MKCL Vidarbha East · 2026–27</p>
          </div>
        </div>

        <div className={f.col}>
          <span className={f.head}>{L({ mr: "एक्सप्लोर", en: "Explore" })}</span>
          <Link href="/#framework">Framework</Link>
          <Link href="/#levels">Recognition Levels</Link>
          <Link href="/#four-index">Four Index</Link>
          <Link href="/announcements">Announcements</Link>
        </div>

        <div className={f.col}>
          <span className={f.head}>{L({ mr: "कामगिरी पहा", en: "Track Performance" })}</span>
          <Link href="/dashboard">Leaderboard</Link>
          <Link href="/index-1">Business Growth</Link>
          <Link href="/index-2">Ecosystem Participation</Link>
          <Link href="/index-3">Learning Excellence</Link>
          <Link href="/index-4">Professional Excellence</Link>
        </div>

        <div className={f.col}>
          <span className={f.head}>{L({ mr: "महत्त्वाच्या तारखा", en: "Key Dates" })}</span>
          <p>{L({ mr: "गणल्या जाणाऱ्या Admissions", en: "Admissions counted" })}</p>
          <p className={f.strong}>1 Jan – 30 Nov 2026</p>
          <p>{L({ mr: "Contest ची अंतिम तारीख", en: "Contest last date" })}</p>
          <p className={f.strong}>30 November 2026</p>
        </div>
      </div>

      <div className={f.tags}>
        <span>Together Towards Excellence.</span>
        <span>Together Towards Growth.</span>
      </div>
      <p className={f.bottom}>© 2026 MKCL · Vidarbha East Race to Recognition. All rights reserved.</p>
    </footer>
  );
}
