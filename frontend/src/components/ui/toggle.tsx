import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  defaultChecked?: boolean;
  "aria-label"?: string;
}

/** Accessible on/off switch (uncontrolled). */
export function Toggle({ defaultChecked = false, ...props }: ToggleProps) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        on ? "bg-brand" : "bg-line"
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
