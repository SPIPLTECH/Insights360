import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import ScoringBreakdown from "@/components/ScoringBreakdown";

export const metadata: Metadata = {
  title: "Scoring Breakdown — Vidarbha East Race to Recognition",
  description: "How the points of all four Indices are calculated: Business Growth, Ecosystem Participation, Learning Excellence and Professional Excellence.",
};

export default function ScoringBreakdownPage() {
  return (
    <SiteShell>
      <ScoringBreakdown />
    </SiteShell>
  );
}
