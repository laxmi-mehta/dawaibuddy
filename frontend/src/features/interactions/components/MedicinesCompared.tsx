import { Pill, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import type { Medicine } from "@/types";

const TONES = ["brand", "accent", "warning"] as const;

export function MedicinesCompared({ medicines }: { medicines: Medicine[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Medicines compared</h2>
        <Badge variant="brand" size="sm">{medicines.length} selected</Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {medicines.map((m, i) => (
          <div key={m.id} className="rounded-lg border border-line p-4 text-center">
            <IconBadge icon={Pill} tone={TONES[i % TONES.length]} size="lg" className="mx-auto" />
            <p className="mt-3 font-bold text-ink">{m.name}</p>
            <p className="text-small text-muted">{m.strength || m.generic_name}</p>
            {m.category && (
              <Badge variant="default" size="sm" className="mt-2">{m.category}</Badge>
            )}
          </div>
        ))}

        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line p-4 text-brand transition-colors hover:bg-brand-50"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50">
            <Plus className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="text-small font-semibold">Add medicine</span>
        </button>
      </div>
    </Card>
  );
}
