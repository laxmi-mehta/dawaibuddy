import { Check, Pill } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";
import type { Medicine } from "@/types";

const TONES = ["brand", "accent", "warning"] as const;

interface MedicinesComparedProps {
  medicines: Medicine[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export function MedicinesCompared({ medicines, selected, onToggle }: MedicinesComparedProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-h3 font-extrabold text-ink">Medicines compared</h2>
          <p className="text-small text-muted">Tap to select which medicines to check.</p>
        </div>
        <Badge variant="brand" size="sm">
          {selected.size} selected
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {medicines.map((m, i) => {
          const isOn = selected.has(m.id);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onToggle(m.id)}
              className={cn(
                "relative rounded-lg border p-4 text-center transition-colors",
                isOn ? "border-brand bg-brand-50/50" : "border-line hover:bg-bg"
              )}
            >
              {isOn && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              <IconBadge icon={Pill} tone={TONES[i % TONES.length]} size="lg" className="mx-auto" />
              <p className="mt-3 font-bold text-ink">{m.name}</p>
              <p className="text-small text-muted">{m.strength || m.generic_name}</p>
              {m.category && (
                <Badge variant="default" size="sm" className="mt-2">
                  {m.category}
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
