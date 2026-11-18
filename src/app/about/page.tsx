import type { Metadata } from "next";
import { SITE } from "@/config/site";
import SiteNav from "@/components/shared/SiteNav/SiteNav";
import AboutHero from "@/components/AboutPage/AboutHero/AboutHero";
import AboutMission from "@/components/AboutPage/AboutMission/AboutMission";
import AboutBeliefs from "@/components/AboutPage/AboutBeliefs/AboutBeliefs";
import AboutLicensed from "@/components/AboutPage/AboutLicensed/AboutLicensed";
import VideoSection from "@/components/HomePage/VideoSection/VideoSection";
import ReviewsSection from "@/components/HomePage/ReviewsSection/ReviewsSection";
import ClosingCta from "@/components/HomePage/ClosingCta/ClosingCta";
import FaqSection from "@/components/HomePage/FaqSection/FaqSection";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}: who we are, our chauffeurs, our fleet, and our standards.`,
};

// A demo's About page says only what's true of any licensed operator: no
// founding year, founder story or team, since those would be invented.
// The prospect's own story goes in once they're a client.

export default function Page() {
  return (
    <>
      {/* The white bar from the start: no hero to sit over on this page. */}
      <SiteNav variant='solid' />
      <main>
        <AboutHero />
        <AboutMission />
        <AboutBeliefs />
        <AboutLicensed />
        <VideoSection />
        <ReviewsSection />
        <FaqSection />
        <ClosingCta />
      </main>
    </>
  );
}
