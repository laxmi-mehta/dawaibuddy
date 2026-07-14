import { useNavigate } from "react-router-dom";
import { Bell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Medicine } from "@/types";

export function PriceCard({ medicine }: { medicine: Medicine }) {
  const navigate = useNavigate();

  function setReminder() {
    navigate("/reminders", {
      state: { prefillReminder: { medicine_name: medicine.name, dosage: medicine.strength } },
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="text-small text-muted">Price</p>
        <Badge variant={medicine.in_stock ? "success" : "danger"} size="sm">
          {medicine.in_stock ? "In stock" : "Out of stock"}
        </Badge>
      </div>
      <p className="mt-2">
        <span className="text-h1 font-extrabold text-ink">
          {medicine.price ? `₹${medicine.price}` : "—"}
        </span>
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={setReminder}>
          <Bell className="h-5 w-5" strokeWidth={2} /> Set a reminder
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={() => navigate("/reminders")}>
          <Calendar className="h-5 w-5" strokeWidth={2} /> View my reminders
        </Button>
      </div>
    </Card>
  );
}
