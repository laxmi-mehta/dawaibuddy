import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { localeForLanguage } from "@/i18n/dateLocale";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { QuickUpload } from "@/features/dashboard/components/QuickUpload";
import { RecentPrescriptions } from "@/features/dashboard/components/RecentPrescriptions";
import { MedicineSearch } from "@/features/dashboard/components/MedicineSearch";
import { AssistantPromo } from "@/features/dashboard/components/AssistantPromo";
import { TodaysReminders } from "@/features/dashboard/components/TodaysReminders";
import { dashboardService } from "@/services/dashboard.service";
import { remindersService } from "@/services/reminders.service";
import { useAuthStore } from "@/store/auth.store";
import type { DashboardStats, Reminder } from "@/types";

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const todayLabel = new Date().toLocaleDateString(localeForLanguage(i18n.language), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [takingId, setTakingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [dashboard, remindersPage] = await Promise.all([
        dashboardService.get(),
        remindersService.list(),
      ]);
      setStats(dashboard);
      setReminders(remindersPage.results ?? []);
      setError(null);
    } catch {
      setError(t("dashboard.loadError"));
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
      const updated = await remindersService.markTaken(id, true);
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setStats(await dashboardService.get());
    } finally {
      setTakingId(null);
    }
  }

  return (
    <>
      <AppHeader
        title={t("dashboard.greeting", {
          name: user?.first_name || t("dashboard.greetingFallbackName"),
        })}
        subtitle={`${todayLabel} · ${t("dashboard.subtitleSuffix")}`}
        searchPlaceholder={t("dashboard.searchPlaceholder")}
        onSearchSubmit={(q) => navigate("/medicines", { state: { search: q } })}
        actions={
          <Link to="/upload" className={cn(buttonVariants({ variant: "primary" }))}>
            <Plus className="h-5 w-5" strokeWidth={2} /> {t("nav.uploadRx")}
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        <StatCards stats={stats} />
        <QuickUpload />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <RecentPrescriptions prescriptions={stats?.recent_prescriptions ?? []} />
            <MedicineSearch />
          </div>
          <div className="space-y-6">
            <AssistantPromo />
            {loading ? (
              <Card className="p-6 text-body text-muted">{t("reminders.loading")}</Card>
            ) : (
              <TodaysReminders reminders={reminders} onTake={handleTake} takingId={takingId} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
