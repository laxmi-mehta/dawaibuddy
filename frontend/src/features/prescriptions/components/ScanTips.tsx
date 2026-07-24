import { Focus, Lock, Maximize, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/IconBadge";

export function ScanTips() {
  const { t } = useTranslation();
  const tips: { icon: LucideIcon; title: string; body: string }[] = [
    { icon: Sun, title: t("upload.tip1Title"), body: t("upload.tip1Body") },
    { icon: Maximize, title: t("upload.tip2Title"), body: t("upload.tip2Body") },
    { icon: Focus, title: t("upload.tip3Title"), body: t("upload.tip3Body") },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-h3 font-extrabold text-ink">{t("upload.tipsTitle")}</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {tips.map((tip) => (
            <li key={tip.title} className="flex items-start gap-3">
              <IconBadge icon={tip.icon} tone="accent" />
              <div>
                <p className="font-bold text-ink">{tip.title}</p>
                <p className="text-small text-muted">{tip.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
        <div>
          <p className="font-bold text-ink">{t("upload.privateSecure")}</p>
          <p className="text-small text-muted">{t("upload.privateSecureDesc")}</p>
        </div>
      </div>
    </div>
  );
}
