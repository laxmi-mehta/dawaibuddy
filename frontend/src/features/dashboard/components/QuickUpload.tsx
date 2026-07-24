import { Link } from "react-router-dom";
import { Camera, Upload, UploadCloud, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Dashboard "Quick upload" promo with a CTA pair and a dropzone preview. */
export function QuickUpload() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 rounded-xl border border-brand-100 bg-hero p-6 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="flex items-center gap-1.5 text-small font-bold text-brand">
          <Zap className="h-4 w-4" fill="currentColor" strokeWidth={0} /> {t("dashboard.quickUpload")}
        </p>
        <h2 className="mt-2 text-h2 font-extrabold text-ink">{t("dashboard.scanNewPrescription")}</h2>
        <p className="mt-2 max-w-md text-body text-muted">{t("dashboard.scanDescription")}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link to="/upload" className={cn(buttonVariants({ variant: "primary" }))}>
            <Upload className="h-5 w-5" strokeWidth={2} /> {t("dashboard.upload")}
          </Link>
          <Link to="/upload" className={cn(buttonVariants({ variant: "ghost" }))}>
            <Camera className="h-5 w-5" strokeWidth={2} /> {t("dashboard.useCamera")}
          </Link>
        </div>
      </div>

      <Link
        to="/upload"
        className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-200 bg-surface/60 p-8 text-center transition-colors hover:bg-surface"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand">
          <UploadCloud className="h-6 w-6" strokeWidth={1.9} />
        </span>
        <p className="font-bold text-ink">{t("dashboard.dropFileHere")}</p>
        <p className="text-small text-muted">{t("dashboard.fileFormats")}</p>
      </Link>
    </div>
  );
}
