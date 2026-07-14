import { AlertTriangle, CheckCircle2, Heart, ShieldQuestion } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import type { Medicine } from "@/types";

function CheckList({ items, emptyText }: { items: string[]; emptyText: string }) {
  if (items.length === 0) {
    return <p className="py-4 text-body text-muted">{emptyText}</p>;
  }
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 py-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" strokeWidth={1.9} />
          <span className="text-body text-ink-2">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MedicineTabs({ medicine }: { medicine: Medicine }) {
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
                <CheckList items={medicine.uses} emptyText="No uses on record for this medicine." />
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
                  items={medicine.side_effects}
                  emptyText="No side effects on record for this medicine."
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
                  items={medicine.warnings}
                  emptyText="No warnings on record for this medicine."
                />
              </>
            ),
          },
        ]}
      />
    </Card>
  );
}
