import { useState } from "react";
import { CalendarDays, List, Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn } from "@/lib/utils";
import { ReminderBucket } from "@/features/reminders/components/ReminderBucket";
import {
  BUCKETS,
  PROGRESS_PCT,
  TAKEN_DOSES,
  TOTAL_DOSES,
} from "@/features/reminders/components/data";

export default function RemindersPage() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <>
      <AppHeader
        title="Reminders"
        subtitle="Stay on track with every dose"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" strokeWidth={2} /> Add reminder
          </Button>
        }
      />

      <div className="mx-auto max-w-4xl space-y-5 p-6">
        {/* Progress + view toggle */}
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProgressRing value={PROGRESS_PCT} />
            <div>
              <p className="text-h3 font-extrabold text-ink">Today, 6 June</p>
              <p className="text-small text-muted">
                {TAKEN_DOSES} of {TOTAL_DOSES} doses taken · keep it up!
              </p>
            </div>
          </div>

          <div className="flex rounded-lg bg-bg p-1">
            {(
              [
                { id: "list", label: "List", icon: List },
                { id: "calendar", label: "Calendar", icon: CalendarDays },
              ] as const
            ).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-small font-semibold transition-colors",
                  view === id ? "bg-surface text-brand shadow-soft" : "text-muted hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
        </Card>

        {view === "list" ? (
          <div className="space-y-5">
            {BUCKETS.map((b) => (
              <ReminderBucket key={b.label} bucket={b} />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <CalendarDays className="h-10 w-10 text-brand" strokeWidth={1.6} />
            <p className="text-h3 font-extrabold text-ink">Calendar view</p>
            <p className="max-w-sm text-body text-muted">
              A monthly adherence calendar is coming soon.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
