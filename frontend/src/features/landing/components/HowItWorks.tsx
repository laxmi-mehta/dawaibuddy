import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse, ScanLine, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string;
}

export function HowItWorks() {
  const { t } = useTranslation();

  const STEPS: Step[] = [
    {
      num: "01",
      icon: Upload,
      title: t("landing.howItWorks.step1Title"),
      body: t("landing.howItWorks.step1Body"),
    },
    {
      num: "02",
      icon: ScanLine,
      title: t("landing.howItWorks.step2Title"),
      body: t("landing.howItWorks.step2Body"),
    },
    {
      num: "03",
      icon: HeartPulse,
      title: t("landing.howItWorks.step3Title"),
      body: t("landing.howItWorks.step3Body"),
    },
  ];

  return (
    <section id="how-it-works" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={t("landing.howItWorks.eyebrow")}
          title={t("landing.howItWorks.title")}
          subtitle={t("landing.howItWorks.subtitle")}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.num}>
              <div className="flex items-center justify-between">
                <IconBadge icon={step.icon} tone="brand" size="lg" />
                <span className="text-4xl font-extrabold text-line">{step.num}</span>
              </div>
              <h3 className="mt-5 text-h3 font-extrabold text-ink">{step.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/register" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
            {t("landing.howItWorks.getStarted")}
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
