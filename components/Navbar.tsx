"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Target, Trophy, X } from "lucide-react";
import { useLang } from "./LanguageProvider";
import type { Bi } from "@/lib/content";
import n from "./Navbar.module.css";

const LINKS: { label: Bi; href: string; match: (p: string) => boolean }[] = [
  { label: { mr: "मुख्यपृष्ठ", en: "Home" }, href: "/", match: (p) => p === "/" },
  { label: { mr: "फ्रेमवर्क", en: "Framework" }, href: "/#framework", match: () => false },
  { label: { mr: "लेव्हल्स", en: "Levels" }, href: "/#levels", match: () => false },
  { label: { mr: "घोषणा", en: "Announcements" }, href: "/announcements", match: (p) => p.startsWith("/announcements") },
];

export default function Navbar() {
  const { lang, setLang, L } = useLang();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const cta = L({ mr: "तुमचे स्थान तपासा", en: "Check Your Position" });

  return (
    <header className={n.navbar}>
      <div className={n.inner}>
        <Link href="/" className={n.brand} onClick={() => setOpen(false)}>
          <span className={n.mark}>
            <Trophy size={18} />
          </span>
          <span className={n.brandText}>Race to Recognition</span>
        </Link>

        <nav className={n.links} aria-label="Primary">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={l.match(pathname) ? n.active : ""}>
              {L(l.label)}
            </Link>
          ))}
        </nav>

        <Link href="/dashboard" className={n.cta}>
          <Target size={15} /> {cta}
        </Link>

        <div className={n.lang} role="group" aria-label="Language">
          <button className={lang === "mr" ? n.on : ""} onClick={() => setLang("mr")}>
            मराठी
          </button>
          <button className={lang === "en" ? n.on : ""} onClick={() => setLang("en")}>
            English
          </button>
        </div>

        <button className={n.burger} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className={n.mobile}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {L(l.label)}
            </Link>
          ))}
          <Link href="/dashboard" className={n.ctaMobile} onClick={() => setOpen(false)}>
            {cta}
          </Link>
        </div>
      )}
    </header>
  );
}
