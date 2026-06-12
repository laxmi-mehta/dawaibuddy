import type { ReactNode } from "react";
import { Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "assistant" | "user";
  children: ReactNode;
  /** Small disclaimer line under an assistant message. */
  footnote?: string;
}

export function ChatBubble({ role, children, footnote }: ChatBubbleProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-body text-white">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-white">
        <Sparkles className="h-5 w-5" strokeWidth={1.9} />
      </span>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3">
        <div className="text-body leading-relaxed text-ink-2">{children}</div>
        {footnote && (
          <p className={cn("mt-2 flex items-center gap-1.5 text-tiny text-muted")}>
            <Info className="h-3.5 w-3.5" /> {footnote}
          </p>
        )}
      </div>
    </div>
  );
}
