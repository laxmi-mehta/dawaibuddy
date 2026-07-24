import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { localeForLanguage } from "@/i18n/dateLocale";

interface MonthCalendarProps {
  /** Today's adherence percent (0-100), from live reminder data. */
  todayPercent: number;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Month-grid calendar. Only today has real adherence data (backend doesn't
 * store historical daily completion yet), so every other day is shown as an
 * honest empty cell rather than a fabricated number. */
export function MonthCalendar({ todayPercent }: MonthCalendarProps) {
  const { t, i18n } = useTranslation();
  const locale = localeForLanguage(i18n.language);
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Date(2023, 0, i + 1).toLocaleDateString(locale, { weekday: "short" })
  );
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function shiftMonth(delta: number) {
    setCursor(new Date(year, month + delta, 1));
  }

  return (
    <div>
      <div className="flex items-center justify-between px-1 pb-3">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-bg"
          aria-label={t("reminders.previousMonth")}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-bold text-ink">
          {cursor.toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-bg"
          aria-label={t("reminders.nextMonth")}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d, i) => (
          <p key={i} className="py-1 text-tiny font-bold uppercase tracking-wide text-muted">
            {d}
          </p>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />;
          const cellDate = new Date(year, month, day);
          const isToday = isCurrentMonth && isSameDay(cellDate, today);
          return (
            <div
              key={day}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-md text-small",
                isToday ? "bg-brand text-white font-bold" : "bg-bg text-ink-2"
              )}
              title={
                isToday
                  ? t("reminders.todayAdherence", { percent: todayPercent })
                  : t("reminders.noAdherenceData")
              }
            >
              <span>{day}</span>
              {isToday && <span className="text-tiny">{todayPercent}%</span>}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-tiny text-muted">{t("reminders.calendarNote")}</p>
    </div>
  );
}
