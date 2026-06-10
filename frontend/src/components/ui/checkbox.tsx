import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

/** Native checkbox styled with the brand accent — pairs with an optional inline label. */
export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const boxId = id ?? props.name;
  return (
    <label htmlFor={boxId} className="flex cursor-pointer select-none items-center gap-2.5">
      <input
        id={boxId}
        type="checkbox"
        className={cn(
          "h-5 w-5 shrink-0 rounded-[6px] border border-line accent-brand",
          className,
        )}
        {...props}
      />
      {label && <span className="text-small text-ink-2">{label}</span>}
    </label>
  );
}
