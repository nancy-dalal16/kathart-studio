import Image from "next/image";

const ratioClasses = {
  "50/50": ["flex-1", "flex-1"],
  "60/40": ["flex-[3]", "flex-[2]"],
  "40/60": ["flex-[2]", "flex-[3]"],
};

// ratio: "50/50" | "60/40" | "40/60"
export default function GallerySplit({ block }) {
  const { leftImage, rightImage, caption, ratio = "50/50" } = block;
  if (!leftImage && !rightImage) return null;

  const [leftClass, rightClass] = ratioClasses[ratio] ?? ["flex-1", "flex-1"];

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-4">
      <figure>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {leftImage && (
            <div className={`${leftClass} relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden`}>
              <Image
                src={leftImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 55vw"
              />
            </div>
          )}
          {rightImage && (
            <div className={`${rightClass} relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden`}>
              <Image
                src={rightImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 45vw"
              />
            </div>
          )}
        </div>
        {caption && (
          <figcaption className="mt-3 text-textColor text-xs sm:text-sm text-center leading-relaxed">
            {caption}
          </figcaption>
        )}
      </figure>
    </section>
  );
}
