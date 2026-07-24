import { Building2, Info, Pill } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { Medicine } from "@/types";

export function MedicineHeaderCard({ medicine }: { medicine: Medicine }) {
  const { t } = useTranslation();
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <IconBadge icon={Pill} tone="brand" size="lg" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h2 font-extrabold text-ink">{medicine.name}</h2>
            {medicine.rx_required && (
              <Badge variant="danger" size="sm">
                {t("medicines.rxOnly")}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-body text-muted">
            {[medicine.generic_name, medicine.strength, medicine.form].filter(Boolean).join(" · ")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {medicine.category && (
              <Badge variant="brand" size="sm">
                {medicine.category}
              </Badge>
            )}
            {medicine.manufacturer && (
              <Badge variant="default" size="sm">
                <Building2 className="h-3.5 w-3.5" /> {medicine.manufacturer}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {medicine.how_it_works && (
        <div className="mt-5 flex items-start gap-3 rounded-md bg-brand-50 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
          <p className="text-small text-ink-2">
            <span className="font-bold text-ink">{t("medicines.howItWorks")}</span>{" "}
            {medicine.how_it_works}
          </p>
        </div>
      )}
    </Card>
  );
}
