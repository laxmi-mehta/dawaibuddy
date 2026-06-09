import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Accessible text input — ≥48px target height per the design system. */
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-md border border-line bg-surface px-4 text-body text-ink',
        'placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        className,
      )}
      {...props}
    />
  )
}
