import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { labelKey: "marketingNav.features", href: "#features" },
  { labelKey: "marketingNav.howItWorks", href: "#how-it-works" },
  { labelKey: "marketingNav.reviews", href: "#reviews" },
  { labelKey: "marketingNav.faq", href: "#faq" },
];

/** Public marketing navbar — sticky, blurred, collapses to a hamburger sheet on mobile. */
export function MarketingNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label={t("common.homeAriaLabel")}>
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-small font-semibold text-ink-2 transition-colors hover:text-brand"
              >
                {t(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            {t("marketingNav.login")}
          </Link>
          <Link to="/register" className={cn(buttonVariants({ variant: "primary", size: "sm" }))}>
            {t("marketingNav.getStarted")}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
          aria-label={t("common.toggleMenu")}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <div className="border-t border-line bg-surface lg:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-body font-semibold text-ink-2 hover:bg-bg"
                >
                  {t(link.labelKey)}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-line px-4 py-4">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
            >
              {t("marketingNav.login")}
            </Link>
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "primary" }), "w-full")}
            >
              {t("marketingNav.getStarted")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
