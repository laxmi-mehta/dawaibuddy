import { Bell, Leaf, PanelLeft, ScanLine, ShieldCheck, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { IconBadge } from '@/components/shared/IconBadge'
import { SectionHeading } from './SectionHeading'

interface Feature {
  icon: LucideIcon
  tone: 'brand' | 'accent'
  title: string
  body: string
}

const FEATURES: Feature[] = [
  {
    icon: ScanLine,
    tone: 'brand',
    title: 'Scan any prescription',
    body: 'Snap a photo or upload a PDF. Our OCR reads typed and handwritten Rx and lists every medicine.',
  },
  {
    icon: PanelLeft,
    tone: 'accent',
    title: 'Plain-language info',
    body: 'Uses, side-effects and warnings explained simply — no confusing medical jargon.',
  },
  {
    icon: ShieldCheck,
    tone: 'brand',
    title: 'Interaction checker',
    body: "Compare medicines side-by-side and instantly see if they're safe to take together.",
  },
  {
    icon: Bell,
    tone: 'accent',
    title: 'Smart reminders',
    body: 'Never miss a dose. Schedule by morning, afternoon, evening or night with gentle nudges.',
  },
  {
    icon: Leaf,
    tone: 'accent',
    title: 'Generic alternatives',
    body: "Discover cheaper, equally-effective generics and see exactly how much you'll save.",
  },
  {
    icon: Sparkles,
    tone: 'brand',
    title: 'AI medicine assistant',
    body: 'Ask anything about your medicines and get clear, sourced answers in seconds.',
  },
]

export function Features() {
  return (
    <section id="features" className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Everything in one app"
          title="Your personal medicine companion"
          subtitle="From scanning a prescription to staying on schedule — DawaiBuddy handles the whole journey."
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
  )
}
