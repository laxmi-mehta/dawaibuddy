import { ChevronRight, Clock, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";

interface Rx {
  doctor: string;
  meta: string;
  status: "Ready" | "Processing";
  tone: "brand" | "accent";
}

const ITEMS: Rx[] = [
  {
    doctor: "Dr. Meera Nair — Diabetology",
    meta: "2 Jun 2026 · 2 medicines",
    status: "Ready",
    tone: "brand",
  },
  {
    doctor: "Dr. Rohan Kulkarni — Cardiology",
    meta: "24 May 2026 · 2 medicines",
    status: "Ready",
    tone: "accent",
  },
  {
    doctor: "Dr. Sana Qureshi — General Physician",
    meta: "11 May 2026 · 2 medicines",
    status: "Processing",
    tone: "brand",
  },
];

export function RecentPrescriptions() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Recent prescriptions</h2>
        <button
          type="button"
          className="flex items-center gap-1 text-small font-semibold text-brand hover:underline"
        >
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {ITEMS.map((rx) => (
          <li key={rx.doctor} className="flex items-center gap-4 py-4">
            <IconBadge icon={FileText} tone={rx.tone} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-ink">{rx.doctor}</p>
              <p className="text-small text-muted">{rx.meta}</p>
            </div>
            {rx.status === "Ready" ? (
              <Badge variant="success" size="sm">
                Ready
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                <Clock className="h-3.5 w-3.5" /> Processing
              </Badge>
            )}
            <ChevronRight className="h-5 w-5 text-muted" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
