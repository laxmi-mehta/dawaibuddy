import { RefreshCw } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/features/assistant/components/ChatBubble";
import { SuggestedPrompts } from "@/features/assistant/components/SuggestedPrompts";
import { ChatComposer } from "@/features/assistant/components/ChatComposer";

export default function AssistantPage() {
  return (
    <>
      <AppHeader title="AI Assistant" subtitle="Ask anything about your medicines" />

      <div className="mx-auto max-w-4xl p-6">
        <Card className="flex flex-col">
          {/* Assistant identity */}
          <div className="flex items-center justify-between border-b border-line p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
                ✦
              </span>
              <div>
                <p className="font-bold text-ink">DawaiBuddy Assistant</p>
                <p className="flex items-center gap-1.5 text-small text-muted">
                  <span className="h-2 w-2 rounded-full bg-success" /> Online · medicine-focused
                </p>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-small font-semibold text-ink-2 hover:bg-bg"
            >
              <RefreshCw className="h-4 w-4" /> New chat
            </button>
          </div>

          {/* Conversation */}
          <div className="flex flex-col gap-5 p-5">
            <ChatBubble role="assistant">
              Hi Aarav 👋 I'm your DawaiBuddy assistant. I can explain your medicines, check
              interactions, or help with reminders. What would you like to know?
            </ChatBubble>

            <ChatBubble role="user">Can I take Metformin and Pantoprazole together?</ChatBubble>

            <ChatBubble
              role="assistant"
              footnote="General guidance · not a substitute for your doctor"
            >
              <p>
                Yes — taking <strong>Metformin</strong> and <strong>Pantoprazole</strong> together
                is generally safe and very common. A small thing to keep in mind: both can slightly
                lower <strong>vitamin B12</strong> over long-term use, so periodic B12 checks are a
                good idea.
              </p>
              <p className="mt-3">
                Take Pantoprazole 30–60 minutes <em>before</em> breakfast, and Metformin{" "}
                <em>after</em> food to reduce stomach upset.
              </p>
            </ChatBubble>
          </div>

          {/* Suggested + composer */}
          <div className="border-t border-line p-5">
            <SuggestedPrompts />
            <div className="mt-4">
              <ChatComposer />
            </div>
            <p className="mt-3 text-center text-tiny text-muted">
              DawaiBuddy can make mistakes. Always confirm with your doctor or pharmacist.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
