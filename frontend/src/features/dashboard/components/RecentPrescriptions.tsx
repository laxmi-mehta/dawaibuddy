import { Link } from "react-router-dom";
import { ChevronRight, Clock, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { localeForLanguage } from "@/i18n/dateLocale";
import type { Prescription } from "@/types";

export function RecentPrescriptions({ prescriptions }: { prescriptions: Prescription[] }) {
  const { t, i18n } = useTranslation();

  function formatDate(value: string | null): string {
    if (!value) return t("dashboard.dateUnknown");
    return new Date(value).toLocaleDateString(localeForLanguage(i18n.language), {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">{t("dashboard.recentPrescriptions")}</h2>
        <Link
          to="/prescriptions"
          className="flex items-center gap-1 text-small font-semibold text-brand hover:underline"
        >
          {t("dashboard.viewAll")} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <p className="mt-4 text-small text-muted">{t("dashboard.noPrescriptionsYet")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {prescriptions.map((rx) => (
            <li key={rx.id} className="flex items-center gap-4 py-4">
              <IconBadge icon={FileText} tone="brand" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">
                  {rx.doctor_name || t("dashboard.unknownDoctor")}
                  {rx.speciality ? ` — ${rx.speciality}` : ""}
                </p>
                <p className="text-small text-muted">
                  {formatDate(rx.prescribed_on)} ·{" "}
                  {t("dashboard.medicineCount", { count: rx.medicines.length })}
                </p>
              </div>
              {rx.status === "ready" ? (
                <Badge variant="success" size="sm">
                  {t("dashboard.ready")}
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  <Clock className="h-3.5 w-3.5" /> {t("dashboard.processing")}
                </Badge>
              )}
              <ChevronRight className="h-5 w-5 text-muted" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
