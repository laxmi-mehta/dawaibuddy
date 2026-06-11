import { Link } from "react-router-dom";
import { Camera, Upload, UploadCloud, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Dashboard "Quick upload" promo with a CTA pair and a dropzone preview. */
export function QuickUpload() {
  return (
    <div className="grid gap-6 rounded-xl border border-brand-100 bg-hero p-6 lg:grid-cols-2 lg:items-center">
      <div>
        <p className="flex items-center gap-1.5 text-small font-bold text-brand">
          <Zap className="h-4 w-4" fill="currentColor" strokeWidth={0} /> Quick upload
        </p>
        <h2 className="mt-2 text-h2 font-extrabold text-ink">Scan a new prescription</h2>
        <p className="mt-2 max-w-md text-body text-muted">
          Drag a photo, snap with your camera, or import a PDF. We'll extract every medicine for you.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link to="/upload" className={cn(buttonVariants({ variant: "primary" }))}>
            <Upload className="h-5 w-5" strokeWidth={2} /> Upload
          </Link>
          <Link to="/upload" className={cn(buttonVariants({ variant: "ghost" }))}>
            <Camera className="h-5 w-5" strokeWidth={2} /> Use camera
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
        <p className="font-bold text-ink">Drop file here</p>
        <p className="text-small text-muted">JPG, PNG or PDF · up to 10MB</p>
      </Link>
    </div>
  );
}
