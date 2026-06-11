import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { QuickUpload } from "@/features/dashboard/components/QuickUpload";
import { RecentPrescriptions } from "@/features/dashboard/components/RecentPrescriptions";
import { MedicineSearch } from "@/features/dashboard/components/MedicineSearch";
import { AssistantPromo } from "@/features/dashboard/components/AssistantPromo";
import { TodaysReminders } from "@/features/dashboard/components/TodaysReminders";

export default function DashboardPage() {
  return (
    <>
      <AppHeader
        title={<>Hi Aarav 👋</>}
        subtitle="Tuesday, 6 June 2026 · You're doing great this week"
        searchPlaceholder="Search medicines, prescriptions…"
        actions={
          <Link to="/upload" className={cn(buttonVariants({ variant: "primary" }))}>
            <Plus className="h-5 w-5" strokeWidth={2} /> Upload Rx
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <StatCards />
        <QuickUpload />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <RecentPrescriptions />
            <MedicineSearch />
          </div>
          <div className="space-y-6">
            <AssistantPromo />
            <TodaysReminders />
          </div>
        </div>
      </div>
    </>
  );
}
