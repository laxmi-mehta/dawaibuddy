import type { ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  Heart,
  Leaf,
  type LucideIcon,
  MessageCircle,
  Pill,
  Plus,
  ScanLine,
  Shield,
  Sparkles,
  Stethoscope,
  Upload,
  User,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, Chip } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Toggle } from "@/components/ui/toggle";
import { Logo } from "@/components/shared/Logo";
import { IconBadge } from "@/components/shared/IconBadge";
import { MedicineCard } from "@/components/shared/MedicineCard";
import { AdherenceCard } from "@/components/shared/AdherenceCard";
import { SeverityPill } from "@/components/shared/SeverityPill";
import { cn } from "@/lib/utils";

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-h3 font-extrabold text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-small text-muted">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function Swatch({ className, label, border }: { className: string; label: string; border?: boolean }) {
  return (
    <div>
      <div className={cn("h-16 rounded-md", border && "border border-line", className)} />
      <p className="mt-1.5 text-tiny text-muted">{label}</p>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-tiny font-bold uppercase tracking-wider text-muted">{children}</p>;
}

const ICONS: LucideIcon[] = [
  Pill, ScanLine, Upload, Camera, Bell, Calendar, Shield, Sparkles,
  MessageCircle, Heart, Leaf, Stethoscope, User, CheckCircle2, Plus, ArrowRight,
];

const FLOW = ["Landing", "Sign up", "Upload Rx", "OCR review", "Medicine info", "Interactions", "Reminders", "AI Assistant"];

