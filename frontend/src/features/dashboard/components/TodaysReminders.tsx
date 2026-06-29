import { Calendar, CheckCircle2, Sun, Sunrise } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/IconBadge";

interface Dose {
  icon: LucideIcon;
  name: string;
  meta: string;
  taken: boolean;
}

const DOSES: Dose[] = [
  {
    icon: Sunrise,
    name: "Glycomet 500 SR",
    meta: "08:00 · Morning · after breakfast",
    taken: true,
  },
  { icon: Sunrise, name: "Pan 40", meta: "07:30 · Before breakfast", taken: true },
  { icon: Sunrise, name: "Amlong 5", meta: "09:00 · Morning", taken: false },
  { icon: Sun, name: "Cetzine 10", meta: "14:00 · Afternoon", taken: false },
];

const TAKEN = DOSES.filter((d) => d.taken).length;
const PCT = Math.round((TAKEN / DOSES.length) * 100);

export function TodaysReminders() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Today's reminders</h2>
        <button
          type="button"
          className="flex items-center gap-1.5 text-small font-semibold text-brand hover:underline"
        >
          <Calendar className="h-4 w-4" /> Calendar
        </button>
      </div>

      {/* Daily progress */}
      <div className="mt-4 rounded-md bg-bg p-4">
        <div className="flex items-center justify-between text-small">
          <span className="font-bold text-ink">Daily progress</span>
          <span className="text-muted">
            {TAKEN} of {DOSES.length} taken
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${PCT}%` }} />
        </div>
      </div>

      <ul className="mt-2 divide-y divide-line">
        {DOSES.map((d) => (
          <li key={d.name} className="flex items-center gap-4 py-4">
            <IconBadge icon={d.icon} tone="warning" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{d.name}</p>
              <p className="text-small text-muted">{d.meta}</p>
            </div>
            {d.taken ? (
              <span className="flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1.5 text-small font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" /> Taken
              </span>
            ) : (
              <button
                type="button"
                className="rounded-full bg-brand-100 px-5 py-1.5 text-small font-semibold text-brand-700 transition-colors hover:bg-brand-200"
              >
                Take
              </button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
