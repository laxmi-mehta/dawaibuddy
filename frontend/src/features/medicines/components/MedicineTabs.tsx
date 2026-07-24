import { AlertTriangle, CheckCircle2, Heart, ShieldQuestion } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import type { Medicine } from "@/types";

function CheckList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="py-4 text-body text-muted">{emptyText}</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.9} />
          <span className="text-body text-ink-2">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MedicineTabs({ medicine }: { medicine: Medicine }) {
  const { t } = useTranslation();
  return (
    <Card className="p-6">
      <Tabs
        defaultId="uses"
        items={[
          {
            id: "uses",
            label: t("medicines.usesTab"),
            icon: Heart,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">{t("medicines.usesHeading")}</h3>
                <CheckList items={medicine.uses} emptyText={t("medicines.noUses")} />
              </>
            ),
          },
          {
            id: "side-effects",
            label: t("medicines.sideEffectsTab"),
            icon: AlertTriangle,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">
                  {t("medicines.sideEffectsHeading")}
                </h3>
                <CheckList items={medicine.side_effects} emptyText={t("medicines.noSideEffects")} />
              </>
            ),
          },
          {
            id: "warnings",
            label: t("medicines.warningsTab"),
            icon: ShieldQuestion,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">
                  {t("medicines.warningsHeading")}
                </h3>
                <CheckList items={medicine.warnings} emptyText={t("medicines.noWarnings")} />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
}
