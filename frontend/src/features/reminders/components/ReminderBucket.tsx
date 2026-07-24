import { CheckCircle2, Moon, Pill, Sun, Sunrise, Sunset } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { ReminderBucketValue, ReminderTodayBucket } from "@/types";

const BUCKET_ICON: Record<ReminderBucketValue, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon,
};

const BUCKET_TONE: Record<ReminderBucketValue, "warning" | "accent" | "brand"> = {
  morning: "warning",
  afternoon: "warning",
  evening: "accent",
  night: "brand",
};

interface ReminderBucketProps {
  bucket: ReminderTodayBucket;
  onTake: (id: string) => void;
  takingId: string | null;
}

export function ReminderBucket({ bucket, onTake, takingId }: ReminderBucketProps) {
  const { t } = useTranslation();
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBadge icon={BUCKET_ICON[bucket.bucket]} tone={BUCKET_TONE[bucket.bucket]} />
          <div>
            <p className="font-extrabold text-ink">{bucket.label}</p>
          </div>
        </div>
        <Badge variant="default" size="sm">
          {bucket.taken} / {bucket.total}
        </Badge>
      </div>

      <ul className="mt-2 divide-y divide-line">
        {bucket.reminders.map((r) => (
          <li key={r.id} className="flex items-center gap-4 py-3.5">
            <IconBadge icon={Pill} tone="brand" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{r.medicine_name}</p>
              <p className="text-small text-muted">
                {r.dosage ? `${r.dosage} · ` : ""}
                {r.scheduled_time.slice(0, 5)}
                {r.instruction ? ` · ${r.instruction}` : ""}
              </p>
            </div>
            {r.is_taken ? (
              <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-small font-semibold text-brand">
                <CheckCircle2 className="h-4 w-4" /> {t("reminders.taken")}
              </span>
            ) : (
              <button
                type="button"
                disabled={takingId === r.id}
                onClick={() => onTake(r.id)}
                className="rounded-full bg-brand px-5 py-1.5 text-small font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {takingId === r.id ? t("reminders.marking") : t("reminders.markTaken")}
              </button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
