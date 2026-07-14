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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <h2 className="text-h3 font-extrabold text-ink">{title}</h2>
      <div className="mt-2 divide-y divide-line">{children}</div>
    </Card>
  );
}

const SUPPORT: { icon: LucideIcon; label: string }[] = [
  { icon: HelpCircle, label: "Help centre" },
  { icon: MessageCircle, label: "Contact support" },
  { icon: FileText, label: "Terms & privacy" },
  { icon: Info, label: "About DawaiBuddy" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [exporting, setExporting] = useState(false);

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
      <AppHeader title="Settings" subtitle="Manage your preferences & account" />

      <div className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left column */}
          <div className="space-y-6">
            <SectionCard title="Notifications">
              <SettingRow
                icon={Bell}
                title="Push reminders"
                desc="Dose reminders on this device"
                trailing={<Toggle checked={pushReminders} onChange={setPushReminders} />}
              />
              <SettingRow
                icon={Mail}
                tone="accent"
                title="Email summaries"
                desc="Weekly adherence reports"
                trailing={<Toggle checked={emailSummaries} onChange={setEmailSummaries} />}
              />
              <SettingRow
                icon={Phone}
                tone="accent"
                title="SMS reminders"
                desc="Texts for important doses"
                trailing={<Toggle checked={smsReminders} onChange={setSmsReminders} />}
              />
              <SettingRow
                icon={Volume2}
                tone="warning"
                title="Reminder sound"
                desc="Play a chime when due"
                trailing={<Toggle checked={reminderSound} onChange={setReminderSound} />}
              />
            </SectionCard>

            <SectionCard title="Preferences">
              <SettingRow
                icon={Leaf}
                tone="accent"
                title="Suggest generic alternatives"
                desc="Show cheaper options on medicine pages"
                trailing={<Toggle checked={suggestGenerics} onChange={setSuggestGenerics} />}
              />
              <SettingRow
                icon={Eye}
                title="Larger text"
                desc="Bigger, easier-to-read type"
                trailing={<Toggle checked={largerText} onChange={setLargerText} />}
              />
              <SettingRow
                icon={Globe}
                tone="accent"
                title="Language"
                trailing={<Select options={["English", "हिन्दी", "मराठी"]} disabled />}
              />
              <SettingRow
                icon={Ruler}
                title="Units"
                trailing={<Select options={["Metric (kg, cm)", "Imperial (lb, in)"]} disabled />}
              />
            </SectionCard>

            <SectionCard title="Privacy & security">
              <SettingRow
                icon={Lock}
                title="App lock (Face ID)"
                desc="Require unlock to open the app"
                trailing={<Toggle checked={appLock} onChange={setAppLock} />}
              />
              <SettingRow
                icon={ShieldCheck}
                tone="accent"
                title="Share anonymised data"
                desc="Help improve medicine info"
                trailing={<Toggle checked={shareAnon} onChange={setShareAnon} />}
              />
              <button type="button" onClick={handleExportData} disabled={exporting} className="w-full">
                <SettingRow
                  icon={Download}
                  title={exporting ? "Preparing export…" : "Export my data"}
                  desc="Download all your prescriptions & history"
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
                  <p className="font-bold text-ink">Account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink hover:bg-bg"
              >
                Edit profile
              </button>
              <button
                type="button"
                disabled
                title="No subscription plan yet"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink opacity-50"
              >
                <CreditCard className="h-4 w-4" /> Manage subscription
              </button>
            </Card>

            <Card className="p-6">
              <h2 className="text-h3 font-extrabold text-ink">Support</h2>
              <div className="mt-2 divide-y divide-line">
                {SUPPORT.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    disabled
                    title="Coming soon"
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
              <LogOut className="h-5 w-5" strokeWidth={2} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
