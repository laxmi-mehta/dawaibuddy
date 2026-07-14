import { Link } from "react-router-dom";
import { ChevronRight, Clock, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { Prescription } from "@/types";

function formatDate(value: string | null): string {
  if (!value) return "Date unknown";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecentPrescriptions({ prescriptions }: { prescriptions: Prescription[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Recent prescriptions</h2>
        <Link
          to="/prescriptions"
          className="flex items-center gap-1 text-small font-semibold text-brand hover:underline"
        >
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <p className="mt-4 text-small text-muted">No prescriptions yet — upload one to start.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {prescriptions.map((rx) => (
            <li key={rx.id} className="flex items-center gap-4 py-4">
              <IconBadge icon={FileText} tone="brand" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">
                  {rx.doctor_name || "Unknown doctor"}
                  {rx.speciality ? ` — ${rx.speciality}` : ""}
                </p>
                <p className="text-small text-muted">
                  {formatDate(rx.prescribed_on)} · {rx.medicines.length} medicine
                  {rx.medicines.length === 1 ? "" : "s"}
                </p>
              </div>
              {rx.status === "ready" ? (
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
      )}
    </Card>
  );
}
