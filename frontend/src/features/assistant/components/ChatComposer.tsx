import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}

/** Message composer — text input + send, wired to AssistantPage's ask handler. */
export function ChatComposer({ value, onChange, onSend, sending }: ChatComposerProps) {
  const { t } = useTranslation();
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !sending) onSend();
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2">
      <button
        type="button"
        aria-label={t("assistant.attach")}
        disabled
        title={t("assistant.attachmentsComingSoon")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted opacity-40"
      >
        <Paperclip className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("assistant.composerPlaceholder")}
        className="flex-1 bg-transparent text-body text-ink placeholder:text-muted focus:outline-none"
      />
      <button
        type="button"
        aria-label={t("assistant.voiceInput")}
        disabled
        title={t("assistant.voiceComingSoon")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted opacity-40"
      >
        <Mic className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <button
        type="button"
        aria-label={t("assistant.send")}
        disabled={!value.trim() || sending}
        onClick={onSend}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        <SendHorizontal className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}
