import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { SeverityPill, type Severity } from "@/components/shared/SeverityPill";
import { InteractionSummary } from "@/features/interactions/components/InteractionSummary";
import { MedicinesCompared } from "@/features/interactions/components/MedicinesCompared";
import { InteractionPairCard } from "@/features/interactions/components/InteractionPairCard";
import { medicinesService } from "@/services/medicines.service";
import { interactionsService } from "@/services/interactions.service";
import type { InteractionCheckResponse, Medicine } from "@/types";

export default function InteractionsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [result, setResult] = useState<InteractionCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const page = await medicinesService.list();
        const meds = page.results ?? [];
        setMedicines(meds);
        if (meds.length >= 2) {
          setResult(await interactionsService.check(meds.map((m) => m.id)));
        }
      } catch {
        setError("Could not load interactions. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const by = result?.by_severity ?? {};

  return (
    <>
      <AppHeader
        title="Drug interaction checker"
        subtitle="Compare your medicines to see if they are safe together"
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {loading && <p className="text-body text-muted">Checking interactions…</p>}
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {!loading && !error && result && (
          <>
            <InteractionSummary
              total={result.count}
              severe={by.severe ?? 0}
              moderate={by.moderate ?? 0}
              mild={by.mild ?? 0}
              medicineCount={medicines.length}
            />

            <MedicinesCompared medicines={medicines} />

            <div>
              <h2 className="mb-4 text-h3 font-extrabold text-ink">Interaction details</h2>
              {result.interactions.length ? (
                <div className="space-y-4">
                  {result.interactions.map((it) => (
                    <InteractionPairCard
                      key={it.id}
                      pair={{
                        left: it.medicine_a_name ?? "Medicine A",
                        right: it.medicine_b_name ?? "Medicine B",
                        severity: it.severity as Severity,
                        title: it.title || "Interaction",
                        detail: it.description,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-6 text-body text-muted">No known interactions on record.</Card>
              )}
            </div>

            {result.model_available && result.model_predictions.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-brand" strokeWidth={1.9} />
                  <h2 className="text-h3 font-extrabold text-ink">AI model assessment</h2>
                </div>
                <p className="mt-1 text-small text-muted">
                  Every pair scored by the DDI model (demo-grade until trained on a full dataset).
                </p>
                <ul className="mt-4 divide-y divide-line">
                  {result.model_predictions.map((p) => (
                    <li
                      key={`${p.medicine_a}-${p.medicine_b}`}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <span className="font-medium text-ink">
                        {p.medicine_a_name} + {p.medicine_b_name}
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="text-small tabular-nums text-muted">
                          {(p.probability * 100).toFixed(0)}%
                        </span>
                        <SeverityPill severity={p.severity as Severity} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  );
}
