import { AppHeader } from "@/components/layout/AppHeader";
import { InteractionSummary } from "@/features/interactions/components/InteractionSummary";
import { MedicinesCompared } from "@/features/interactions/components/MedicinesCompared";
import {
  InteractionPairCard,
  type InteractionPair,
} from "@/features/interactions/components/InteractionPairCard";

const PAIRS: InteractionPair[] = [
  {
    left: "Atorvastatin",
    right: "Azithromycin",
    severity: "moderate",
    title: "Possible muscle-related effects",
    detail:
      "Azithromycin may raise the risk of statin-related muscle pain (myopathy). Watch for unexplained muscle aches and tell your doctor.",
  },
  {
    left: "Atorvastatin",
    right: "Amlodipine",
    severity: "mild",
    title: "Minor — monitor",
    detail:
      "Amlodipine can slightly increase atorvastatin levels. Usually fine at standard doses; report muscle pain.",
  },
];

export default function InteractionsPage() {
  return (
    <>
      <AppHeader
        title="Drug interaction checker"
        subtitle="Compare your medicines to see if they are safe together"
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <InteractionSummary />
        <MedicinesCompared />

        <div>
          <h2 className="mb-4 text-h3 font-extrabold text-ink">Interaction details</h2>
          <div className="space-y-4">
            {PAIRS.map((p) => (
              <InteractionPairCard key={`${p.left}-${p.right}`} pair={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
