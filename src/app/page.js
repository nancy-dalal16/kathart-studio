import { CTA } from "@/components/CTA";
import HeroSection from "@/components/HeroSection";
import OurClients from "@/components/OurClients";
import OurWork from "@/components/OurWork";
import SuccessStories from "@/components/SuccessStories";
import WhatWeDo from "@/components/WhatWeDo";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="snap-section">
        <WhatWeDo />
      </div>
      <div className="snap-section">
        <OurWork />
      </div>
      <div className="snap-section">
        <OurClients />
      </div>
      <div className="snap-section">
        <SuccessStories />
      </div>
      <div className="snap-section">
        <CTA />
      </div>
    </>
  );
}
