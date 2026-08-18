"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Globe2, GraduationCap, Award } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Home Dashboard", sub: "Overall Ranking", icon: Home },
  { href: "/index-1", label: "Business Growth", sub: "Index 1 · 350 pts", icon: BarChart3 },
  { href: "/index-2", label: "Ecosystem", sub: "Index 2 · 200 pts", icon: Globe2 },
  { href: "/index-3", label: "Learning Excellence", sub: "Index 3 · 200 pts", icon: GraduationCap },
  { href: "/index-4", label: "Professional Excellence", sub: "Index 4 · 100 pts", icon: Award },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="max-w-7xl mx-auto grid grid-cols-5">
        {items.map(({ href, label, sub, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 py-2 px-1 text-center transition-colors",
                active ? "text-brand-pink bg-brand-50" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium leading-tight">{label}</span>
              <span className="text-[10px] text-slate-400 leading-tight hidden md:block">{sub}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
