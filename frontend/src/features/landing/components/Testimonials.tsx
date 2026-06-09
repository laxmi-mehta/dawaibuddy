import { Quote, Star } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SectionHeading } from './SectionHeading'

interface Testimonial {
  quote: string
  initials: string
  name: string
  role: string
  avatar: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I finally understand my father's 6 medicines. The reminders mean he never misses his evening dose now.",
    initials: 'AS',
    name: 'Ananya Sharma',
    role: 'Caregiver, Pune',
    avatar: 'bg-brand-100 text-brand-700',
  },
  {
    quote:
      'I recommend DawaiBuddy to patients who struggle with complex prescriptions. The interaction checker is genuinely useful.',
    initials: 'VR',
    name: 'Dr. Vikram Rao',
    role: 'Family Physician, Hyderabad',
    avatar: 'bg-accent-100 text-accent-600',
  },
  {
    quote:
      'Scanned my prescription and got plain-English explanations in seconds. The generic alternatives saved me ₹400 a month.',
    initials: 'PM',
    name: 'Priya Menon',
    role: 'Marketing Lead, Bengaluru',
    avatar: 'bg-brand-100 text-brand-700',
  },
]

export function Testimonials() {
  return (
    <section id="reviews" className="bg-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading eyebrow="Loved by families & doctors" title="People feel safer with DawaiBuddy" />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="flex flex-col p-6">
              <Quote className="h-8 w-8 text-brand-100" fill="currentColor" />
              <div className="mt-3 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 flex-1 text-body leading-relaxed text-ink-2">{t.quote}</p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-small font-bold ${t.avatar}`}
                >
                  {t.initials}
                </span>
                <div>
                  <p className="font-bold text-ink">{t.name}</p>
                  <p className="text-small text-muted">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
