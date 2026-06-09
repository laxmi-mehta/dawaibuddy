import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Status & category indicators — Default · Brand · Accent · Success · Warning · Danger. */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-semibold leading-none',
  {
    variants: {
      variant: {
        default: 'bg-bg text-ink-2',
        brand: 'bg-brand-50 text-brand-700',
        accent: 'bg-accent-50 text-accent-600',
        success: 'bg-success-bg text-success',
        warning: 'bg-warning-bg text-warning',
        danger: 'bg-danger-bg text-danger',
      },
      size: {
        sm: 'px-2.5 py-1 text-tiny',
        default: 'px-3 py-1.5 text-small',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

/** Selectable category chip — solid brand when active, bordered otherwise. */
export interface ChipProps extends HTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Chip({ className, active = false, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-full px-4 py-2 text-small font-semibold transition-colors',
        active
          ? 'bg-brand text-white'
          : 'border border-line bg-surface text-ink hover:bg-bg',
        className,
      )}
      {...props}
    />
  )
}
