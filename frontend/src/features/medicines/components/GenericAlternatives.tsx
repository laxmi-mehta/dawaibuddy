import { Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Medicine } from "@/types";

export function GenericAlternatives({ medicine }: { medicine: Medicine }) {
  const alternatives = medicine.alternatives ?? [];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-accent-600" strokeWidth={1.9} />
        <h3 className="text-h3 font-extrabold text-ink">Generic alternatives</h3>
      </div>
      <p className="mt-1 text-small text-muted">Same salt, same effect — often cheaper.</p>

      {alternatives.length === 0 ? (
        <p className="mt-4 text-small text-muted">No alternatives on record for this medicine.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {alternatives.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-bold text-ink">{a.name}</p>
                <p className="text-small text-muted">{a.manufacturer}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-ink">{a.price ? `₹${a.price}` : "—"}</p>
                {a.save_percent != null && (
                  <p className="text-small font-semibold text-success">Save {a.save_percent}%</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
