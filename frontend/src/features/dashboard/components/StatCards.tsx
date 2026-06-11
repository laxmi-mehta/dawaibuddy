import { CheckCircle2, FileText, Leaf, Pill, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";

interface Stat {
  icon: LucideIcon;
  tone: "brand" | "accent";
  badge?: { label: string; variant: "success" | "accent" };
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: Pill, tone: "brand", badge: { label: "On track", variant: "success" }, value: "6", label: "Active medicines" },
  { icon: CheckCircle2, tone: "accent", badge: { label: "92% adherence", variant: "success" }, value: "2/6", label: "Doses taken today" },
  { icon: FileText, tone: "brand", value: "3", label: "Prescriptions" },
  { icon: Leaf, tone: "accent", badge: { label: "this month", variant: "success" }, value: "₹420", label: "Saved with generics" },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((s) => (
        <Card key={s.label} className="p-5">
          <div className="flex items-start justify-between">
            <IconBadge icon={s.icon} tone={s.tone} />
            {s.badge && (
              <Badge variant={s.badge.variant} size="sm">
                <TrendingUp className="h-3.5 w-3.5" />
                {s.badge.label}
              </Badge>
            )}
          </div>
          <p className="mt-4 text-h1 font-extrabold text-ink">{s.value}</p>
          <p className="mt-1 text-small text-muted">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
