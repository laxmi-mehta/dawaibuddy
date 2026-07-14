import { CheckCircle2, FileText, HeartPulse, Pill, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { DashboardStats } from "@/types";

interface Stat {
  icon: LucideIcon;
  tone: "brand" | "accent";
  badge?: { label: string; variant: "success" | "accent" };
  value: string;
  label: string;
}

export function StatCards({ stats }: { stats: DashboardStats | null }) {
  const items: Stat[] = [
    {
      icon: Pill,
      tone: "brand",
      value: stats ? String(stats.active_medicines) : "—",
      label: "Active medicines",
    },
    {
      icon: CheckCircle2,
      tone: "accent",
      badge: stats
        ? { label: `${stats.adherence_percent}% adherence`, variant: "success" }
        : undefined,
      value: stats ? `${stats.doses_taken_today}/${stats.doses_total_today}` : "—",
      label: "Doses taken today",
    },
    {
      icon: FileText,
      tone: "brand",
      value: stats ? String(stats.prescriptions_count) : "—",
      label: "Prescriptions",
    },
    {
      icon: HeartPulse,
      tone: "accent",
      badge:
        stats && stats.adherence_percent >= 80
          ? { label: "On track", variant: "success" }
          : undefined,
      value: stats ? `${stats.adherence_percent}%` : "—",
      label: "Adherence",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((s) => (
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
