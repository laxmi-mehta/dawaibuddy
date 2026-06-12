import { Leaf } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Alt {
  name: string;
  maker: string;
  price: string;
  save: string;
}

const ALTS: Alt[] = [
  { name: "Metformin (generic)", maker: "Generic", price: "₹12", save: "Save 71%" },
  { name: "Okamet 500", maker: "Cipla", price: "₹38", save: "Save 10%" },
  { name: "Glyciphage", maker: "Franco-Indian", price: "₹35", save: "Save 17%" },
];

export function GenericAlternatives() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-accent-600" strokeWidth={1.9} />
        <h3 className="text-h3 font-extrabold text-ink">Generic alternatives</h3>
      </div>
      <p className="mt-1 text-small text-muted">Same salt, same effect — often cheaper.</p>

      <ul className="mt-4 divide-y divide-line">
        {ALTS.map((a) => (
          <li key={a.name} className="flex items-center justify-between py-4">
            <div>
              <p className="font-bold text-ink">{a.name}</p>
              <p className="text-small text-muted">{a.maker}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-ink">{a.price}</p>
              <p className="text-small font-semibold text-success">{a.save}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
