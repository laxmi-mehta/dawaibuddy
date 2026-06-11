import type { ReactNode } from "react";
import { Bell, Search } from "lucide-react";

interface AppHeaderProps {
  title: ReactNode;
  subtitle?: string;
  /** Placeholder for the centre search box; omit to hide it. */
  searchPlaceholder?: string;
  /** Right-aligned action(s) shown before the bell/avatar. */
  actions?: ReactNode;
}

/** Top bar for app screens: title/subtitle, optional search, actions, bell, avatar. */
export function AppHeader({ title, subtitle, searchPlaceholder, actions }: AppHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-line bg-surface px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-h2 font-extrabold text-ink">{title}</h1>
        {subtitle && <p className="mt-0.5 text-small text-muted">{subtitle}</p>}
      </div>

      {searchPlaceholder && (
        <div className="relative lg:mx-6 lg:max-w-md lg:flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.9} />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="h-11 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-small text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          />
        </div>
      )}

      <div className="flex items-center gap-3">
        {actions}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-2 hover:bg-bg"
        >
          <Bell className="h-5 w-5" strokeWidth={1.9} />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-danger" />
        </button>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-small font-bold text-brand-700">
          AK
        </span>
      </div>
    </header>
  );
}
