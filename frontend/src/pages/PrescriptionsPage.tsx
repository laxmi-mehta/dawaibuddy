import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Clock, FileText, Pencil, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";
import { EditPrescriptionForm } from "@/features/prescriptions/components/EditPrescriptionForm";
import { cn } from "@/lib/utils";
import { prescriptionsService } from "@/services/prescriptions.service";
import { localeForLanguage } from "@/i18n/dateLocale";
import type { Prescription } from "@/types";

export default function PrescriptionsPage() {
  const { t, i18n } = useTranslation();

  function formatDate(value: string | null): string {
    if (!value) return t("dashboard.dateUnknown");
    return new Date(value).toLocaleDateString(localeForLanguage(i18n.language), {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function handleSavePrescription(id: string, data: Partial<Prescription>) {
    const updated = await prescriptionsService.update(id, data);
    setPrescriptions((prev) => prev.map((p) => (p.id === id ? updated : p)));
    setEditingId(null);
  }

  useEffect(() => {
    (async () => {
      try {
        const page = await prescriptionsService.list();
        setPrescriptions(page.results ?? []);
        setError(null);
      } catch {
        setError(t("prescriptions.loadError"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppHeader
        title={t("prescriptions.title")}
        subtitle={t("prescriptions.subtitle")}
        actions={
          <Link to="/upload" className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
            <Plus className="h-4 w-4" /> {t("prescriptions.addPrescription")}
          </Link>
        }
      />

      <div className="mx-auto max-w-4xl space-y-5 p-6">
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {loading ? (
          <p className="text-body text-muted">{t("prescriptions.loading")}</p>
        ) : prescriptions.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-16 text-center">
            <FileText className="h-10 w-10 text-brand" strokeWidth={1.6} />
            <p className="text-h3 font-extrabold text-ink">{t("prescriptions.emptyTitle")}</p>
            <p className="max-w-sm text-body text-muted">{t("prescriptions.emptyBody")}</p>
            <Link to="/upload" className={cn(buttonVariants({ variant: "primary" }), "mt-2")}>
              <Plus className="h-4 w-4" /> {t("prescriptions.addPrescription")}
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((rx) => {
              const expanded = expandedId === rx.id;
              return (
                <Card key={rx.id} className="p-0">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : rx.id)}
                    className="flex w-full items-center gap-4 p-5 text-left"
                  >
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
                    {expanded ? (
                      <ChevronDown className="h-5 w-5 text-muted" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted" />
                    )}
                  </button>

                  {expanded && (
                    <div className="border-t border-line px-5 py-4">
                      {editingId === rx.id ? (
                        <EditPrescriptionForm
                          prescription={rx}
                          onSave={(data) => handleSavePrescription(rx.id, data)}
                          onCancel={() => setEditingId(null)}
                        />
                      ) : (
                        <>
                          <div className="mb-3 flex items-center justify-between">
                            {rx.clinic ? (
                              <p className="text-small text-muted">{rx.clinic}</p>
                            ) : (
                              <span />
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setEditingId(rx.id)}>
                              <Pencil className="h-4 w-4" /> {t("common.edit")}
                            </Button>
                          </div>
                          {rx.medicines.length === 0 ? (
                            <p className="text-small text-muted">{t("prescriptions.noMedicinesRecorded")}</p>
                          ) : (
                            <ul className="divide-y divide-line">
                              {rx.medicines.map((m) => (
                                <li
                                  key={m.id}
                                  className="flex items-center justify-between gap-3 py-3"
                                >
                                  <div>
                                    <p className="font-bold text-ink">{m.name}</p>
                                    <p className="text-small text-muted">
                                      {[m.dosage, m.frequency, m.timing, m.duration]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
