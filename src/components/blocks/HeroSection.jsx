import Image from "next/image";

// layout: "full" | "imageLeft" | "imageRight"
export default function HeroSection({ block }) {
  const { image, headline, tagline, layout = "full" } = block;
  if (!image) return null;

  if (layout === "full") {
    return (
      <section className="w-full relative overflow-hidden aspect-[16/7] sm:aspect-[16/6]">
        <Image src={image} alt={headline || ""} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {(headline || tagline) && (
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-12 lg:px-20 pb-10 sm:pb-14">
            {headline && (
              <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight max-w-3xl">
                {headline}
              </h2>
            )}
            {tagline && (
              <p className="text-white/70 text-base sm:text-lg mt-3 max-w-xl leading-relaxed">
                {tagline}
              </p>
            )}
          </div>
        )}
      </section>
    );
  }

  const imgFirst = layout === "imageLeft";
  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20">
      <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${!imgFirst ? "lg:flex-row-reverse" : ""}`}>
        <div className="w-full lg:w-3/5 relative aspect-[4/3] rounded-2xl overflow-hidden flex-shrink-0">
          <Image src={image} alt={headline || ""} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
        </div>
        <div className="w-full lg:w-2/5">
          {headline && (
            <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
              {headline}
            </h2>
          )}
          {tagline && (
            <p className="text-textColor text-base sm:text-lg leading-relaxed">
              {tagline}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
