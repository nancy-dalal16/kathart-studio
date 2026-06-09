import Image from "next/image";

// columns: 2 | 3
export default function GalleryGrid({ block }) {
  const { images = [], columns = 2, caption } = block;
  if (!images.length) return null;

  const colClass = columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-4">
      <figure>
        <div className={`grid ${colClass} gap-3 sm:gap-4`}>
          {images.map((item, i) => (
            <div key={i} className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-secondary">
              {item.url && (
                <Image
                  src={item.url}
                  alt={item.caption || ""}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={`(max-width: 640px) 100vw, ${columns === 3 ? "33vw" : "50vw"}`}
                />
              )}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs leading-snug">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
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
