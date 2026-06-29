import { Link } from "react-router-dom";
import { CheckCircle2, Leaf, Lock, Play, ScanLine, ShieldCheck, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: CheckCircle2, label: "Free to start" },
  { icon: Lock, label: "Private & encrypted" },
  { icon: ShieldCheck, label: "Doctor-reviewed" },
];

/** Landing hero — headline, dual CTAs, trust row, floating "Rx scanned" preview card. */
export function Hero() {
  return (
    <section className="bg-hero">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:py-24">
        {/* Copy */}
        <div>
          <p className="flex items-center gap-2 text-small font-bold text-accent-600">
            <ShieldCheck className="h-4 w-4" strokeWidth={2} />
            Built for India · Trusted by 50,000+ families
          </p>

          <h1 className="mt-5 text-[2.75rem] font-extrabold leading-[1.05] text-ink sm:text-5xl lg:text-[3.5rem]">
            Understand your medicines with <span className="text-brand">confidence.</span>
          </h1>

          <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-muted">
            Scan any prescription and instantly know what each medicine does, how to take it, and
            whether it's safe — all in plain language.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              <Upload className="h-5 w-5" strokeWidth={2} />
              Scan a prescription
            </Link>
            <a
              href="#how-it-works"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
            >
              <Play className="h-5 w-5" strokeWidth={2} />
              See live demo
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-small text-muted">
                <Icon className="h-4 w-4 text-accent-600" strokeWidth={2} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Preview card */}
        <div className="relative">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-float">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <IconBadge icon={ScanLine} tone="brand" />
                <div>
                  <p className="font-bold text-ink">Rx scanned</p>
                  <p className="text-small text-muted">2 medicines found</p>
                </div>
              </div>
              <Badge variant="success">
                <CheckCircle2 className="h-3.5 w-3.5" /> Done
              </Badge>
            </div>

            {[
              {
                name: "Glycomet 500 SR",
                meta: "500 mg · After food",
                tag: "Anti-diabetic",
                tone: "brand" as const,
              },
              {
                name: "Amlong 5",
                meta: "5 mg · Any time",
                tag: "Anti-hypertensive",
                tone: "accent" as const,
              },
            ].map((m) => (
              <div key={m.name} className="flex items-center justify-between gap-3 py-4">
                <div className="flex items-center gap-3">
                  <IconBadge icon={Leaf} tone={m.tone} />
                  <div>
                    <p className="font-bold text-ink">{m.name}</p>
                    <p className="text-small text-muted">{m.meta}</p>
                  </div>
                </div>
                <Badge variant={m.tone}>{m.tag}</Badge>
              </div>
            ))}
          </div>

          {/* Floating savings chip */}
          <div className="absolute -left-3 -top-4 flex items-center gap-2 rounded-md bg-surface p-3 shadow-float sm:-left-6">
            <IconBadge icon={Leaf} tone="accent" size="sm" />
            <div>
              <p className="text-small font-bold text-ink">₹420/mo saved</p>
              <p className="text-tiny text-muted">with generics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
