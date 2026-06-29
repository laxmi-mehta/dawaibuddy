import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Tinted, rounded-square icon container used across cards & steps. */
const iconBadgeVariants = cva("inline-flex items-center justify-center rounded-md", {
  variants: {
    tone: {
      brand: "bg-brand-50 text-brand",
      accent: "bg-accent-50 text-accent-600",
      success: "bg-success-bg text-success",
      warning: "bg-warning-bg text-warning",
      neutral: "bg-bg text-ink-2",
    },
    size: {
      sm: "h-9 w-9",
      default: "h-11 w-11",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: { tone: "brand", size: "default" },
});

interface IconBadgeProps extends VariantProps<typeof iconBadgeVariants> {
  icon: LucideIcon;
  className?: string;
}

export function IconBadge({ icon: Icon, tone, size, className }: IconBadgeProps) {
  return (
    <span className={cn(iconBadgeVariants({ tone, size }), className)}>
      <Icon className="h-5 w-5" strokeWidth={1.9} />
    </span>
  );
}
