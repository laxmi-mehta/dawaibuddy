import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Droplet,
  Pencil,
  Pill,
  Plus,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";
import { cn } from "@/lib/utils";

const HEALTH: { icon: LucideIcon; label: string; value: string }[] = [
  { icon: User, label: "Age", value: "42 years" },
  { icon: Droplet, label: "Blood group", value: "O+" },
  { icon: Activity, label: "Height", value: "176 cm" },
  { icon: Activity, label: "Weight", value: "78 kg" },
];

const ADHERENCE = [
  { label: "This week", pct: 92 },
  { label: "This month", pct: 88 },
];

const FAMILY = [
  { initials: "PK", name: "Priya Kapoor", rel: "Spouse · 39" },
  { initials: "RK", name: "Riya Kapoor", rel: "Daughter · 12" },
];

const MEDS = [
  { name: "Glycomet 500 SR", tag: "Anti-diabetic" },
  { name: "Amlong 5", tag: "Anti-hypertensive" },
  { name: "Atorva 10", tag: "Lipid-lowering" },
  { name: "Pan 40", tag: "Acid reducer" },
];

export default function ProfilePage() {
  return (
    <>
      <AppHeader
        title="My profile"
        subtitle="Your health information & saved medicines"
        actions={
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Cover */}
        <Card className="overflow-hidden">
          <div className="h-28 bg-brand-gradient" />
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-brand-100 text-h2 font-extrabold text-brand-700">
                AK
              </span>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-h2 font-extrabold text-ink">Aarav Kapoor</h2>
                  <Badge variant="accent" size="sm">
                    Plus member
                  </Badge>
                </div>
                <p className="mt-1 text-small text-muted">
                  aarav.kapoor@email.com · +91 98765 43210
                </p>
              </div>
            </div>
            <Link to="#" className={cn(buttonVariants({ size: "sm" }))}>
              <Pencil className="h-4 w-4" /> Edit
            </Link>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Health profile</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {HEALTH.map((h) => (
                  <div key={h.label} className="flex items-center gap-3 rounded-md bg-bg p-4">
                    <IconBadge icon={h.icon} tone="brand" />
                    <div>
                      <p className="text-small text-muted">{h.label}</p>
                      <p className="font-bold text-ink">{h.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Conditions &amp; allergies</h3>
              <p className="mt-4 text-tiny font-bold uppercase tracking-wider text-muted">
                Ongoing conditions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Type 2 Diabetes", "Hypertension", "High cholesterol"].map((c) => (
                  <Badge key={c} variant="brand" size="sm">
                    {c}
                  </Badge>
                ))}
              </div>
              <p className="mt-4 text-tiny font-bold uppercase tracking-wider text-muted">
                Allergies
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Penicillin", "Sulfa drugs"].map((a) => (
                  <Badge key={a} variant="danger" size="sm">
                    <AlertTriangle className="h-3.5 w-3.5" /> {a}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">My medicines</h3>
                <Badge variant="default" size="sm">
                  {MEDS.length}
                </Badge>
              </div>
              <ul className="mt-2 divide-y divide-line">
                {MEDS.map((m) => (
                  <li key={m.name} className="flex items-center gap-3 py-3.5">
                    <IconBadge icon={Pill} tone="brand" />
                    <span className="flex-1 font-bold text-ink">{m.name}</span>
                    <Badge variant="brand" size="sm">
                      {m.tag}
                    </Badge>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Adherence</h3>
              <div className="mt-4 space-y-4">
                {ADHERENCE.map((a) => (
                  <div key={a.label}>
                    <div className="flex items-center justify-between text-small">
                      <span className="text-muted">{a.label}</span>
                      <span className="font-bold text-success">{a.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{ width: `${a.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">Family</h3>
                <Button variant="soft" size="sm">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              <ul className="mt-2 divide-y divide-line">
                {FAMILY.map((f) => (
                  <li key={f.name} className="flex items-center gap-3 py-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-small font-bold text-accent-600">
                      {f.initials}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-ink">{f.name}</p>
                      <p className="text-small text-muted">{f.rel}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
