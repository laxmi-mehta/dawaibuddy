import PageHeader from "@/components/common/PageHeader";

export default function AssistantPage() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="AI Assistant"
        description="Ask questions about your medications"
      />
      <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        <p className="text-lg font-medium">AI chat interface — coming soon</p>
        <p className="mt-1 text-sm">Powered by Claude API</p>
      </div>
    </div>
  );
}
