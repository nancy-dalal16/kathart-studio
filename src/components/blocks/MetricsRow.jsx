import { Card, CardContent } from "@/components/ui/card";

// eyebrow: optional label, metrics: [{value, label}]
export default function MetricsRow({ block }) {
  const { eyebrow, metrics = [] } = block;
  if (!metrics.length) return null;

  return (
    <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 border-t border-border">
      {eyebrow && (
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-dark-purple mb-8 sm:mb-10">
          {eyebrow}
        </p>
      )}
      <div
        className="grid gap-3 sm:gap-5"
        style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, minmax(0, 1fr))` }}
      >
        {metrics.map((m) => (
          <Card key={m._key ?? m.label} className="bg-seccolor-cta-cards-bg gradient-border">
            <CardContent className="flex flex-col gap-3 px-5 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 text-center items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground">
                {m.value}
              </div>
              <div className="text-textColor text-[10px] sm:text-xs leading-snug">{m.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
