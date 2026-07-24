import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

/** Thin trust-stat strip between the hero and features. */
export function StatsBar() {
  const { t } = useTranslation();
  const STATS = [
    t("landing.stats.stat1"),
    t("landing.stats.stat2"),
    t("landing.stats.stat3"),
    t("landing.stats.stat4"),
  ];
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
