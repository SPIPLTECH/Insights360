"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type Lang = "mr" | "en";
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (en: string, mr?: string) => string };
const C = createContext<Ctx>({ lang: "mr", setLang: () => {}, t: (en) => en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("mr");
  // t(english, marathi?) -> Marathi text missing? English is shown.
  const t = (en: string, mr?: string) => (lang === "mr" && mr ? mr : en);
  return <C.Provider value={{ lang, setLang, t }}>{children}</C.Provider>;
}
export const useLang = () => useContext(C);