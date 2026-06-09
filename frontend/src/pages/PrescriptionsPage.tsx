import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

export default function PrescriptionsPage() {
  return (
    <div>
      <PageHeader
        title="Prescriptions"
        description="Manage your prescriptions"
        action={<Button disabled>Add Prescription</Button>}
      />
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Prescription list — coming soon
      </div>
    </div>
  );
}
