"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Globe2, GraduationCap, Award } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Home Dashboard", sub: "Overall Ranking", icon: Home, iconColor: "text-pink-500", textColor: "text-pink-600" },
  { href: "/index-1", label: "Business Growth", sub: "Index 1 · 350 pts", icon: BarChart3, iconColor: "text-emerald-500", textColor: "text-emerald-600" },
  { href: "/index-2", label: "Ecosystem", sub: "Index 2 · 200 pts", icon: Globe2, iconColor: "text-sky-500", textColor: "text-sky-600" },
  { href: "/index-3", label: "Learning Excellence", sub: "Index 3 · 200 pts", icon: GraduationCap, iconColor: "text-violet-500", textColor: "text-violet-600" },
  { href: "/index-4", label: "Professional Excellence", sub: "Index 4 · 100 pts", icon: Award, iconColor: "text-amber-500", textColor: "text-amber-600" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="max-w-7xl mx-auto grid grid-cols-5">
        {items.map(({ href, label, sub, icon: Icon, iconColor, textColor }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 py-2 px-1 text-center transition-colors",
                active ? "bg-brand-50" : "hover:bg-slate-50"
              )}
            >
              <Icon size={22} className={iconColor} />
              <span className={clsx("text-[12px] font-semibold leading-tight", textColor)}>{label}</span>
              <span className="text-[11px] text-slate-500 leading-tight hidden md:block">{sub}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}