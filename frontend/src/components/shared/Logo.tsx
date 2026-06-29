import { Pill } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** 'dark' for use on dark backgrounds (footer, auth panel). */
  tone?: "light" | "dark";
  className?: string;
}

/** DawaiBuddy wordmark: brand mark + "Dawai" + brand-blue "Buddy". */
export function Logo({ tone = "light", className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white">
        <Pill className="h-5 w-5" strokeWidth={2} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-accent" />
      </span>
      <span className="text-h3 font-extrabold tracking-tight">
        <span className={tone === "dark" ? "text-white" : "text-ink"}>Dawai</span>
        <span className="text-brand">Buddy</span>
      </span>
    </span>
  );
}
