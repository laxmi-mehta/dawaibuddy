import { useTranslation } from "react-i18next";

export function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  const { t } = useTranslation();
  const prompts = [
    t("assistant.prompt1"),
    t("assistant.prompt2"),
    t("assistant.prompt3"),
    t("assistant.prompt4"),
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((p) => (
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
