import { AlertTriangle, Info, Pill } from "lucide-react";
import { SeverityPill, SEVERITY_BORDER, type Severity } from "@/components/shared/SeverityPill";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

export interface InteractionPair {
  left: string;
  right: string;
  severity: Severity;
  title: string;
  detail: string;
}

function Med({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <IconBadge icon={Pill} tone="brand" size="sm" />
      <span className="font-bold text-ink">{name}</span>
    </div>
  );
}

export function InteractionPairCard({ pair }: { pair: InteractionPair }) {
  const ConnIcon = pair.severity === "moderate" || pair.severity === "severe" ? AlertTriangle : Info;
  const connTone = pair.severity === "moderate" || pair.severity === "severe" ? "text-warning" : "text-success";

  return (
    <div className={cn("rounded-lg border border-line border-l-4 bg-surface p-5 shadow-card", SEVERITY_BORDER[pair.severity])}>
      <div className="flex items-center justify-between gap-4">
        <Med name={pair.left} />
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="h-px max-w-16 flex-1 bg-line" />
          <ConnIcon className={cn("h-5 w-5", connTone)} strokeWidth={1.9} />
          <span className="h-px max-w-16 flex-1 bg-line" />
        </div>
        <Med name={pair.right} />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-bold text-ink">{pair.title}</p>
          <p className="mt-1 text-small text-muted">{pair.detail}</p>
        </div>
        <SeverityPill severity={pair.severity} />
      </div>
    </div>
  );
}
