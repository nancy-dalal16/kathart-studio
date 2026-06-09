import Image from "next/image";

const aspectClasses = {
  "16/9": "aspect-[16/9]",
  cinema: "aspect-[2.39/1]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
};

// aspectRatio: "16/9" | "cinema" | "3/2" | "1/1"
export default function MediaFull({ block }) {
  const { image, caption, aspectRatio = "16/9" } = block;
  if (!image) return null;

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-4">
      <figure>
        <div className={`relative w-full ${aspectClasses[aspectRatio] ?? "aspect-[16/9]"} rounded-2xl overflow-hidden`}>
          <Image
            src={image}
            alt={caption || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
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
