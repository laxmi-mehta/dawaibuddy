import { Building2, Clock, Info, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";

export function MedicineHeaderCard() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <IconBadge icon={Pill} tone="brand" size="lg" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-h2 font-extrabold text-ink">Glycomet 500 SR</h2>
            <Badge variant="danger" size="sm">
              Rx only
            </Badge>
          </div>
          <p className="mt-1 text-body text-muted">Metformin · 500 mg · Tablet (SR)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="brand" size="sm">
              Anti-diabetic
            </Badge>
            <Badge variant="default" size="sm">
              <Clock className="h-3.5 w-3.5" /> After food
            </Badge>
            <Badge variant="default" size="sm">
              <Building2 className="h-3.5 w-3.5" /> USV Pvt Ltd
            </Badge>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-md bg-brand-50 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
        <p className="text-small text-ink-2">
          <span className="font-bold text-ink">How it works:</span> Lowers glucose production in the
          liver and helps your body respond to insulin more effectively.
        </p>
      </div>
    </Card>
  );
}
