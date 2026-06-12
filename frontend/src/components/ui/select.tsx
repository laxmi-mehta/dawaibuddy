import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

/** Styled native select with a chevron. */
export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className="relative inline-block">
      <select
        className={cn(
          "h-10 appearance-none rounded-md border border-line bg-surface pl-3 pr-9 text-small font-semibold text-ink",
          "focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
