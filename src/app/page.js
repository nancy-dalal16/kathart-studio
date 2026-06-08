import { CTA } from "@/components/CTA";
import HeroSection from "@/components/HeroSection";
import OurClients from "@/components/OurClients";
import OurWork from "@/components/OurWork";
import SuccessStories from "@/components/SuccessStories";
import WhatWeDoPhilosophy from "@/components/WhatWeDoPhilosophy";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="snap-section">
        <WhatWeDoPhilosophy />
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
