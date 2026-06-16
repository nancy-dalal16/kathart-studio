// Animated GIF block.
// Uploaded GIFs are stored as Sanity *files* (served from cdn.sanity.io/files/**),
// which are not whitelisted for next/image — and next/image would re-encode the
// frames and kill the animation anyway. So we render a plain <img>.

const widthClasses = {
  full: "w-full",
  large: "w-full max-w-[75%]",
  medium: "w-full max-w-[50%]",
  small: "w-full max-w-[33%]",
};

const alignClasses = {
  center: "mx-auto",
  left: "mr-auto",
  right: "ml-auto",
};

// width: "full" | "large" | "medium" | "small"
// alignment: "center" | "left" | "right"  (ignored when width === "full")
export default function GifBlock({ block }) {
  const { gifUrl, caption, width = "full", alignment = "center" } = block;
  if (!gifUrl) return null;

  const widthClass = widthClasses[width] ?? "w-full";
  const alignClass = width === "full" ? "" : alignClasses[alignment] ?? "mx-auto";

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-4">
      <figure className={`${widthClass} ${alignClass}`}>
        <div className="relative w-full rounded-2xl overflow-hidden bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gifUrl}
            alt={caption || ""}
            className="block w-full h-auto"
            loading="lazy"
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
