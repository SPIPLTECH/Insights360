"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";
import { useLang } from "./LanguageProvider";

const LINKS = [
  { en: "Home", mr: "मुख्यपृष्ठ", href: "/" },
  { en: "Framework", mr: "Framework", href: "/#framework" },
  { en: "Levels", mr: "Levels", href: "/#levels" },
  { en: "Announcements", mr: "घोषणा", href: "/announcements" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, t } = useLang();
  return (
    <header className="nav">
      <div className="in">
        <Link href="/" className="brand serif">Race to Recognition</Link>
        <nav className={open ? "links open" : "links"}>
          {LINKS.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{t(l.en, l.mr)}</Link>)}
          <Link href="/dashboard" className="chk" onClick={() => setOpen(false)}><Trophy size={15} /> {t("Check Your Position", "तुमचे स्थान पहा")}</Link>
        </nav>
        <div className="lang" role="tablist" aria-label="Language">
          <button role="tab" aria-selected={lang === "mr"} className={lang === "mr" ? "on" : ""} onClick={() => setLang("mr")}>मराठी</button>
          <button role="tab" aria-selected={lang === "en"} className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>English</button>
        </div>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <style jsx>{`
        .nav{position:sticky;top:0;z-index:50;background:rgba(255,251,247,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
        .in{max-width:1240px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:24px}
        .brand{font-weight:700;font-size:19px;text-decoration:none;margin-right:auto;white-space:nowrap}
        .links{display:flex;align-items:center;gap:24px}
        .links a{text-decoration:none;font-size:14.5px;font-weight:500;color:var(--dim);white-space:nowrap}
        .links a:hover{color:var(--ember)}
        .links a.chk{display:inline-flex;gap:6px;align-items:center;background:var(--ember);color:#fff;padding:10px 18px;border-radius:100px;font-weight:600;box-shadow:0 6px 16px rgba(216,27,84,.3)}
        .links a.chk:hover{color:#fff}
        .lang{display:flex;background:var(--peach2);border-radius:100px;padding:3px}
        .lang button{border:0;background:transparent;padding:6px 14px;border-radius:100px;font:500 13px 'Work Sans','Noto Sans Devanagari',sans-serif;cursor:pointer;color:var(--dim)}
        .lang button.on{background:var(--ink);color:#fff}
        .burger{display:none;background:none;border:0;cursor:pointer;color:var(--ink)}
        @media(max-width:900px){
          .burger{display:block}
          .links{display:none}
          .links.open{display:flex;flex-direction:column;align-items:stretch;position:absolute;top:100%;left:0;right:0;background:var(--paper);padding:14px 24px 20px;border-bottom:1px solid var(--line)}
          .links.open a{padding:10px 0}.links.open a.chk{justify-content:center}
        }
      `}</style>
    </header>
  );
}