"use client";

import { LanguageProvider } from "./LanguageProvider";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollFX from "./ScrollFX";
import s from "./site.module.css";

/**
 * Wrapper for the PUBLIC pages only (Home + Announcements).
 * Every style is a CSS Module (hashed class names) and every CSS variable lives on `.shell`,
 * so nothing here can leak into /dashboard or /index-1 … /index-4.
 */
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className={s.shell}>
        <ScrollFX />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
