import { Focus, Lock, Maximize, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/IconBadge";

const TIPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Sun, title: "Good lighting", body: "Avoid shadows and glare on the paper." },
  { icon: Maximize, title: "Flat & in frame", body: "Lay the prescription flat, fill the frame." },
  { icon: Focus, title: "Keep it sharp", body: "Hold steady so the text is crisp and readable." },
];

export function ScanTips() {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-h3 font-extrabold text-ink">Tips for a clean scan</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {TIPS.map((t) => (
            <li key={t.title} className="flex items-start gap-3">
              <IconBadge icon={t.icon} tone="accent" />
              <div>
                <p className="font-bold text-ink">{t.title}</p>
                <p className="text-small text-muted">{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
        <div>
          <p className="font-bold text-ink">Private &amp; secure</p>
          <p className="text-small text-muted">
            Your prescriptions are encrypted and never shared. Delete anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
