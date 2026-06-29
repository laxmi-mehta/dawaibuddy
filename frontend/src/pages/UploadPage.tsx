import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { UploadCard } from "@/features/prescriptions/components/UploadCard";
import { ScanTips } from "@/features/prescriptions/components/ScanTips";

export default function UploadPage() {
  return (
    <>
      <AppHeader
        title="Upload prescription"
        subtitle="Scan or import your prescription to get started"
        actions={
          <Link to="/upload/review">
            <Button variant="ghost" size="sm">
              Skip to results
            </Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <UploadCard />
          <ScanTips />
        </div>
      </div>
    </>
  );
}
