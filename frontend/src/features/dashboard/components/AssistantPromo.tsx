import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "What are the side effects of Atorvastatin?",
  "Can I take Amlodipine with grapefruit?",
];

/** Dark AI-assistant promo card on the dashboard. */
export function AssistantPromo() {
  return (
    <div className="rounded-xl bg-ink p-6 text-white">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white/10">
          <Sparkles className="h-5 w-5" strokeWidth={1.9} />
        </span>
        <div>
          <p className="font-bold">AI Assistant</p>
          <p className="text-small text-white/60">Always here to help</p>
        </div>
      </div>

      <p className="mt-4 text-body text-white/80">
        Ask anything about your medicines — interactions, side-effects, timings — in plain language.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {SUGGESTIONS.map((q) => (
          <Link
            key={q}
            to="/assistant"
            className="flex items-center justify-between gap-3 rounded-md bg-white/5 px-4 py-3 text-small font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            {q}
            <ArrowRight className="h-4 w-4 shrink-0 text-white/50" />
          </Link>
        ))}
      </div>

      <Link
        to="/assistant"
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent font-semibold text-ink transition-colors hover:bg-accent-600 hover:text-white"
      >
        Open assistant <MessageCircle className="h-5 w-5" strokeWidth={2} />
      </Link>
    </div>
  );
}
