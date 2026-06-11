import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/badge";

const POPULAR = ["Metformin", "Amlodipine", "Pantoprazole", "Cetirizine"];

export function MedicineSearch() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-h3 font-extrabold text-ink">Search medicines</h2>
        <Badge variant="brand" size="sm">1.2M indexed</Badge>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.9} />
        <input
          type="search"
          placeholder="Search e.g. Glycomet, Amlong, Pan-40…"
          className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-body text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {POPULAR.map((m) => (
          <Chip key={m}>{m}</Chip>
        ))}
      </div>
    </Card>
  );
}
