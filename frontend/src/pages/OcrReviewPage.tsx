import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Pencil,
  Pill,
  Plus,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";

interface Extracted {
  name: string;
  salt: string;
  confidence: number;
  dosage: string;
  frequency: string;
  when: string;
  duration: string;
}

const MEDS: Extracted[] = [
  { name: "Glycomet 500 SR", salt: "Metformin · Anti-diabetic", confidence: 98, dosage: "500 mg", frequency: "1-0-1", when: "After food", duration: "90 days" },
  { name: "Pan 40", salt: "Pantoprazole · Acid reducer", confidence: 86, dosage: "40 mg", frequency: "1-0-0", when: "Before breakfast", duration: "30 days" },
];

function Field({ icon: Icon, label, value }: { icon: typeof Pill; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-tiny font-bold uppercase tracking-wide text-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="mt-1 font-bold text-ink">{value}</p>
    </div>
  );
}

function ExtractedMedicineCard({ med }: { med: Extracted }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconBadge icon={Pill} tone="brand" />
          <div>
            <p className="font-extrabold text-ink">{med.name} <span className="text-small font-normal text-muted">{med.salt}</span></p>
            <Badge variant={med.confidence >= 90 ? "success" : "warning"} size="sm" className="mt-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> {med.confidence} % confident
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /> Edit</Button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field icon={Pill} label="Dosage" value={med.dosage} />
        <Field icon={Clock} label="Frequency" value={med.frequency} />
        <Field icon={Sun} label="When" value={med.when} />
        <Field icon={CalendarDays} label="Duration" value={med.duration} />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <p className="text-tiny text-muted">Frequency shown as Morning-Noon-Night</p>
        <div className="flex items-center gap-4">
          <Link to="/medicines" className="flex items-center gap-1 text-small font-semibold text-brand hover:underline">
            Medicine info <ArrowRight className="h-4 w-4" />
          </Link>
          <button type="button" className="flex items-center gap-1 text-small font-semibold text-danger hover:underline">
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      </div>
    </Card>
  );
}

export default function OcrReviewPage() {
  return (
    <>
      <AppHeader
        title="Review extracted details"
        subtitle="Check what we read — edit anything that looks off"
        actions={
          <Link to="/dashboard">
            <Button size="sm"><CheckCircle2 className="h-4 w-4" /> Confirm & save</Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left */}
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-lg bg-accent-50 p-5">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" strokeWidth={1.9} />
              <div>
                <p className="font-bold text-ink">We found 2 medicines</p>
                <p className="text-small text-muted">Review the dosage, frequency and duration below. Tap any field to correct it before saving.</p>
              </div>
            </div>

            {MEDS.map((m) => <ExtractedMedicineCard key={m.name} med={m} />)}

            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-4 font-semibold text-brand hover:bg-brand-50">
              <Plus className="h-5 w-5" /> Add a medicine manually
            </button>

            <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
              <div>
                <p className="font-bold text-ink">Ready to save?</p>
                <p className="text-small text-muted">We'll add these to your medicines and set reminders.</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">Original scan</h3>
                <Badge variant="success" size="sm"><CheckCircle2 className="h-3.5 w-3.5" /> Processed</Badge>
              </div>
              <div className="mt-4 flex h-56 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-bg/40 text-muted">
                <ImageIcon className="h-8 w-8" strokeWidth={1.6} />
                <p className="text-small">Drop prescription scan</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="ghost" size="sm"><ZoomIn className="h-4 w-4" /> Zoom</Button>
                <Button variant="ghost" size="sm"><RotateCw className="h-4 w-4" /> Re-scan</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Prescription details</h3>
              <dl className="mt-4 space-y-3 text-small">
                {[
                  ["Doctor", "Dr. Meera Nair"],
                  ["Speciality", "Diabetology"],
                  ["Clinic", "Apollo Clinic, Indiranagar"],
                  ["Date", "2 Jun 2026"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-bold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