export default function DesignSystemPage() {
  return (
    <>
      <AppHeader title="Design system" subtitle="Tokens, components & user flow · DawaiBuddy" />

      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Brand */}
        <Section title="Brand" subtitle="Logo, tagline and identity.">
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-lg border border-line p-4"><Logo /></div>
            <div className="rounded-lg bg-ink p-4"><Logo tone="dark" /></div>
          </div>
          <p className="mt-4 text-body-lg font-bold text-brand">"Understand your medicines with confidence."</p>
        </Section>

        {/* Colour palette */}
        <Section title="Colour palette" subtitle="Blue is primary, teal is the supportive accent.">
          <Label>Brand &amp; accent</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch className="bg-brand-700" label="Brand 700" />
            <Swatch className="bg-brand" label="Brand" />
            <Swatch className="bg-brand-100" label="Brand 100" />
            <Swatch className="bg-brand-50" label="Brand 50" border />
            <Swatch className="bg-accent-600" label="Accent 600" />
            <Swatch className="bg-accent" label="Accent" />
            <Swatch className="bg-accent-100" label="Accent 100" />
            <Swatch className="bg-accent-50" label="Accent 50" border />
          </div>
          <Label>Neutrals</Label>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            <Swatch className="bg-ink" label="Ink" />
            <Swatch className="bg-ink-2" label="Ink-2" />
            <Swatch className="bg-muted" label="Muted" />
            <Swatch className="bg-line" label="Line" />
            <Swatch className="bg-bg" label="BG" border />
            <Swatch className="bg-surface" label="Surface" border />
          </div>
          <Label>Status</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Swatch className="bg-success" label="Success" />
            <Swatch className="bg-warning" label="Warning" />
            <Swatch className="bg-danger" label="Danger" />
            <Swatch className="bg-info" label="Info" />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" subtitle="Plus Jakarta Sans · tight tracking on headings, comfortable line-height on body.">
          <div className="space-y-2">
            <p className="text-display font-extrabold text-ink">Display / 48</p>
            <p className="text-h1 font-extrabold text-ink">Heading 1 / 32 · 800</p>
            <p className="text-h2 font-extrabold text-ink">Heading 2 / 24 · 800</p>
            <p className="text-h3 font-extrabold text-ink">Heading 3 / 19 · 800</p>
            <p className="text-body-lg text-ink-2">Body large / 18 — readable copy for elderly-friendly screens.</p>
            <p className="text-body text-ink-2">Body / 16 — the default reading size across the app.</p>
            <p className="text-small text-muted">Small / 14 — secondary information and metadata.</p>
            <p className="text-tiny text-muted">Tiny / 13 — captions, timestamps and helper text.</p>
          </div>
        </Section>

        {/* Radius, spacing, elevation */}
        <Section title="Radius, spacing & elevation" subtitle="Soft, clinical surfaces with restrained shadows.">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <Label>Radius</Label>
              <div className="flex items-end gap-3">
                <div className="h-14 w-14 rounded-sm bg-brand-100" /><span className="text-tiny text-muted">sm</span>
                <div className="h-14 w-14 rounded-md bg-brand-100" /><span className="text-tiny text-muted">md</span>
                <div className="h-14 w-14 rounded-lg bg-brand-100" /><span className="text-tiny text-muted">lg</span>
              </div>
            </div>
            <div>
              <Label>Elevation</Label>
              <div className="flex gap-3">
                <div className="h-14 w-14 rounded-md bg-surface shadow-soft" />
                <div className="h-14 w-14 rounded-md bg-surface shadow-card" />
                <div className="h-14 w-14 rounded-md bg-surface shadow-float" />
              </div>
            </div>
            <div>
              <Label>Spacing scale</Label>
              <div className="flex items-end gap-2">
                {[6, 10, 16, 24, 36].map((s) => (
                  <div key={s} className="text-center">
                    <div className="rounded-sm bg-accent" style={{ width: 12, height: s }} />
                    <span className="text-tiny text-muted">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" subtitle="Pill buttons with clear hierarchy.">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button size="lg">Large</Button>
            <Button size="default">Default</Button>
            <Button size="sm">Small</Button>
            <Button size="icon"><Plus className="h-5 w-5" /></Button>
            <Button><Upload className="h-5 w-5" /> With icon</Button>
          </div>
        </Section>

        {/* Badges & chips */}
        <Section title="Badges & chips" subtitle="Status and category indicators.">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success"><CheckCircle2 className="h-3.5 w-3.5" /> Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Chip active>Metformin</Chip>
            <Chip>Amlodipine</Chip>
            <Chip>Pantoprazole</Chip>
          </div>
        </Section>

        {/* Form controls */}
        <Section title="Form controls" subtitle="Accessible inputs with 48px+ targets.">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Text input</Label>
              <Input placeholder="Search medicines…" />
            </div>
            <div>
              <Label>Select</Label>
              <Select options={["After food", "Before food", "Any time"]} className="w-full" />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <Checkbox defaultChecked label="Checkbox" />
            <Radio name="ds-radio" defaultChecked label="Radio" />
            <div className="flex items-center gap-2"><Toggle defaultChecked /> <span className="text-small text-ink-2">Toggle</span></div>
          </div>
        </Section>

        {/* Medicine components */}
        <Section title="Medicine components" subtitle="Domain-specific building blocks.">
          <div className="grid gap-4 sm:grid-cols-2">
            <MedicineCard name="Glycomet 500 SR" detail="Metformin · 500 mg" />
            <AdherenceCard value="92%" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <SeverityPill severity="none" />
            <SeverityPill severity="mild" />
            <SeverityPill severity="moderate" />
            <SeverityPill severity="severe" />
          </div>
        </Section>

        {/* Icons */}
        <Section title="Icons" subtitle="Consistent 1.9px stroke, rounded joins (lucide).">
          <div className="flex flex-wrap gap-3">
            {ICONS.map((Icon, i) => (
              <IconBadge key={i} icon={Icon} tone={i % 2 ? "accent" : "brand"} />
            ))}
          </div>
        </Section>

        {/* User flow */}
        <Section title="User flow" subtitle="The core journey through DawaiBuddy.">
          <div className="flex flex-wrap items-center gap-2">
            {FLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-full bg-brand-50 px-3 py-1.5 text-small font-semibold text-brand-700">{step}</span>
                {i < FLOW.length - 1 && <ArrowRight className="h-4 w-4 text-muted" />}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
