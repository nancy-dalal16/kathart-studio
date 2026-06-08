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
      <div className="snap-section relative z-[1]">
        <WhatWeDoPhilosophy />
      </div>
      <div className="snap-section relative z-[2]">
        <OurWork />
      </div>
      <div className="snap-section relative z-[3]">
        <OurClients />
      </div>
      <div className="snap-section relative z-[4]">
        <SuccessStories />
      </div>
      <div className="snap-section relative z-[5]">
        <CTA />
      </div>
    </>
  );
}
