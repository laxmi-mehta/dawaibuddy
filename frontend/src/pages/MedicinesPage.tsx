import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/PageHeader";

export default function MedicinesPage() {
  return (
    <div>
      <PageHeader
        title="Medicines"
        description="Browse the medicine catalog"
        action={<Input placeholder="Search medicines…" className="w-64" disabled />}
      />
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Medicine catalog — coming soon
      </div>
    </div>
  );
}
