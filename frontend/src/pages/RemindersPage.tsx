import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, List, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn } from "@/lib/utils";
import { ReminderBucket } from "@/features/reminders/components/ReminderBucket";
import { AddReminderForm } from "@/features/reminders/components/AddReminderForm";
import { MonthCalendar } from "@/features/reminders/components/MonthCalendar";
import { remindersService } from "@/services/reminders.service";
import { localeForLanguage } from "@/i18n/dateLocale";
import type { Reminder, ReminderTodayResponse } from "@/types";

export default function RemindersPage() {
  const { t, i18n } = useTranslation();
  const todayLabel = new Date().toLocaleDateString(localeForLanguage(i18n.language), {
    day: "numeric",
    month: "long",
  });
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
      setError(t("reminders.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
        title={t("reminders.title")}
        subtitle={t("reminders.subtitle")}
        actions={
          <Button size="sm" onClick={() => setShowAddForm((v) => !v)}>
            <Plus className="h-4 w-4" strokeWidth={2} /> {t("reminders.addReminder")}
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
              <p className="text-h3 font-extrabold text-ink">
                {t("reminders.todayLabel", { date: todayLabel })}
              </p>
              <p className="text-small text-muted">
                {t("reminders.dosesTaken", { taken: progress.taken, total: progress.total })}
              </p>
            </div>
          </div>

          <div className="flex rounded-lg bg-bg p-1">
            {(
              [
                { id: "list", label: t("reminders.list"), icon: List },
                { id: "calendar", label: t("reminders.calendarView"), icon: CalendarDays },
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
            <p className="text-body text-muted">{t("reminders.loading")}</p>
          ) : !today?.buckets.length ? (
            <Card className="p-10 text-center text-body text-muted">
              {t("reminders.noRemindersYet")}
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
