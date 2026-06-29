import { AlertTriangle, CheckCircle2, Heart, Layers, ShieldQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";

function CheckList({ items }: { items: string[] }) {
  return (
    <>
      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3 py-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.9} />
            <span className="text-body text-ink-2">{item}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MedicineTabs() {
  return (
    <Card className="p-6">
      <Tabs
        defaultId="uses"
        items={[
          {
            id: "uses",
            label: "Uses",
            icon: Heart,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">What it's used for</h3>
                <CheckList
                  items={[
                    "Type 2 diabetes mellitus",
                    "Improves insulin sensitivity",
                    "PCOS (off-label)",
                  ]}
                />
              </>
            ),
          },
          {
            id: "side-effects",
            label: "Side effects",
            icon: AlertTriangle,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">Possible side effects</h3>
                <CheckList
                  items={[
                    "Nausea or upset stomach",
                    "Metallic taste",
                    "Rarely, low vitamin B12 over time",
                  ]}
                />
              </>
            ),
          },
          {
            id: "warnings",
            label: "Warnings",
            icon: ShieldQuestion,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">Before you take it</h3>
                <CheckList
                  items={[
                    "Tell your doctor about kidney issues",
                    "Avoid excess alcohol",
                    "Pause before contrast scans",
                  ]}
                />
              </>
            ),
          },
          {
            id: "interactions",
            label: "Interactions",
            icon: Layers,
            content: (
              <>
                <h3 className="text-h3 font-extrabold text-ink">Common interactions</h3>
                <CheckList
                  items={[
                    "Some diuretics may raise blood sugar",
                    "Contrast dyes — pause use",
                    "Alcohol increases lactic-acidosis risk",
                  ]}
                />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
}
