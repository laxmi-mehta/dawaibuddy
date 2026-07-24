import { Link, useLocation } from "react-router-dom";
import { Bell, ScanLine, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/shared/Logo";

/** Gradient brand panel shown beside the auth forms. Headline adapts to login vs register. */
export function AuthSidePanel() {
  const { t } = useTranslation();
  const isLogin = useLocation().pathname.includes("login");

  const PROPS = [
    { icon: ScanLine, label: t("auth.sidePanel.prop1") },
    { icon: ShieldCheck, label: t("auth.sidePanel.prop2") },
    { icon: Bell, label: t("auth.sidePanel.prop3") },
  ];

  const headline = isLogin ? (
    <>
      {t("auth.sidePanel.loginHeadline1")}
      <br />
      {t("auth.sidePanel.loginHeadline2")}
    </>
  ) : (
    <>{t("auth.sidePanel.registerHeadline")}</>
  );
  const subcopy = isLogin ? t("auth.sidePanel.loginSubcopy") : t("auth.sidePanel.registerSubcopy");

  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-gradient p-10 text-white lg:flex xl:p-12">
      <Link to="/" aria-label={t("common.homeAriaLabel")}>
        <Logo tone="dark" />
      </Link>

      <div className="max-w-md">
        <h1 className="text-4xl font-extrabold leading-tight xl:text-[2.75rem]">{headline}</h1>
        <p className="mt-5 text-body-lg leading-relaxed text-white/80">{subcopy}</p>

        <ul className="mt-10 flex flex-col gap-5">
          {PROPS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/15">
                <Icon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <span className="font-semibold">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 text-small text-white/85">
        <span className="flex gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        {t("auth.sidePanel.reviews")}
      </div>
    </div>
  );
}
