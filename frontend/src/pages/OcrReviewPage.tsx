import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
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
import { Input } from "@/components/ui/input";
import { IconBadge } from "@/components/shared/IconBadge";
import { prescriptionsService } from "@/services/prescriptions.service";
import type { PrescriptionMedicine, PrescriptionOcrDraft } from "@/types";

type DraftMedicine = PrescriptionMedicine & { key: string };

let tempKeySeq = 0;
function nextKey() {
  tempKeySeq += 1;
  return `temp-${tempKeySeq}`;
}

function toDraftMedicines(medicines: PrescriptionMedicine[]): DraftMedicine[] {
  return medicines.map((m) => ({ ...m, key: nextKey() }));
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
}: {
  icon: typeof Pill;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-tiny font-bold uppercase tracking-wide text-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border-b border-transparent bg-transparent font-bold text-ink focus-visible:border-brand focus-visible:outline-none"
      />
    </div>
  );
}

function ExtractedMedicineCard({
  med,
  onChange,
  onRemove,
}: {
  med: DraftMedicine;
  onChange: (patch: Partial<PrescriptionMedicine>) => void;
  onRemove: () => void;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <IconBadge icon={Pill} tone="brand" />
          <div className="flex-1">
            <input
              value={med.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Medicine name"
              className="w-full border-b border-transparent bg-transparent font-extrabold text-ink focus-visible:border-brand focus-visible:outline-none"
            />
            <input
              value={med.salt}
              onChange={(e) => onChange({ salt: e.target.value })}
              placeholder="Salt / category"
              className="mt-0.5 w-full border-b border-transparent bg-transparent text-small text-muted focus-visible:border-brand focus-visible:outline-none"
            />
            {med.confidence != null && (
              <Badge
                variant={med.confidence >= 90 ? "success" : "warning"}
                size="sm"
                className="mt-1"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> {med.confidence}% confident
              </Badge>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 text-small font-semibold text-danger hover:underline"
        >
          <Trash2 className="h-4 w-4" /> Remove
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Field
          icon={Pill}
          label="Dosage"
          value={med.dosage}
          onChange={(v) => onChange({ dosage: v })}
        />
        <Field
          icon={Clock}
          label="Frequency"
          value={med.frequency}
          onChange={(v) => onChange({ frequency: v })}
        />
        <Field
          icon={Sun}
          label="When"
          value={med.timing}
          onChange={(v) => onChange({ timing: v })}
        />
        <Field
          icon={CalendarDays}
          label="Duration"
          value={med.duration}
          onChange={(v) => onChange({ duration: v })}
        />
      </div>
    </Card>
  );
}

export default function OcrReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { draft?: PrescriptionOcrDraft; previewUrl?: string } | null;

  const [medicines, setMedicines] = useState<DraftMedicine[]>(
    toDraftMedicines(state?.draft?.medicines ?? [])
  );
  const [doctorName, setDoctorName] = useState(state?.draft?.doctor_name ?? "");
  const [speciality, setSpeciality] = useState(state?.draft?.speciality ?? "");
  const [clinic, setClinic] = useState(state?.draft?.clinic ?? "");
  const [prescribedOn, setPrescribedOn] = useState(state?.draft?.prescribed_on ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!state?.draft) {
    return (
      <>
        <AppHeader title="Review extracted details" />
        <div className="mx-auto max-w-2xl p-6">
          <Card className="flex flex-col items-center gap-3 p-16 text-center">
            <ImageIcon className="h-10 w-10 text-muted" strokeWidth={1.6} />
            <p className="text-h3 font-extrabold text-ink">No scan to review</p>
            <p className="text-body text-muted">Upload a prescription first.</p>
            <Link to="/upload" className="mt-2">
              <Button size="sm">Go to upload</Button>
            </Link>
          </Card>
        </div>
      </>
    );
  }

  function updateMedicine(key: string, patch: Partial<PrescriptionMedicine>) {
    setMedicines((prev) => prev.map((m) => (m.key === key ? { ...m, ...patch } : m)));
  }

  function removeMedicine(key: string) {
    setMedicines((prev) => prev.filter((m) => m.key !== key));
  }

  function addMedicine() {
    setMedicines((prev) => [
      ...prev,
      {
        key: nextKey(),
        id: "",
        name: "",
        salt: "",
        dosage: "",
        frequency: "",
        timing: "",
        duration: "",
        confidence: null,
      },
    ]);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await prescriptionsService.create({
        doctor_name: doctorName,
        speciality,
        clinic,
        prescribed_on: prescribedOn || null,
        status: "ready",
        source: "scan",
        medicines: medicines
          .filter((m) => m.name.trim())
          .map(({ key: _key, id: _id, ...rest }) => rest) as PrescriptionMedicine[],
      });
      navigate("/prescriptions");
    } catch {
      setError("Could not save this prescription. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AppHeader
        title="Review extracted details"
        subtitle="Check what we read — edit anything that looks off"
        actions={
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <CheckCircle2 className="h-4 w-4" /> {saving ? "Saving…" : "Confirm & save"}
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        {error && (
          <Card className="mb-5 border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Left */}
          <div className="space-y-5">
            {state.draft.ocr_available ? (
              <div className="flex items-start gap-3 rounded-lg bg-accent-50 p-5">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent-600" strokeWidth={1.9} />
                <div>
                  <p className="font-bold text-ink">We found {medicines.length} medicine(s)</p>
                  <p className="text-small text-muted">
                    Review the dosage, frequency and duration below. Edit any field to correct it
                    before saving.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-lg bg-warning-bg p-5">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-warning" strokeWidth={1.9} />
                <div>
                  <p className="font-bold text-ink">OCR isn't available on this server</p>
                  <p className="text-small text-muted">
                    Add the medicines from this prescription manually below.
                  </p>
                </div>
              </div>
            )}

            {medicines.map((m) => (
              <ExtractedMedicineCard
                key={m.key}
                med={m}
                onChange={(patch) => updateMedicine(m.key, patch)}
                onRemove={() => removeMedicine(m.key)}
              />
            ))}

            <button
              type="button"
              onClick={addMedicine}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-4 font-semibold text-brand hover:bg-brand-50"
            >
              <Plus className="h-5 w-5" /> Add a medicine manually
            </button>

            <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" strokeWidth={1.9} />
              <div>
                <p className="font-bold text-ink">Ready to save?</p>
                <p className="text-small text-muted">
                  We'll add this to your history and set daily reminders for any medicine with a
                  recognized dose schedule (e.g. 1-0-1).
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">Original scan</h3>
                {state.previewUrl && (
                  <Badge variant="success" size="sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Processed
                  </Badge>
                )}
              </div>
              {state.previewUrl ? (
                <img
                  src={state.previewUrl}
                  alt="Prescription scan"
                  className="mt-4 h-56 w-full rounded-lg border border-line object-contain bg-bg/40"
                />
              ) : (
                <div className="mt-4 flex h-56 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-bg/40 text-muted">
                  <ImageIcon className="h-8 w-8" strokeWidth={1.6} />
                  <p className="text-small">No scan (manual entry)</p>
                </div>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!state.previewUrl}
                  onClick={() => state.previewUrl && window.open(state.previewUrl, "_blank")}
                >
                  <ZoomIn className="h-4 w-4" /> Zoom
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/upload")}>
                  <RotateCw className="h-4 w-4" /> Re-scan
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Prescription details</h3>
              <div className="mt-4 space-y-3">
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Doctor"
                />
                <Input
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  placeholder="Speciality"
                />
                <Input
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  placeholder="Clinic"
                />
                <Input
                  type="date"
                  value={prescribedOn ?? ""}
                  onChange={(e) => setPrescribedOn(e.target.value)}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
