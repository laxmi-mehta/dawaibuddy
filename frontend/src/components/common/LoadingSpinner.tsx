import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent",
        className
      )}
      role="status"
      aria-label={t("common.loading")}
    />
  );
}
