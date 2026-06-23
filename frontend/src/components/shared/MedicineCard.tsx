import { Pill } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

interface MedicineCardProps {
  name: string;
  /** e.g. "Metformin · 500 mg" */
  detail: string;
  icon?: LucideIcon;
  tone?: "brand" | "accent";
  tag?: string;
  tagVariant?: BadgeProps["variant"];
  className?: string;
}

/** Domain card: pill icon + name + salt·dose, with an optional category tag. */
export function MedicineCard({
  name,
  detail,
  icon = Pill,
  tone = "brand",
  tag,
  tagVariant = "brand",
  className,
}: MedicineCardProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border border-line bg-surface p-4", className)}>
      <IconBadge icon={icon} tone={tone} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-ink">{name}</p>
        <p className="text-small text-muted">{detail}</p>
      </div>
      {tag && <Badge variant={tagVariant} size="sm">{tag}</Badge>}
    </div>
  );
}
