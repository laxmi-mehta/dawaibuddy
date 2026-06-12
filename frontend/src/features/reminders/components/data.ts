import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Dose {
  name: string;
  meta: string;
  taken: boolean;
  tone: "brand" | "accent";
}

export interface Bucket {
  label: string;
  range: string;
  icon: LucideIcon;
  tone: "warning" | "accent" | "brand";
  doses: Dose[];
}

export const BUCKETS: Bucket[] = [
  {
    label: "Morning",
    range: "6am – 12pm",
    icon: Sunrise,
    tone: "warning",
    doses: [
      { name: "Glycomet 500 SR", meta: "500 mg · 08:00 · Morning · after breakfast", taken: true, tone: "brand" },
      { name: "Pan 40", meta: "40 mg · 07:30 · Before breakfast", taken: true, tone: "brand" },
      { name: "Amlong 5", meta: "5 mg · 09:00 · Morning", taken: false, tone: "accent" },
    ],
  },
  {
    label: "Afternoon",
    range: "12pm – 5pm",
    icon: Sun,
    tone: "warning",
    doses: [{ name: "Cetzine 10", meta: "10 mg · 14:00 · Afternoon", taken: false, tone: "accent" }],
  },
  {
    label: "Evening",
    range: "5pm – 9pm",
    icon: Sunset,
    tone: "accent",
    doses: [{ name: "Glycomet 500 SR", meta: "500 mg · 20:00 · Evening · after dinner", taken: false, tone: "brand" }],
  },
  {
    label: "Night",
    range: "9pm – 12am",
    icon: Moon,
    tone: "brand",
    doses: [{ name: "Atorva 10", meta: "10 mg · 22:00 · Night", taken: false, tone: "brand" }],
  },
];

export const TOTAL_DOSES = BUCKETS.reduce((n, b) => n + b.doses.length, 0);
export const TAKEN_DOSES = BUCKETS.reduce((n, b) => n + b.doses.filter((d) => d.taken).length, 0);
export const PROGRESS_PCT = Math.round((TAKEN_DOSES / TOTAL_DOSES) * 100);
