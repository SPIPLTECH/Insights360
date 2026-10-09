import SiteShell from "@/components/SiteShell";
import Hero from "@/components/Hero";
import FrameworkBackground from "@/components/FrameworkBackground";
import RecognitionFramework from "@/components/RecognitionFramework";
import FourIndex from "@/components/FourIndex";
import RecognitionLevels from "@/components/RecognitionLevels";
import ExcellenceBonus from "@/components/ExcellenceBonus";
import ContestInfo from "@/components/ContestInfo";
import ClosingSection from "@/components/ClosingSection";

/**
 * Public Home page. Order (top → bottom):
 * Hero (carousel + All-at-a-Glance district table) → Recognition Beyond Numbers (FrameworkBackground)
 * → Framework road → Four Index (+ Index 1-4) → Levels → Bonus / Credits / Special → Timeline & Rules → Closing.
 */
export default function HomePage() {
  return (
    <SiteShell>
      <Hero />
        <FourIndex />
      <FrameworkBackground />
      <RecognitionFramework />
    
      <RecognitionLevels />
      <ExcellenceBonus />
      <ContestInfo />
      <ClosingSection />
    </SiteShell>
  );
}
