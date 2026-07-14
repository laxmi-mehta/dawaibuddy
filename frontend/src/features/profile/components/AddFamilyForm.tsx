import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/types";

interface AddFamilyFormProps {
  onSubmit: (data: Partial<FamilyMember>) => Promise<void>;
  onCancel: () => void;
  initial?: Partial<FamilyMember>;
}

export function AddFamilyForm({ onSubmit, onCancel, initial }: AddFamilyFormProps) {
  const isEditing = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [relation, setRelation] = useState(initial?.relation ?? "");
  const [age, setAge] = useState(initial?.age != null ? String(initial.age) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name: name.trim(),
        relation: relation.trim(),
        age: age ? Number(age) : null,
      });
    } catch {
      setError(`Could not ${isEditing ? "save" : "add"} family member. Try again.`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md bg-bg p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          autoFocus
        />
        <Input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Relation (e.g. Spouse)"
        />
        <Input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
      </div>
      {error && <p className="text-small text-danger">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? "Saving…" : isEditing ? "Save" : "Add"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
