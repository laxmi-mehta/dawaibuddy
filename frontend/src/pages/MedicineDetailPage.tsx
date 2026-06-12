import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { MedicineHeaderCard } from "@/features/medicines/components/MedicineHeaderCard";
import { MedicineTabs } from "@/features/medicines/components/MedicineTabs";
import { PriceCard } from "@/features/medicines/components/PriceCard";
import { GenericAlternatives } from "@/features/medicines/components/GenericAlternatives";

export default function MedicineDetailPage() {
  return (
    <>
      <AppHeader
        title="Medicine details"
        subtitle="Metformin · Anti-diabetic"
        actions={
          <Link to="/interactions">
            <Button variant="ghost" size="sm">
              <ShieldCheck className="h-4 w-4" strokeWidth={2} /> Check interactions
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-small font-semibold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <MedicineHeaderCard />
            <MedicineTabs />
          </div>
          <div className="space-y-6">
            <PriceCard />
            <GenericAlternatives />
          </div>
        </div>
      </div>
    </>
  );
}
