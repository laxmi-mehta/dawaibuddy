import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

export default function RemindersPage() {
  return (
    <div>
      <PageHeader
        title="Reminders"
        description="Set up medication reminders"
        action={<Button disabled>Add Reminder</Button>}
      />
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Reminder list — coming soon
      </div>
    </div>
  );
}
