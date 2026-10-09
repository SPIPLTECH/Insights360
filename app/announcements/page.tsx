import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import AnnouncementsView from "@/components/AnnouncementsView";

export const metadata: Metadata = {
  title: "Announcements — Vidarbha East Race to Recognition",
  description: "Latest updates, deadlines and recognition announcements for Race to Recognition 2026-27.",
};

export default function AnnouncementsPage() {
  return (
    <SiteShell>
      <AnnouncementsView />
    </SiteShell>
  );
}
