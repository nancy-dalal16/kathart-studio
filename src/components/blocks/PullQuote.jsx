// quote: string, attribution: optional string
export default function PullQuote({ block }) {
  const { quote, attribution } = block;
  if (!quote) return null;

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 md:py-24">
      <blockquote className="max-w-3xl mx-auto text-center">
        {/* Decorative open-quote mark */}
        <span
          className="block text-[80px] sm:text-[100px] leading-none font-semibold mb-2 select-none"
          style={{ color: "var(--color-border)" }}
          aria-hidden
        >
          "
        </span>
        <p className="text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold italic leading-snug">
          {quote}
        </p>
        {attribution && (
          <footer className="mt-6 text-textColor text-sm sm:text-base">
            — {attribution}
          </footer>
        )}
      </blockquote>
    </section>
  );
}
