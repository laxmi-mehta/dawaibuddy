import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type Severity = "none" | "mild" | "moderate" | "severe";

const MAP = {
  none: { variant: "success", icon: CheckCircle2, label: "No interaction" },
  mild: { variant: "success", icon: Info, label: "Mild" },
  moderate: { variant: "warning", icon: AlertTriangle, label: "Moderate" },
  severe: { variant: "danger", icon: ShieldAlert, label: "Severe" },
} as const;

/** Severity indicator for drug interactions. */
export function SeverityPill({ severity, label }: { severity: Severity; label?: string }) {
  const { variant, icon: Icon, label: defaultLabel } = MAP[severity];
  return (
    <Badge variant={variant} size="sm">
      <Icon className="h-3.5 w-3.5" />
      {label ?? defaultLabel}
    </Badge>
  );
}

/** Maps severity → the accent colour used for card left-borders / connectors. */
export const SEVERITY_BORDER: Record<Severity, string> = {
  none: "border-l-success",
  mild: "border-l-success",
  moderate: "border-l-warning",
  severe: "border-l-danger",
};
