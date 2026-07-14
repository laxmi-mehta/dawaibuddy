import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Reminder, ReminderBucketValue } from "@/types";

const BUCKET_LABELS: Record<string, ReminderBucketValue> = {
  Morning: "morning",
  Afternoon: "afternoon",
  Evening: "evening",
  Night: "night",
};

interface AddReminderFormProps {
  onSubmit: (data: Partial<Reminder>) => Promise<void>;
  onCancel: () => void;
  initial?: Partial<Reminder>;
}

export function AddReminderForm({ onSubmit, onCancel, initial }: AddReminderFormProps) {
  const [medicineName, setMedicineName] = useState(initial?.medicine_name ?? "");
  const [dosage, setDosage] = useState(initial?.dosage ?? "");
  const [scheduledTime, setScheduledTime] = useState(
    initial?.scheduled_time?.slice(0, 5) ?? "08:00"
  );
  const [bucketLabel, setBucketLabel] = useState("Morning");
  const [instruction, setInstruction] = useState(initial?.instruction ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!medicineName.trim()) {
      setError("Medicine name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        medicine_name: medicineName.trim(),
        dosage: dosage.trim(),
        scheduled_time: `${scheduledTime}:00`,
        bucket: BUCKET_LABELS[bucketLabel],
        instruction: instruction.trim(),
      });
    } catch {
      setError("Could not save reminder. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-small font-semibold text-ink">Medicine name</label>
            <Input
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Glycomet 500 SR"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-small font-semibold text-ink">Dosage</label>
            <Input
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 500 mg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-small font-semibold text-ink">Time</label>
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-small font-semibold text-ink">Time of day</label>
            <Select
              options={Object.keys(BUCKET_LABELS)}
              value={bucketLabel}
              onChange={(e) => setBucketLabel(e.target.value)}
              className="h-12 w-full"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-small font-semibold text-ink">
              Instruction (optional)
            </label>
            <Input
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. after breakfast"
            />
          </div>
        </div>

        {error && <p className="text-small text-danger">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" size="sm" disabled={submitting}>
            {submitting ? "Saving…" : "Save reminder"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
