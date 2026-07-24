import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/features/assistant/components/ChatBubble";
import { SuggestedPrompts } from "@/features/assistant/components/SuggestedPrompts";
import { ChatComposer } from "@/features/assistant/components/ChatComposer";
import { assistantService } from "@/services/assistant.service";
import type { Message } from "@/types";

export default function AssistantPage() {
  const { t } = useTranslation();
  const GREETING: Message = {
    id: "greeting",
    role: "assistant",
    content: t("assistant.greeting"),
    created_at: new Date(0).toISOString(),
  };
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setInput("");
    setSending(true);
    setError(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        role: "user",
        content: trimmed,
        created_at: new Date(0).toISOString(),
      },
    ]);

    try {
      const res = await assistantService.ask(trimmed, conversationId ?? undefined);
      setConversationId(res.conversation_id);
      setMessages((prev) => [...prev, res.reply]);
    } catch {
      setError(t("assistant.loadError"));
    } finally {
      setSending(false);
    }
  }

  function newChat() {
    setMessages([GREETING]);
    setConversationId(null);
    setInput("");
    setError(null);
  }

  return (
    <>
      <AppHeader title={t("nav.aiAssistant")} subtitle={t("assistant.subtitle")} />

      <div className="mx-auto max-w-4xl p-6">
        <Card className="flex flex-col">
          {/* Assistant identity */}
          <div className="flex items-center justify-between border-b border-line p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
                ✦
              </span>
              <div>
                <p className="font-bold text-ink">{t("assistant.assistantName")}</p>
                <p className="flex items-center gap-1.5 text-small text-muted">
                  <span className="h-2 w-2 rounded-full bg-success" /> {t("assistant.onlineStatus")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={newChat}
              className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-small font-semibold text-ink-2 hover:bg-bg"
            >
              <RefreshCw className="h-4 w-4" /> {t("assistant.newChat")}
            </button>
          </div>

          {/* Conversation */}
          <div className="flex flex-col gap-5 p-5">
            {messages.map((m) => (
              <ChatBubble key={m.id} role={m.role}>
                {m.content}
              </ChatBubble>
            ))}
            {sending && <ChatBubble role="assistant">{t("assistant.thinking")}</ChatBubble>}
            {error && <p className="text-small text-danger">{error}</p>}
          </div>

          {/* Suggested + composer */}
          <div className="border-t border-line p-5">
            <SuggestedPrompts onSelect={send} />
            <div className="mt-4">
              <ChatComposer
                value={input}
                onChange={setInput}
                onSend={() => send(input)}
                sending={sending}
              />
            </div>
            <p className="mt-3 text-center text-tiny text-muted">{t("assistant.disclaimer")}</p>
          </div>
        </Card>
      </div>
    </>
  );
}
