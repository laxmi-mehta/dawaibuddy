import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pill, Search, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { MedicineHeaderCard } from "@/features/medicines/components/MedicineHeaderCard";
import { MedicineTabs } from "@/features/medicines/components/MedicineTabs";
import { PriceCard } from "@/features/medicines/components/PriceCard";
import { GenericAlternatives } from "@/features/medicines/components/GenericAlternatives";
import { medicinesService } from "@/services/medicines.service";
import type { Medicine } from "@/types";

function MedicinesListView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearch = (location.state as { search?: string } | null)?.search ?? "";
  const [query, setQuery] = useState(initialSearch);
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    medicinesService
      .categories()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLoading(true);
    const handle = setTimeout(() => {
      medicinesService
        .list({ search: query || undefined, category: category || undefined })
        .then((page) => {
          setMedicines(page.results ?? []);
          setError(null);
        })
        .catch(() => setError(t("medicines.loadError")))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query, category, t]);

  return (
    <>
      <AppHeader title={t("medicines.title")} subtitle={t("medicines.subtitle")} />
      <div className="mx-auto max-w-6xl space-y-5 p-6">
        <Card className="p-5">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
              strokeWidth={1.9}
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dashboard.searchMedicinesPlaceholder")}
              className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-body text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
            />
          </div>
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip active={category === null} onClick={() => setCategory(null)}>
                {t("medicines.all")}
              </Chip>
              {categories.map((c) => (
                <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          )}
        </Card>

        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {loading ? (
          <p className="text-body text-muted">{t("medicines.loading")}</p>
        ) : medicines.length === 0 ? (
          <Card className="p-10 text-center text-body text-muted">{t("medicines.noMatches")}</Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {medicines.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => navigate(`/medicines/${m.id}`)}
                className="flex items-center gap-3 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <IconBadge icon={Pill} tone="brand" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{m.name}</p>
                  <p className="truncate text-small text-muted">
                    {[m.generic_name, m.strength].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function MedicineDetail({ id }: { id: string }) {
  const { t } = useTranslation();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    medicinesService
      .get(id)
      .then(setMedicine)
      .catch(() => setError(t("medicines.loadDetailError")))
      .finally(() => setLoading(false));
  }, [id, t]);

  return (
    <>
      <AppHeader
        title={t("medicines.detailTitle")}
        subtitle={
          medicine ? `${medicine.generic_name || medicine.name} · ${medicine.category}` : ""
        }
        actions={
          <Link to="/interactions">
            <Button variant="ghost" size="sm">
              <ShieldCheck className="h-4 w-4" strokeWidth={2} /> {t("medicines.checkInteractions")}
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        <Link
          to="/medicines"
          className="mb-5 inline-flex items-center gap-2 text-small font-semibold text-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> {t("medicines.backToMedicines")}
        </Link>

        {error && (
          <Card className="mb-5 border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {loading ? (
          <p className="text-body text-muted">{t("medicines.loadingMedicine")}</p>
        ) : medicine ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <MedicineHeaderCard medicine={medicine} />
              <MedicineTabs medicine={medicine} />
            </div>
            <div className="space-y-6">
              <PriceCard medicine={medicine} />
              <GenericAlternatives medicine={medicine} />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  return id ? <MedicineDetail id={id} /> : <MedicinesListView />;
}
