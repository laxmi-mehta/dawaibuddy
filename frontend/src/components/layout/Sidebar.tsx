import { NavLink } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  Layers,
  Settings,
  Shield,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const MENU: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Rx", icon: Upload },
  { to: "/reminders", label: "Reminders", icon: Calendar },
  { to: "/interactions", label: "Interactions", icon: Shield },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
];

const ACCOUNT: NavItem[] = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/design-system", label: "Design System", icon: Layers },
];

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <p className="px-3 pb-2 text-tiny font-bold uppercase tracking-wider text-muted">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-small font-semibold transition-colors",
                  isActive ? "bg-brand text-white" : "text-ink-2 hover:bg-bg",
                )
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.9} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** App sidebar: brand, grouped nav, and the Plus upsell card. */
export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
      <div className="px-2">
        <NavLink to="/dashboard" aria-label="DawaiBuddy home">
          <Logo />
        </NavLink>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-7">
        <NavGroup title="Menu" items={MENU} />
        <NavGroup title="Account" items={ACCOUNT} />
      </nav>

      <div className="rounded-lg bg-accent-50 p-4">
        <p className="flex items-center gap-1.5 text-small font-bold text-accent-600">
          <Sparkles className="h-4 w-4" /> Plus
        </p>
        <p className="mt-2 font-bold text-ink">Unlock family profiles</p>
        <p className="mt-1 text-small text-muted">Manage medicines for the whole family.</p>
        <button
          type="button"
          className="mt-3 w-full rounded-full bg-brand py-2.5 text-small font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Upgrade
        </button>
      </div>
    </aside>
  );
}
