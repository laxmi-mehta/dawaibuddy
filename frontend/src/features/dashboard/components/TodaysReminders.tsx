import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/IconBadge";
import type { Reminder, ReminderBucketValue } from "@/types";

const BUCKET_ICON: Record<ReminderBucketValue, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
};

interface TodaysRemindersProps {
  reminders: Reminder[];
  onTake: (id: string) => void;
  takingId: string | null;
}

export function TodaysReminders({ reminders, onTake, takingId }: TodaysRemindersProps) {
  const { t } = useTranslation();
  const taken = reminders.filter((r) => r.is_taken).length;
  const total = reminders.length;
  const pct = total ? Math.round((taken / total) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">{t("dashboard.todaysReminders")}</h2>
        <Link
          to="/reminders"
          className="flex items-center gap-1.5 text-small font-semibold text-brand hover:underline"
        >
          <Calendar className="h-4 w-4" /> {t("dashboard.calendar")}
        </Link>
      </div>

      {/* Daily progress */}
      <div className="mt-4 rounded-md bg-bg p-4">
        <div className="flex items-center justify-between text-small">
          <span className="font-bold text-ink">{t("dashboard.dailyProgress")}</span>
          <span className="text-muted">{t("dashboard.takenOfTotal", { taken, total })}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {total === 0 ? (
        <p className="mt-4 text-small text-muted">{t("dashboard.noRemindersSetUp")}</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {reminders.map((r) => (
            <li key={r.id} className="flex items-center gap-4 py-4">
              <IconBadge icon={BUCKET_ICON[r.bucket]} tone="warning" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{r.medicine_name}</p>
                <p className="text-small text-muted">
                  {r.scheduled_time.slice(0, 5)}
                  {r.instruction ? ` · ${r.instruction}` : ""}
                </p>
              </div>
              {r.is_taken ? (
                <span className="flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1.5 text-small font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4" /> {t("dashboard.taken")}
                </span>
              ) : (
                <button
                  type="button"
                  disabled={takingId === r.id}
                  onClick={() => onTake(r.id)}
                  className="rounded-full bg-brand-100 px-5 py-1.5 text-small font-semibold text-brand-700 transition-colors hover:bg-brand-200 disabled:opacity-50"
                >
                  {takingId === r.id ? t("dashboard.marking") : t("dashboard.take")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
