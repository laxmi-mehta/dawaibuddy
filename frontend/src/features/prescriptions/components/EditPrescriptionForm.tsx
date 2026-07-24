import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Prescription, PrescriptionMedicine } from "@/types";

type DraftMedicine = PrescriptionMedicine & { key: string };

let tempKeySeq = 0;
function nextKey() {
  tempKeySeq += 1;
  return `edit-temp-${tempKeySeq}`;
}

interface EditPrescriptionFormProps {
  prescription: Prescription;
  onSave: (data: Partial<Prescription>) => Promise<void>;
  onCancel: () => void;
}

export function EditPrescriptionForm({ prescription, onSave, onCancel }: EditPrescriptionFormProps) {
  const { t } = useTranslation();
  const [doctorName, setDoctorName] = useState(prescription.doctor_name);
  const [speciality, setSpeciality] = useState(prescription.speciality);
  const [clinic, setClinic] = useState(prescription.clinic);
  const [prescribedOn, setPrescribedOn] = useState(prescription.prescribed_on ?? "");
  const [medicines, setMedicines] = useState<DraftMedicine[]>(
    prescription.medicines.map((m) => ({ ...m, key: nextKey() }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await onSave({
        doctor_name: doctorName,
        speciality,
        clinic,
        prescribed_on: prescribedOn || null,
        medicines: medicines
          .filter((m) => m.name.trim())
          .map(({ key: _key, id: _id, ...rest }) => rest) as PrescriptionMedicine[],
      });
    } catch {
      setError(t("prescriptions.saveError"));
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          placeholder={t("prescriptions.doctorPlaceholder")}
        />
        <Input
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          placeholder={t("prescriptions.specialityPlaceholder")}
        />
        <Input
          value={clinic}
          onChange={(e) => setClinic(e.target.value)}
          placeholder={t("prescriptions.clinicPlaceholder")}
        />
        <Input
          type="date"
          value={prescribedOn ?? ""}
          onChange={(e) => setPrescribedOn(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {medicines.map((m) => (
          <div key={m.key} className="rounded-md bg-bg p-3">
            <div className="flex items-center gap-2">
              <Input
                value={m.name}
                onChange={(e) => updateMedicine(m.key, { name: e.target.value })}
                placeholder={t("prescriptions.medicineNamePlaceholder")}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeMedicine(m.key)}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-danger hover:bg-danger-bg rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Input
                value={m.dosage}
                onChange={(e) => updateMedicine(m.key, { dosage: e.target.value })}
                placeholder={t("prescriptions.dosagePlaceholder")}
              />
              <Input
                value={m.frequency}
                onChange={(e) => updateMedicine(m.key, { frequency: e.target.value })}
                placeholder={t("prescriptions.frequencyPlaceholder")}
              />
              <Input
                value={m.timing}
                onChange={(e) => updateMedicine(m.key, { timing: e.target.value })}
                placeholder={t("prescriptions.timingPlaceholder")}
              />
              <Input
                value={m.duration}
                onChange={(e) => updateMedicine(m.key, { duration: e.target.value })}
                placeholder={t("prescriptions.durationPlaceholder")}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMedicine}
          className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-line py-3 text-small font-semibold text-brand hover:bg-brand-50"
        >
          <Plus className="h-4 w-4" /> {t("prescriptions.addMedicine")}
        </button>
      </div>

      {error && <p className="text-small text-danger">{error}</p>}

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? t("common.saving") : t("common.saveChanges")}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
          {t("common.cancel")}
        </Button>
      </div>
    </div>
  );
}
