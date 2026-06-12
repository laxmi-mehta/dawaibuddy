import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0–100 */
  value: number;
  size?: number;
  className?: string;
}

/** Circular progress indicator with a centred percentage label. */
export function ProgressRing({ value, size = 64, className }: ProgressRingProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-line" strokeWidth="3.5" />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-brand"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${value} 100`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-small font-extrabold text-ink">
        {value}%
      </span>
    </div>
  );
}
