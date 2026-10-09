"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Bi, Lang } from "@/lib/content";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; L: (b: Bi) => string };

const LangContext = createContext<Ctx>({
  lang: "mr",
  setLang: () => {},
  L: (b) => b.mr,
});

const KEY = "r2r-lang";

/** Wraps ONLY the public site (Home, Announcements). Dashboard / Index pages never mount this. */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("mr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "mr" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(() => ({ lang, setLang, L: (b) => b[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
