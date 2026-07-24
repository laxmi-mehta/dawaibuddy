import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/shared/Logo";

/** Dark site footer — brand + disclaimer, three link columns, copyright row. */
export function Footer() {
  const { t } = useTranslation();

  const COLUMNS = [
    {
      title: t("footer.productColumn"),
      links: [
        t("marketingNav.features"),
        t("marketingNav.howItWorks"),
        t("nav.reminders"),
        t("nav.aiAssistant"),
      ],
    },
    {
      title: t("footer.companyColumn"),
      links: [
        t("footer.companyAbout"),
        t("footer.companyCareers"),
        t("footer.companyPress"),
        t("footer.companyContact"),
      ],
    },
    {
      title: t("footer.legalColumn"),
      links: [
        t("footer.legalPrivacy"),
        t("footer.legalTerms"),
        t("footer.legalDataSecurity"),
        t("footer.legalDisclaimer"),
      ],
    },
  ];

  return (
    <footer className="bg-ink text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand + disclaimer */}
          <div className="col-span-2 lg:col-span-2">
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-small leading-relaxed">{t("footer.disclaimer")}</p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-small font-bold text-white">{col.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-small transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright row */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-tiny">{t("footer.copyright")}</p>
          <div className="flex gap-6 text-tiny">
            <Link to="#" className="transition-colors hover:text-white">
              {t("footer.legalPrivacy")}
            </Link>
            <Link to="#" className="transition-colors hover:text-white">
              {t("footer.legalTerms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
