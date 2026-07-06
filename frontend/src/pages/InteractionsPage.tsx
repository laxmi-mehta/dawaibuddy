import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityPill, type Severity } from "@/components/shared/SeverityPill";
import { InteractionSummary } from "@/features/interactions/components/InteractionSummary";
import { MedicinesCompared } from "@/features/interactions/components/MedicinesCompared";
import { InteractionPairCard } from "@/features/interactions/components/InteractionPairCard";
import { medicinesService } from "@/services/medicines.service";
import { interactionsService } from "@/services/interactions.service";
import type { InteractionCheckResponse, Medicine } from "@/types";

export default function InteractionsPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<InteractionCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load medicines once; select all + run an initial check.
  useEffect(() => {
    (async () => {
      try {
        const page = await medicinesService.list();
        const meds = page.results ?? [];
        setMedicines(meds);
        const ids = new Set(meds.map((m) => m.id));
        setSelected(ids);
        if (ids.size >= 2) setResult(await interactionsService.check([...ids]));
      } catch {
        setError("Could not load interactions. Is the backend running?");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runCheck() {
    if (selected.size < 2) return;
    setChecking(true);
    setError(null);
    try {
      setResult(await interactionsService.check([...selected]));
    } catch {
      setError("Check failed.");
    } finally {
      setChecking(false);
    }
  }

  const by = result?.by_severity ?? {};
  const selectedMeds = useMemo(
    () => medicines.filter((m) => selected.has(m.id)),
    [medicines, selected]
  );

  return (
    <>
      <AppHeader
        title="Drug interaction checker"
        subtitle="Compare your medicines to see if they are safe together"
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {loading && <p className="text-body text-muted">Loading medicines…</p>}
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {!loading && (
          <>
            {result && (
              <InteractionSummary
                total={result.count}
                severe={by.severe ?? 0}
                moderate={by.moderate ?? 0}
                mild={by.mild ?? 0}
                medicineCount={selectedMeds.length}
              />
            )}

            <MedicinesCompared medicines={medicines} selected={selected} onToggle={toggle} />

            <Button onClick={runCheck} disabled={selected.size < 2 || checking} size="lg">
              <Search className="h-5 w-5" strokeWidth={2} />
              {checking ? "Checking…" : `Check ${selected.size} medicines`}
            </Button>

            {result && (
              <>
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
                    <Card className="p-6 text-body text-muted">
                      No known interactions on record for this set.
                    </Card>
                  )}
                </div>

                {result.model_available && result.model_predictions.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-brand" strokeWidth={1.9} />
                      <h2 className="text-h3 font-extrabold text-ink">AI model assessment</h2>
                    </div>
                    <p className="mt-1 text-small text-muted">
                      Every selected pair scored by the DDI model (trained on DrugBank, ~0.84
                      AUROC).
                    </p>
                    <ul className="mt-4 divide-y divide-line">
                      {[...result.model_predictions]
                        .sort((a, b) => b.probability - a.probability)
                        .map((p) => (
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
          </>
        )}
      </div>
    </>
  );
}
