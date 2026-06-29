import { Accordion, type AccordionItemData } from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";

const FAQS: AccordionItemData[] = [
  {
    question: "Is DawaiBuddy a replacement for my doctor?",
    answer:
      "No. DawaiBuddy helps you understand your medicines in plain language, but it never replaces professional medical advice. Always confirm changes with your doctor or pharmacist.",
  },
  {
    question: "How accurate is the prescription scanning?",
    answer:
      "Our OCR is trained on Indian prescriptions, including handwriting, and shows a confidence score for every medicine. You can review and correct any detail before saving.",
  },
  {
    question: "Is my health data private and secure?",
    answer:
      "Yes. Your prescriptions are encrypted in transit and at rest, never sold, and you can delete your data at any time.",
  },
  {
    question: "Does it work with Indian medicine brands?",
    answer:
      "Absolutely. We index over 1.2 million Indian medicines and brands, with salt composition, dosage forms and generic alternatives.",
  },
  {
    question: "Is DawaiBuddy free to use?",
    answer:
      "Core features — scanning, plain-language info and reminders — are free forever. Plus unlocks family profiles and advanced tools.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />
        <Accordion className="mt-10" items={FAQS} defaultOpenIndex={0} />
      </div>
    </section>
  );
}
