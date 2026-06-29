import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/** Centered eyebrow + heading + subtitle used by the marketing sections. */
export function SectionHeading({ eyebrow, title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="text-small font-bold uppercase tracking-[0.12em] text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-body-lg leading-relaxed text-muted">{subtitle}</p>}
    </div>
  );
}
