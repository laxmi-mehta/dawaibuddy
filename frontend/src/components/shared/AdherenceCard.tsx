import { CheckCircle2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

interface AdherenceCardProps {
  value: string;
  label?: string;
  badge?: string;
  className?: string;
}

/** Domain card: big adherence figure + label + "On track" badge. */
export function AdherenceCard({
  value,
  label = "Adherence",
  badge = "On track",
  className,
}: AdherenceCardProps) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface p-5", className)}>
      <div className="flex items-start justify-between">
        <IconBadge icon={CheckCircle2} tone="accent" />
        <Badge variant="success" size="sm">
          <TrendingUp className="h-3.5 w-3.5" /> {badge}
        </Badge>
      </div>
      <p className="mt-4 text-h1 font-extrabold text-ink">{value}</p>
      <p className="mt-1 text-small text-muted">{label}</p>
    </div>
  );
}
