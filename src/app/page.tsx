import type { Metadata } from "next";
import SiteNav from "@/components/shared/SiteNav/SiteNav";
import Hero from "@/components/HomePage/Hero/Hero";
import AboutSection from "@/components/HomePage/AboutSection/AboutSection";
import WhySection from "@/components/HomePage/WhySection/WhySection";
import ServicesSection from "@/components/HomePage/ServicesSection/ServicesSection";
import HowItWorks from "@/components/HomePage/HowItWorks/HowItWorks";
import FleetSection from "@/components/HomePage/FleetSection/FleetSection";
import AirportsSection from "@/components/HomePage/AirportsSection/AirportsSection";
import VideoSection from "@/components/HomePage/VideoSection/VideoSection";
import ServiceAreasSection from "@/components/HomePage/ServiceAreasSection/ServiceAreasSection";
import AirportMapSection from "@/components/HomePage/AirportMap/AirportMapSection";
import ReviewsSection from "@/components/HomePage/ReviewsSection/ReviewsSection";
import FaqSection from "@/components/HomePage/FaqSection/FaqSection";
import ClosingCta from "@/components/HomePage/ClosingCta/ClosingCta";
import AboutBeliefs from "@/components/AboutPage/AboutBeliefs/AboutBeliefs";
import AirportsServed from "@/components/AirportsPage/AirportsServed/AirportsServed";

// The title and description are the layout's: the operator's name, and
// the market's city and hero line.
export const metadata: Metadata = {};

export default function Page() {
  return (
    <>
      <SiteNav variant='overlay' heroId='hero' />
      <main>
        <Hero />
        <AboutSection />
        <WhySection />
        <ServicesSection />
        <AboutBeliefs />
        <AirportsServed />
        <HowItWorks />
        <FleetSection />
        <AirportsSection />
        <VideoSection />
        <AirportMapSection />
        <ServiceAreasSection />
        <ReviewsSection />
        <FaqSection />
        <ClosingCta />
      </main>
    </>
  );
}
