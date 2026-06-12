const PROMPTS = [
  "What are the side effects of Atorvastatin?",
  "Can I take Amlodipine with grapefruit?",
  "Explain my evening medicines",
  "Find a cheaper alternative to Atorva 10",
];

export function SuggestedPrompts() {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((p) => (
        <button
          key={p}
          type="button"
          className="rounded-full border border-line bg-surface px-4 py-2 text-small font-medium text-ink-2 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
