import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  Pill,
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
  labelKey: string;
  icon: LucideIcon;
}

const MENU: NavItem[] = [
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { to: "/upload", labelKey: "nav.uploadRx", icon: Upload },
  { to: "/prescriptions", labelKey: "nav.prescriptions", icon: FileText },
  { to: "/medicines", labelKey: "nav.medicines", icon: Pill },
  { to: "/reminders", labelKey: "nav.reminders", icon: Calendar },
  { to: "/interactions", labelKey: "nav.interactions", icon: Shield },
  { to: "/assistant", labelKey: "nav.aiAssistant", icon: Sparkles },
];

const ACCOUNT: NavItem[] = [
  { to: "/profile", labelKey: "nav.profile", icon: User },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="px-3 pb-2 text-tiny font-bold uppercase tracking-wider text-muted">{title}</p>
      <ul className="flex flex-col gap-1">
        {items.map(({ to, labelKey, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-small font-semibold transition-colors",
                  isActive ? "bg-brand text-white" : "text-ink-2 hover:bg-bg"
                )
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.9} />
              {t(labelKey)}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** App sidebar: brand, grouped nav, and the Plus upsell card. */
export default function Sidebar() {
  const { t } = useTranslation();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 py-5 lg:flex">
      <div className="px-2">
        <NavLink to="/dashboard" aria-label={t("common.homeAriaLabel")}>
          <Logo />
        </NavLink>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-7">
        <NavGroup title={t("nav.menuGroup")} items={MENU} />
        <NavGroup title={t("nav.accountGroup")} items={ACCOUNT} />
      </nav>

      <div className="rounded-lg bg-accent-50 p-4">
        <p className="flex items-center gap-1.5 text-small font-bold text-accent-600">
          <Sparkles className="h-4 w-4" /> {t("nav.plusBadge")}
        </p>
        <p className="mt-2 font-bold text-ink">{t("nav.plusTitle")}</p>
        <p className="mt-1 text-small text-muted">{t("nav.plusDesc")}</p>
        <button
          type="button"
          className="mt-3 w-full rounded-full bg-brand py-2.5 text-small font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {t("nav.upgrade")}
        </button>
      </div>
    </aside>
  );
}
