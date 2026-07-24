import { useRef, useState } from "react";
import { Camera, FileText, Upload, UploadCloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tab = "drag" | "camera" | "pdf";

const FORMAT_CHIPS = ["JPG", "PNG", "PDF", "Max 10MB"];

interface UploadCardProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

/** Upload methods (drag-drop / camera / pdf) — all feed the same onFileSelected handler. */
export function UploadCard({ onFileSelected, disabled }: UploadCardProps) {
  const { t } = useTranslation();
  const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
    { id: "drag", label: t("upload.dragDrop"), icon: Upload },
    { id: "camera", label: t("upload.camera"), icon: Camera },
    { id: "pdf", label: t("upload.pdf"), icon: FileText },
  ];
  const [tab, setTab] = useState<Tab>("drag");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <Card className="p-5">
      {/* Segmented tabs */}
      <div className="flex rounded-lg bg-bg p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-small font-semibold transition-colors",
              tab === id ? "bg-surface text-brand shadow-soft" : "text-muted hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={2} />
            {label}
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={tab === "pdf" ? "application/pdf" : "image/*"}
        capture={tab === "camera" ? "environment" : undefined}
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={cn(
          "mt-5 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors",
          dragOver ? "border-brand bg-brand-50" : "border-line bg-bg/40",
          disabled ? "opacity-60" : "cursor-pointer hover:bg-bg/70"
        )}
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand">
          {tab === "camera" ? (
            <Camera className="h-7 w-7" strokeWidth={1.9} />
          ) : tab === "pdf" ? (
            <FileText className="h-7 w-7" strokeWidth={1.9} />
          ) : (
            <UploadCloud className="h-7 w-7" strokeWidth={1.9} />
          )}
        </span>

        {tab === "camera" ? (
          <>
            <p className="text-h3 font-extrabold text-ink">{t("upload.useCamera")}</p>
            <p className="text-body text-muted">{t("upload.useCameraDesc")}</p>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-2 rounded-full bg-brand px-6 py-2.5 text-small font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {t("upload.openCamera")}
            </button>
          </>
        ) : tab === "pdf" ? (
          <>
            <p className="text-h3 font-extrabold text-ink">{t("upload.importPdf")}</p>
            <p className="text-body text-muted">
              {t("common.orLowercase")}{" "}
              <span className="font-bold text-brand">{t("upload.browseFiles")}</span>{" "}
              {t("upload.browseFilesSuffix")}
            </p>
          </>
        ) : (
          <>
            <p className="text-h3 font-extrabold text-ink">{t("upload.dragDropTitle")}</p>
            <p className="text-body text-muted">
              {t("common.orLowercase")}{" "}
              <span className="font-bold text-brand">{t("upload.browseFiles")}</span>{" "}
              {t("upload.browseFilesSuffix")}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {FORMAT_CHIPS.map((c) => (
                <span
                  key={c}
                  className="rounded-md bg-bg px-2.5 py-1 text-tiny font-semibold text-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
