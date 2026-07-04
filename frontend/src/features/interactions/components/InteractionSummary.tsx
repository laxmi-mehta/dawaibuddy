import { AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";

interface InteractionSummaryProps {
  total: number;
  moderate: number;
  mild: number;
  severe: number;
  medicineCount: number;
}

export function InteractionSummary({ total, moderate, mild, severe, medicineCount }: InteractionSummaryProps) {
  const clean = total === 0;
  const worst = severe ? "Severe" : moderate ? "Moderate" : mild ? "Mild" : null;

  return (
    <Card className={clean ? "border-l-4 border-l-success p-5" : "border-l-4 border-l-warning p-5"}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <IconBadge icon={clean ? CheckCircle2 : AlertTriangle} tone={clean ? "success" : "warning"} size="lg" />
          <div>
            <p className="text-h3 font-extrabold text-ink">
              {clean ? "No known interactions" : `${worst} interactions found`}
            </p>
            <p className="text-small text-muted">
              Checked {total} pair{total === 1 ? "" : "s"} across {medicineCount} medicines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {severe > 0 && <Badge variant="danger" size="sm">{severe} severe</Badge>}
          {moderate > 0 && <Badge variant="warning" size="sm">{moderate} moderate</Badge>}
          {mild > 0 && <Badge variant="success" size="sm">{mild} mild</Badge>}
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" strokeWidth={2} /> Report
          </Button>
        </div>
      </div>
    </Card>
  );
}
