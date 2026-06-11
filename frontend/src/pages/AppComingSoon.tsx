import { Hammer } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";

/** Placeholder rendered inside the app shell for screens not yet built. */
export default function AppComingSoon({ title }: { title: string }) {
  return (
    <>
      <AppHeader title={title} subtitle="This screen is coming in a later phase." />
      <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
          <Hammer className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <p className="text-h3 font-extrabold text-ink">{title}</p>
        <p className="max-w-sm text-body text-muted">Under construction — check back soon.</p>
      </div>
    </>
  );
}
