import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";

interface EditProfileFormProps {
  profile: Profile;
  onSubmit: (data: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
}

export function EditProfileForm({ profile, onSubmit, onCancel }: EditProfileFormProps) {
  const [age, setAge] = useState(profile.age?.toString() ?? "");
  const [bloodGroup, setBloodGroup] = useState(profile.blood_group);
  const [heightCm, setHeightCm] = useState(profile.height_cm?.toString() ?? "");
  const [weightKg, setWeightKg] = useState(profile.weight_kg?.toString() ?? "");
  const [conditions, setConditions] = useState(profile.conditions.join(", "));
  const [allergies, setAllergies] = useState(profile.allergies.join(", "));
  const [submitting, setSubmitting] = useState(false);

  function toList(value: string): string[] {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        age: age ? Number(age) : null,
        blood_group: bloodGroup,
        height_cm: heightCm ? Number(heightCm) : null,
        weight_kg: weightKg ? Number(weightKg) : null,
        conditions: toList(conditions),
        allergies: toList(allergies),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-small font-semibold text-ink">Age</label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-small font-semibold text-ink">Blood group</label>
          <Input
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            placeholder="O+"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-small font-semibold text-ink">Height (cm)</label>
          <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-small font-semibold text-ink">Weight (kg)</label>
          <Input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-small font-semibold text-ink">
            Conditions (comma separated)
          </label>
          <Input value={conditions} onChange={(e) => setConditions(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-small font-semibold text-ink">
            Allergies (comma separated)
          </label>
          <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
