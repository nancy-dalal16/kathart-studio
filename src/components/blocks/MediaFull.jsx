import Image from "next/image";

const aspectClasses = {
  "16/9": "aspect-[16/9]",
  cinema: "aspect-[2.39/1]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  "2/3": "aspect-[2/3]",
  "9/16": "aspect-[9/16]",
};

// aspectRatio: "original" | "16/9" | "cinema" | "3/2" | "1/1" | "2/3" | "9/16"
// fullBleed: edge-to-edge (no side padding / rounded corners)
export default function MediaFull({ block }) {
  const {
    image,
    imageWidth,
    imageHeight,
    imageAspect,
    caption,
    aspectRatio = "16/9",
    fullBleed = false,
  } = block;
  if (!image) return null;

  const isOriginal = aspectRatio === "original";
  const sectionClass = fullBleed ? "py-4" : "px-4 sm:px-8 md:px-12 lg:px-20 py-4";
  const roundClass = fullBleed ? "" : "rounded-2xl";

  // ── Original: render at the image's true proportions so tall/vertical images
  //    display at full natural height with no cropping. We use an intrinsic-size
  //    <Image> (width/height from asset metadata) scaled to the container width
  //    via `w-full h-auto` — the robust way to get full-height with next/image,
  //    independent of any CSS aspect-ratio quirks. ──
  if (isOriginal) {
    // Derive height from aspect when explicit dimensions are unavailable.
    const w = imageWidth || 1200;
    const h = imageHeight || (imageAspect ? Math.round(w / imageAspect) : 800);
    return (
      <section className={sectionClass}>
        <figure>
          <Image
            src={image}
            alt={caption || ""}
            width={w}
            height={h}
            className={`w-full h-auto block ${roundClass}`}
            sizes={fullBleed ? "100vw" : "(max-width: 768px) 100vw, 90vw"}
          />
          {caption && (
            <figcaption
              className={`mt-3 text-textColor text-xs sm:text-sm text-center leading-relaxed ${
                fullBleed ? "px-4 sm:px-8 md:px-12 lg:px-20" : ""
              }`}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      </section>
    );
  }

  // ── Fixed aspect ratios: crop-to-fit with a fill image. ──
  const containerClass = aspectClasses[aspectRatio] ?? "aspect-[16/9]";

  return (
    <section className={sectionClass}>
      <figure>
        <div className={`relative w-full ${containerClass} ${roundClass} overflow-hidden`}>
          <Image
            src={image}
            alt={caption || ""}
            fill
            className="object-cover"
            sizes={fullBleed ? "100vw" : "(max-width: 768px) 100vw, 90vw"}
          />
        </div>
        {caption && (
          <figcaption
            className={`mt-3 text-textColor text-xs sm:text-sm text-center leading-relaxed ${
              fullBleed ? "px-4 sm:px-8 md:px-12 lg:px-20" : ""
            }`}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
