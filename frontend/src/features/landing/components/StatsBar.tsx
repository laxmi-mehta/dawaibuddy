import { CheckCircle2 } from "lucide-react";

const STATS = [
  "50,000+ users",
  "1.2M medicines indexed",
  "4.8 ★ on Play Store",
  "100% data encrypted",
];

/** Thin trust-stat strip between the hero and features. */
export function StatsBar() {
  return (
    <section className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STATS.map((stat) => (
          <div
            key={stat}
            className="flex items-center justify-center gap-2 text-small font-semibold text-ink-2"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" strokeWidth={2} />
            {stat}
          </div>
        ))}
      </div>
    </section>
  );
}
