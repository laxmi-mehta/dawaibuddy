import { Quote, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
  avatar: string;
}

export function Testimonials() {
  const { t } = useTranslation();

  const TESTIMONIALS: Testimonial[] = [
    {
      quote: t("landing.testimonials.t1Quote"),
      initials: "AS",
      name: "Ananya Sharma",
      role: t("landing.testimonials.t1Role"),
      avatar: "bg-brand-100 text-brand-700",
    },
    {
      quote: t("landing.testimonials.t2Quote"),
      initials: "VR",
      name: "Dr. Vikram Rao",
      role: t("landing.testimonials.t2Role"),
      avatar: "bg-accent-100 text-accent-600",
    },
    {
      quote: t("landing.testimonials.t3Quote"),
      initials: "PM",
      name: "Priya Menon",
      role: t("landing.testimonials.t3Role"),
      avatar: "bg-brand-100 text-brand-700",
    },
  ];

  return (
    <section id="reviews" className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow={t("landing.testimonials.eyebrow")}
          title={t("landing.testimonials.title")}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <Card key={item.name} className="flex flex-col p-6">
              <Quote className="h-8 w-8 text-brand-100" fill="currentColor" />
              <div className="mt-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-body leading-relaxed text-ink-2">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-small font-bold ${item.avatar}`}
                >
                  {item.initials}
                </span>
                <div>
                  <p className="font-bold text-ink">{item.name}</p>
                  <p className="text-small text-muted">{item.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
