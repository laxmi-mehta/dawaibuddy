import { AlertTriangle, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";

export function InteractionSummary() {
  return (
    <Card className="border-l-4 border-l-warning p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <IconBadge icon={AlertTriangle} tone="warning" size="lg" />
          <div>
            <p className="text-h3 font-extrabold text-ink">Moderate interactions found</p>
            <p className="text-small text-muted">Checked 3 medicine pairs across 3 medicines</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="sm">2 moderate</Badge>
          <Badge variant="success" size="sm">1 mild</Badge>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" strokeWidth={2} /> Report
          </Button>
        </div>
      </div>
    </Card>
  );
}
