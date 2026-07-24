import {
  Bell,
  CreditCard,
  Download,
  Eye,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Leaf,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
  User,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Select } from "@/components/ui/select";
import { SettingRow } from "@/components/shared/SettingRow";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocalPref } from "@/hooks/useLocalPref";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { remindersService } from "@/services/reminders.service";
import { prescriptionsService } from "@/services/prescriptions.service";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-h3 font-extrabold text-ink">{title}</h2>
      <div className="mt-2 divide-y divide-line">{children}</div>
    </Card>
  );
}

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [exporting, setExporting] = useState(false);

  const SUPPORT: { icon: LucideIcon; label: string }[] = [
    { icon: HelpCircle, label: t("settings.helpCentre") },
    { icon: MessageCircle, label: t("settings.contactSupport") },
    { icon: FileText, label: t("settings.termsPrivacy") },
    { icon: Info, label: t("settings.aboutApp") },
  ];

  const currentLanguageLabel =
    LANGUAGES.find((l) => l.code === i18n.language)?.label ?? LANGUAGES[0].label;

  function handleLanguageChange(label: string) {
    const lang = LANGUAGES.find((l) => l.label === label);
    if (lang) i18n.changeLanguage(lang.code);
  }

  const [pushReminders, setPushReminders] = useLocalPref("push_reminders", true);
  const [emailSummaries, setEmailSummaries] = useLocalPref("email_summaries", false);
  const [smsReminders, setSmsReminders] = useLocalPref("sms_reminders", true);
  const [reminderSound, setReminderSound] = useLocalPref("reminder_sound", true);
  const [suggestGenerics, setSuggestGenerics] = useLocalPref("suggest_generics", true);
  const [largerText, setLargerText] = useLocalPref("larger_text", false);
  const [appLock, setAppLock] = useLocalPref("app_lock", true);
  const [shareAnon, setShareAnon] = useLocalPref("share_anonymised", false);

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
  }

  async function handleExportData() {
    setExporting(true);
    try {
      const [user, profile, family, reminders, prescriptions] = await Promise.all([
        authService.getMe(),
        profileService.get(),
        profileService.listFamily(),
        remindersService.list(),
        prescriptionsService.list(),
      ]);
      const payload = {
        exported_at: new Date().toISOString(),
        user,
        profile,
        family: family.results,
        reminders: reminders.results,
        prescriptions: prescriptions.results,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dawaibuddy-data-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <AppHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            <SectionCard title={t("settings.notifications")}>
              <SettingRow
                icon={Bell}
                title={t("settings.pushReminders")}
                desc={t("settings.pushRemindersDesc")}
                trailing={<Toggle checked={pushReminders} onChange={setPushReminders} />}
              />
              <SettingRow
                icon={Mail}
                tone="accent"
                title={t("settings.emailSummaries")}
                desc={t("settings.emailSummariesDesc")}
                trailing={<Toggle checked={emailSummaries} onChange={setEmailSummaries} />}
              />
              <SettingRow
                icon={Phone}
                tone="accent"
                title={t("settings.smsReminders")}
                desc={t("settings.smsRemindersDesc")}
                trailing={<Toggle checked={smsReminders} onChange={setSmsReminders} />}
              />
              <SettingRow
                icon={Volume2}
                tone="warning"
                title={t("settings.reminderSound")}
                desc={t("settings.reminderSoundDesc")}
                trailing={<Toggle checked={reminderSound} onChange={setReminderSound} />}
              />
            </SectionCard>

            <SectionCard title={t("settings.preferences")}>
              <SettingRow
                icon={Leaf}
                tone="accent"
                title={t("settings.suggestGenerics")}
                desc={t("settings.suggestGenericsDesc")}
                trailing={<Toggle checked={suggestGenerics} onChange={setSuggestGenerics} />}
              />
              <SettingRow
                icon={Eye}
                title={t("settings.largerText")}
                desc={t("settings.largerTextDesc")}
                trailing={<Toggle checked={largerText} onChange={setLargerText} />}
              />
              <SettingRow
                icon={Globe}
                tone="accent"
                title={t("settings.language")}
                trailing={
                  <Select
                    options={LANGUAGES.map((l) => l.label)}
                    value={currentLanguageLabel}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  />
                }
              />
              <SettingRow
                icon={Ruler}
                title={t("settings.units")}
                trailing={
                  <Select
                    options={[t("settings.unitsMetric"), t("settings.unitsImperial")]}
                    disabled
                  />
                }
              />
            </SectionCard>

            <SectionCard title={t("settings.privacySecurity")}>
              <SettingRow
                icon={Lock}
                title={t("settings.appLock")}
                desc={t("settings.appLockDesc")}
                trailing={<Toggle checked={appLock} onChange={setAppLock} />}
              />
              <SettingRow
                icon={ShieldCheck}
                tone="accent"
                title={t("settings.shareAnon")}
                desc={t("settings.shareAnonDesc")}
                trailing={<Toggle checked={shareAnon} onChange={setShareAnon} />}
              />
              <button type="button" onClick={handleExportData} disabled={exporting} className="w-full">
                <SettingRow
                  icon={Download}
                  title={exporting ? t("settings.preparingExport") : t("settings.exportData")}
                  desc={t("settings.exportDataDesc")}
                  trailing={<ChevronRight className="h-5 w-5 text-muted" />}
                />
              </button>
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-body font-bold text-brand-700">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-ink">{t("settings.account")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink hover:bg-bg"
              >
                {t("profile.editProfile")}
              </button>
              <button
                type="button"
                disabled
                title={t("settings.noSubscriptionYet")}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink opacity-50"
              >
                <CreditCard className="h-4 w-4" /> {t("settings.manageSubscription")}
              </button>
            </Card>

            <Card className="p-6">
              <h2 className="text-h3 font-extrabold text-ink">{t("settings.support")}</h2>
              <div className="mt-2 divide-y divide-line">
                {SUPPORT.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled
                    title={t("settings.comingSoon")}
                    className="flex w-full items-center gap-3 py-3.5 text-left opacity-50"
                  >
                    <s.icon className="h-5 w-5 text-muted" strokeWidth={1.9} />
                    <span className="flex-1 font-semibold text-ink">{s.label}</span>
                    <ChevronRight className="h-5 w-5 text-muted" />
                  </button>
                ))}
              </div>
            </Card>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-danger-bg py-4 font-semibold text-danger hover:bg-danger/15"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} /> {t("settings.signOut")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
