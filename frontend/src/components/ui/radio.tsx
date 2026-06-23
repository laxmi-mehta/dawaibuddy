import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

/** Native radio styled with the brand accent. */
export function Radio({ label, className, id, ...props }: RadioProps) {
  const radioId = id ?? props.value?.toString();
  return (
    <label htmlFor={radioId} className="flex cursor-pointer select-none items-center gap-2.5">
      <input
        id={radioId}
        type="radio"
        className={cn("h-5 w-5 shrink-0 accent-brand", className)}
        {...props}
      />
      {label && <span className="text-small text-ink-2">{label}</span>}
    </label>
  );
}
