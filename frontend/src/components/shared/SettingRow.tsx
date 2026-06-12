import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { IconBadge } from "@/components/shared/IconBadge";

interface SettingRowProps {
  icon: LucideIcon;
  tone?: "brand" | "accent" | "warning" | "neutral";
  title: string;
  desc?: string;
  /** Right-aligned control (Toggle, Select, chevron…). */
  trailing?: ReactNode;
}

/** Icon + title/desc + trailing control — the Settings/Support list row. */
export function SettingRow({ icon, tone = "brand", title, desc, trailing }: SettingRowProps) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <IconBadge icon={icon} tone={tone} />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ink">{title}</p>
        {desc && <p className="text-small text-muted">{desc}</p>}
      </div>
      {trailing}
    </div>
  );
}
