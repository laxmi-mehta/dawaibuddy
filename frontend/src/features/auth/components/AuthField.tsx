import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  /** Node rendered on the right of the label row (e.g. a "Forgot?" link). */
  labelAction?: ReactNode;
  /** Node rendered inside the input on the right (e.g. a show-password toggle). */
  rightSlot?: ReactNode;
  /** Helper text under the field. */
  hint?: string;
}

/** Labelled input with a leading icon — the auth form field. ≥48px tall. */
export function AuthField({
  label,
  icon: Icon,
  labelAction,
  rightSlot,
  hint,
  className,
  id,
  ...props
}: AuthFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={fieldId} className="text-small font-bold text-ink">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          strokeWidth={1.9}
        />
        <input
          id={fieldId}
          className={cn(
            "h-12 w-full rounded-md border border-line bg-surface pl-11 pr-11 text-body text-ink",
            "placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
            className
          )}
          {...props}
        />
        {rightSlot && <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
      {hint && <p className="mt-1.5 text-tiny text-muted">{hint}</p>}
    </div>
  );
}
