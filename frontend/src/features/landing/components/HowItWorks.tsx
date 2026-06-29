import { Link } from "react-router-dom";
import { ArrowRight, HeartPulse, ScanLine, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
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

const STEPS: Step[] = [
  {
    num: "01",
    icon: Upload,
    title: "Upload your prescription",
    body: "Drag & drop, snap a photo, or import a PDF from your doctor.",
  },
  {
    num: "02",
    icon: ScanLine,
    title: "We extract the details",
    body: "Medicines, dosage, frequency and duration — ready for you to review.",
  },
  {
    num: "03",
    icon: HeartPulse,
    title: "Understand & stay on track",
    body: "Read plain-English explanations, check interactions and set reminders.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="Three simple steps"
          subtitle="No medical degree required. Get clarity in under a minute."
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
            Get started free
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
