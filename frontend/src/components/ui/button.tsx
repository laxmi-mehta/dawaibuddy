import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Pill buttons with clear hierarchy — matches the Design System screen:
 * Primary · Accent · Ghost · Soft · Quiet · Danger.
 * Exported `buttonVariants` so router <Link>s can adopt the same look.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white shadow-soft hover:bg-brand-600',
        accent: 'bg-accent text-ink shadow-soft hover:bg-accent-600 hover:text-white',
        ghost: 'border border-line bg-surface text-ink hover:bg-bg',
        soft: 'bg-brand-100 text-brand-700 hover:bg-brand-200',
        quiet: 'bg-transparent text-muted hover:bg-bg hover:text-ink',
        danger: 'bg-danger-bg text-danger hover:bg-danger/15',
      },
      size: {
        lg: 'h-13 px-7 text-body-lg',
        default: 'h-11 px-5 text-body',
        sm: 'h-9 px-4 text-small',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
