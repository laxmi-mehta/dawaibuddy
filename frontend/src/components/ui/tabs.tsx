import { useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

/** Controlled tabs with a pill tablist and a single active panel. */
export function Tabs({ items, defaultId }: { items: TabItem[]; defaultId?: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const activeItem = items.find((i) => i.id === active) ?? items[0];

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-lg bg-bg p-1">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-small font-semibold transition-colors",
              active === id ? "bg-surface text-brand shadow-soft" : "text-muted hover:text-ink"
            )}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={2} />}
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">{activeItem?.content}</div>
    </div>
  );
}
