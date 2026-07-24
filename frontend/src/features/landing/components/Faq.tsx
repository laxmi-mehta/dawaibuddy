import { useTranslation } from "react-i18next";
import { Accordion, type AccordionItemData } from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  const { t } = useTranslation();

  const FAQS: AccordionItemData[] = [
    { question: t("landing.faq.q1"), answer: t("landing.faq.a1") },
    { question: t("landing.faq.q2"), answer: t("landing.faq.a2") },
    { question: t("landing.faq.q3"), answer: t("landing.faq.a3") },
    { question: t("landing.faq.q4"), answer: t("landing.faq.a4") },
    { question: t("landing.faq.q5"), answer: t("landing.faq.a5") },
  ];

  return (
    <section id="faq" className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow={t("landing.faq.eyebrow")} title={t("landing.faq.title")} />
        <Accordion className="mt-10" items={FAQS} defaultOpenIndex={0} />
      </div>
    </section>
  );
}
