import { CheckCircle2, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { Bucket } from "./data";

export function ReminderBucket({ bucket }: { bucket: Bucket }) {
  const taken = bucket.doses.filter((d) => d.taken).length;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconBadge icon={bucket.icon} tone={bucket.tone} />
          <div>
            <p className="font-extrabold text-ink">{bucket.label}</p>
            <p className="text-small text-muted">{bucket.range}</p>
          </div>
        </div>
        <Badge variant="default" size="sm">
          {taken} / {bucket.doses.length}
        </Badge>
      </div>

      <ul className="mt-2 divide-y divide-line">
        {bucket.doses.map((d) => (
          <li key={d.name + d.meta} className="flex items-center gap-4 py-3.5">
            <IconBadge icon={Pill} tone={d.tone} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{d.name}</p>
              <p className="text-small text-muted">{d.meta}</p>
            </div>
            {d.taken ? (
              <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-1.5 text-small font-semibold text-brand">
                <CheckCircle2 className="h-4 w-4" /> Taken
              </span>
            ) : (
              <button
                type="button"
                className="rounded-full bg-brand px-5 py-1.5 text-small font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Mark taken
              </button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
