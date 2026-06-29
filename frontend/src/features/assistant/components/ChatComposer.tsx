import { Mic, Paperclip, SendHorizontal } from "lucide-react";

/** Message composer — attach, text input, mic, send. UI only. */
export function ChatComposer() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-2">
      <button
        type="button"
        aria-label="Attach"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-ink"
      >
        <Paperclip className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <input
        type="text"
        placeholder="Ask about a medicine, dose or interaction…"
        className="flex-1 bg-transparent text-body text-ink placeholder:text-muted focus:outline-none"
      />
      <button
        type="button"
        aria-label="Voice input"
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-bg hover:text-ink"
      >
        <Mic className="h-5 w-5" strokeWidth={1.9} />
      </button>
      <button
        type="button"
        aria-label="Send"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-600"
      >
        <SendHorizontal className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  );
}
