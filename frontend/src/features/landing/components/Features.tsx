import { Bell, Leaf, PanelLeft, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { IconBadge } from "@/components/shared/IconBadge";
import { SectionHeading } from "./SectionHeading";

interface Feature {
  icon: LucideIcon;
  tone: "brand" | "accent";
  title: string;
  body: string;
}

export function Features() {
  const { t } = useTranslation();

  const FEATURES: Feature[] = [
    {
      icon: ScanLine,
      tone: "brand",
      title: t("landing.features.f1Title"),
      body: t("landing.features.f1Body"),
    },
    {
      icon: PanelLeft,
      tone: "accent",
      title: t("landing.features.f2Title"),
      body: t("landing.features.f2Body"),
    },
    {
      icon: ShieldCheck,
      tone: "brand",
      title: t("landing.features.f3Title"),
      body: t("landing.features.f3Body"),
    },
    {
      icon: Bell,
      tone: "accent",
      title: t("landing.features.f4Title"),
      body: t("landing.features.f4Body"),
    },
    {
      icon: Leaf,
      tone: "accent",
      title: t("landing.features.f5Title"),
      body: t("landing.features.f5Body"),
    },
    {
      icon: Sparkles,
      tone: "brand",
      title: t("landing.features.f6Title"),
      body: t("landing.features.f6Body"),
    },
  ];

  return (
    <section id="features" className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={t("landing.features.eyebrow")}
          title={t("landing.features.title")}
          subtitle={t("landing.features.subtitle")}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6 transition-shadow hover:shadow-float">
              <IconBadge icon={f.icon} tone={f.tone} size="lg" />
              <h3 className="mt-5 text-h3 font-extrabold text-ink">{f.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
