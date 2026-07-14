import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, List, Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn } from "@/lib/utils";
import { ReminderBucket } from "@/features/reminders/components/ReminderBucket";
import { AddReminderForm } from "@/features/reminders/components/AddReminderForm";
import { MonthCalendar } from "@/features/reminders/components/MonthCalendar";
import { remindersService } from "@/services/reminders.service";
import type { Reminder, ReminderTodayResponse } from "@/types";

const TODAY_LABEL = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long" });

export default function RemindersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = (location.state as { prefillReminder?: Partial<Reminder> } | null)
    ?.prefillReminder;

  const [view, setView] = useState<"list" | "calendar">("list");
  const [today, setToday] = useState<ReminderTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takingId, setTakingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(Boolean(prefill));

  useEffect(() => {
    if (prefill) {
      navigate(location.pathname, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    try {
      setToday(await remindersService.today());
      setError(null);
    } catch {
      setError("Could not load reminders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleTake(id: string) {
    setTakingId(id);
    try {
      await remindersService.markTaken(id, true);
      await load();
    } finally {
      setTakingId(null);
    }
  }

  async function handleAdd(data: Partial<Reminder>) {
    await remindersService.create(data);
    setShowAddForm(false);
    await load();
  }

  const progress = today?.progress ?? { taken: 0, total: 0, percent: 0 };

  return (
    <>
      <AppHeader
        title="Reminders"
        subtitle="Stay on track with every dose"
        actions={
          <Button size="sm" onClick={() => setShowAddForm((v) => !v)}>
            <Plus className="h-4 w-4" strokeWidth={2} /> Add reminder
          </Button>
        }
      />

      <div className="mx-auto max-w-4xl space-y-5 p-6">
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {showAddForm && (
          <AddReminderForm
            onSubmit={handleAdd}
            onCancel={() => setShowAddForm(false)}
            initial={prefill}
          />
        )}

        {/* Progress + view toggle */}
        <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProgressRing value={progress.percent} />
            <div>
              <p className="text-h3 font-extrabold text-ink">Today, {TODAY_LABEL}</p>
              <p className="text-small text-muted">
                {progress.taken} of {progress.total} doses taken · keep it up!
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
          loading ? (
            <p className="text-body text-muted">Loading reminders…</p>
          ) : !today?.buckets.length ? (
            <Card className="p-10 text-center text-body text-muted">
              No reminders yet — add one to get started.
            </Card>
          ) : (
            <div className="space-y-5">
              {today.buckets.map((b) => (
                <ReminderBucket key={b.bucket} bucket={b} onTake={handleTake} takingId={takingId} />
              ))}
            </div>
          )
        ) : (
          <Card className="p-6">
            <MonthCalendar todayPercent={progress.percent} />
          </Card>
        )}
      </div>
    </>
  );
}
