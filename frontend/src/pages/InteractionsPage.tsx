import PageHeader from "@/components/common/PageHeader";

export default function InteractionsPage() {
  return (
    <div>
      <PageHeader
        title="Drug Interactions"
        description="Check for interactions between medicines"
      />
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Interaction checker — coming soon
      </div>
    </div>
  );
}
