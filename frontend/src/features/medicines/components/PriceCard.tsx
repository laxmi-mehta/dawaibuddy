import { useNavigate } from "react-router-dom";
import { Bell, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Medicine } from "@/types";

export function PriceCard({ medicine }: { medicine: Medicine }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function setReminder() {
    navigate("/reminders", {
      state: { prefillReminder: { medicine_name: medicine.name, dosage: medicine.strength } },
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-small text-muted">{t("medicines.price")}</p>
        <Badge variant={medicine.in_stock ? "success" : "danger"} size="sm">
          {medicine.in_stock ? t("medicines.inStock") : t("medicines.outOfStock")}
        </Badge>
      </div>
      <p className="mt-2">
        <span className="text-h1 font-extrabold text-ink">
          {medicine.price ? `₹${medicine.price}` : "—"}
        </span>
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={setReminder}>
          <Bell className="h-5 w-5" strokeWidth={2} /> {t("medicines.setReminder")}
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate("/reminders")}>
          <Calendar className="h-5 w-5" strokeWidth={2} /> {t("medicines.viewReminders")}
        </Button>
      </div>
    </Card>
  );
}
