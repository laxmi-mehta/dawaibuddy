import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FamilyMember } from "@/types";

interface AddFamilyFormProps {
  onSubmit: (data: Partial<FamilyMember>) => Promise<void>;
  onCancel: () => void;
  initial?: Partial<FamilyMember>;
}

export function AddFamilyForm({ onSubmit, onCancel, initial }: AddFamilyFormProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [relation, setRelation] = useState(initial?.relation ?? "");
  const [age, setAge] = useState(initial?.age != null ? String(initial.age) : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("profile.nameRequiredError"));
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
      setError(isEditing ? t("profile.saveFamilyError") : t("profile.addFamilyError"));
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
          placeholder={t("profile.nameLabel")}
          autoFocus
        />
        <Input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder={t("profile.relationLabel")}
        />
        <Input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder={t("profile.ageLabel")}
        />
      </div>
      {error && <p className="text-small text-danger">{error}</p>}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? t("common.saving") : isEditing ? t("common.save") : t("common.add")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
