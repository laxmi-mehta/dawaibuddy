import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UploadCard } from "@/features/prescriptions/components/UploadCard";
import { ScanTips } from "@/features/prescriptions/components/ScanTips";
import { prescriptionsService } from "@/services/prescriptions.service";
import type { PrescriptionOcrDraft } from "@/types";

const EMPTY_DRAFT: PrescriptionOcrDraft = {
  ocr_available: false,
  raw_text: "",
  doctor_name: "",
  speciality: "",
  clinic: "",
  prescribed_on: null,
  medicines: [],
};

export default function UploadPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setScanning(true);
    setError(null);
    try {
      const draft = await prescriptionsService.ocr(file);
      navigate("/upload/review", { state: { draft, previewUrl: URL.createObjectURL(file) } });
    } catch {
      setError(t("upload.scanError"));
    } finally {
      setScanning(false);
    }
  }

  return (
    <>
      <AppHeader
        title={t("upload.title")}
        subtitle={t("upload.subtitle")}
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/upload/review", { state: { draft: EMPTY_DRAFT } })}
          >
            {t("upload.enterManually")}
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        {error && (
          <Card className="mb-5 border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}
        {scanning && <Card className="mb-5 p-5 text-body text-muted">{t("upload.scanning")}</Card>}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <UploadCard onFileSelected={handleFile} disabled={scanning} />
          <ScanTips />
        </div>
      </div>
    </>
  );
}
