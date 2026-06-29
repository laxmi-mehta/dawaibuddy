import { Pill, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";

interface Med {
  name: string;
  dose: string;
  category: string;
  tone: "brand" | "accent" | "warning";
}

const MEDS: Med[] = [
  { name: "Atorvastatin", dose: "10 mg", category: "Lipid-lowering", tone: "brand" },
  { name: "Azithromycin", dose: "500 mg", category: "Antibiotic", tone: "warning" },
  { name: "Amlodipine", dose: "5 mg", category: "Anti-hypertensive", tone: "accent" },
];

export function MedicinesCompared() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Medicines compared</h2>
        <Badge variant="brand" size="sm">
          3 selected
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MEDS.map((m) => (
          <div key={m.name} className="relative rounded-lg border border-line p-4 text-center">
            <button
              type="button"
              aria-label={`Remove ${m.name}`}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <IconBadge icon={Pill} tone={m.tone} size="lg" className="mx-auto" />
            <p className="mt-3 font-bold text-ink">{m.name}</p>
            <p className="text-small text-muted">{m.dose}</p>
            <Badge variant="default" size="sm" className="mt-2">
              {m.category}
            </Badge>
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
