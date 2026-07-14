const PROMPTS = [
  "What are the side effects of Atorva 10?",
  "Can I take Pan 40 with Glycomet 500 SR?",
  "I have a headache, what should I do?",
  "Tips for better sleep?",
];

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onSelect(p)}
          className="rounded-full border border-line bg-surface px-4 py-2 text-small font-medium text-ink-2 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
