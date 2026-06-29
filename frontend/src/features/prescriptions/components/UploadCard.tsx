import { useState } from "react";
import { Camera, FileText, Upload, UploadCloud } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tab = "drag" | "camera" | "pdf";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "drag", label: "Drag & drop", icon: Upload },
  { id: "camera", label: "Camera", icon: Camera },
  { id: "pdf", label: "PDF", icon: FileText },
];

const FORMAT_CHIPS = ["JPG", "PNG", "PDF", "Max 10MB"];

/** Upload methods (drag-drop / camera / pdf) with a dropzone. UI only — no OCR. */
export function UploadCard() {
  const [tab, setTab] = useState<Tab>("drag");

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

      {/* Dropzone */}
      <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-line bg-bg/40 px-6 py-14 text-center">
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
            <p className="text-h3 font-extrabold text-ink">Use your camera</p>
            <p className="text-body text-muted">
              Point at the prescription and capture a clear photo.
            </p>
            <button
              type="button"
              className="mt-2 rounded-full bg-brand px-6 py-2.5 text-small font-semibold text-white hover:bg-brand-600"
            >
              Open camera
            </button>
          </>
        ) : tab === "pdf" ? (
          <>
            <p className="text-h3 font-extrabold text-ink">Import a PDF</p>
            <p className="text-body text-muted">
              or <span className="font-bold text-brand">browse files</span> from your device
            </p>
          </>
        ) : (
          <>
            <p className="text-h3 font-extrabold text-ink">Drag &amp; drop your prescription</p>
            <p className="text-body text-muted">
              or <span className="font-bold text-brand">browse files</span> from your device
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
