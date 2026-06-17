import { CTA } from "@/components/CTA";
import HeroSection from "@/components/HeroSection";
import OurClients from "@/components/OurClients";
import OurWork from "@/components/OurWork";
import SuccessStories from "@/components/SuccessStories";
import WhatWeDoPhilosophy from "@/components/WhatWeDoPhilosophy";
import { getRecentProjects } from "@/sanity/queries";

export const revalidate = 60;

export default async function Home() {
  const recentProjects = await getRecentProjects(3);

  return (
    <>
      <HeroSection />
      <div className="snap-section relative lg:z-[1]">
        <WhatWeDoPhilosophy />
      </div>
      <div className="snap-section relative lg:z-[2]">
        <OurWork projects={recentProjects} />
      </div>
      <div className="snap-section relative lg:z-[3]">
        <OurClients />
      </div>
      <div className="snap-section relative lg:z-[4]">
        <SuccessStories />
      </div>
      <div className="snap-section relative lg:z-[5]">
        <CTA />
      </div>
    </>
  );
}
