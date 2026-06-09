import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AccordionItemData {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItemData[]
  /** Index open on first render (-1 for all closed). */
  defaultOpenIndex?: number
  className?: string
}

/** Lightweight single-open accordion — no external deps. Used by the FAQ section. */
export function Accordion({ items, defaultOpenIndex = 0, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpenIndex)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={item.question}
            className={cn(
              'rounded-md border bg-surface transition-colors',
              isOpen ? 'border-brand-100' : 'border-line',
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="text-body-lg font-bold text-ink">{item.question}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-body leading-relaxed text-muted">{item.answer}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
