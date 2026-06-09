"use client";

import { PortableText } from "@portabletext/react";

const ptComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-textColor text-base sm:text-lg leading-relaxed mb-4 last:mb-0">
        {children}
      </p>
    ),
    h3: ({ children }) => (
      <h3 className="text-foreground text-xl sm:text-2xl font-semibold mt-6 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
};

// layout: "full" | "centered" | "twoCol"
export default function TextSection({ block }) {
  const { eyebrow, heading, body, layout = "full" } = block;

  if (layout === "centered") {
    return (
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          {eyebrow && (
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-4">
              {eyebrow}
            </p>
          )}
          {heading && (
            <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug mb-6">
              {heading}
            </h2>
          )}
          {body?.length > 0 && <PortableText value={body} components={ptComponents} />}
        </div>
      </section>
    );
  }

  if (layout === "twoCol") {
    return (
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
          <div>
            {eyebrow && (
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-4">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
                {heading}
              </h2>
            )}
          </div>
          <div>{body?.length > 0 && <PortableText value={body} components={ptComponents} />}</div>
        </div>
      </section>
    );
  }

  // full (default)
  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-28">
      <div className="max-w-3xl">
        {eyebrow && (
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-4">
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug mb-6">
            {heading}
          </h2>
        )}
        {body?.length > 0 && <PortableText value={body} components={ptComponents} />}
      </div>
    </section>
  );
}
