import { useState } from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  defaultChecked?: boolean;
  /** Controlled mode: pass both checked + onChange. */
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  "aria-label"?: string;
}

/** Accessible on/off switch. Uncontrolled by default; pass checked+onChange to control it. */
export function Toggle({ defaultChecked = false, checked, onChange, ...props }: ToggleProps) {
  const [uncontrolledOn, setUncontrolledOn] = useState(defaultChecked);
  const on = checked ?? uncontrolledOn;

  function toggle() {
    if (checked === undefined) setUncontrolledOn((v) => !v);
    onChange?.(!on);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={toggle}
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
