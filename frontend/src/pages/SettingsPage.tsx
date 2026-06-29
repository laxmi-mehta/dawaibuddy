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
  Volume2,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Select } from "@/components/ui/select";
import { SettingRow } from "@/components/shared/SettingRow";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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

  function handleSignOut() {
    signOut();
    navigate("/login", { replace: true });
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
                trailing={<Toggle defaultChecked />}
              />
              <SettingRow
                icon={Mail}
                tone="accent"
                title="Email summaries"
                desc="Weekly adherence reports"
                trailing={<Toggle />}
              />
              <SettingRow
                icon={Phone}
                tone="accent"
                title="SMS reminders"
                desc="Texts for important doses"
                trailing={<Toggle defaultChecked />}
              />
              <SettingRow
                icon={Volume2}
                tone="warning"
                title="Reminder sound"
                desc="Play a chime when due"
                trailing={<Toggle defaultChecked />}
              />
            </SectionCard>

            <SectionCard title="Preferences">
              <SettingRow
                icon={Leaf}
                tone="accent"
                title="Suggest generic alternatives"
                desc="Show cheaper options on medicine pages"
                trailing={<Toggle defaultChecked />}
              />
              <SettingRow
                icon={Eye}
                title="Larger text"
                desc="Bigger, easier-to-read type"
                trailing={<Toggle />}
              />
              <SettingRow
                icon={Globe}
                tone="accent"
                title="Language"
                trailing={<Select options={["English", "हिन्दी", "मराठी"]} />}
              />
              <SettingRow
                icon={Ruler}
                title="Units"
                trailing={<Select options={["Metric (kg, cm)", "Imperial (lb, in)"]} />}
              />
            </SectionCard>

            <SectionCard title="Privacy & security">
              <SettingRow
                icon={Lock}
                title="App lock (Face ID)"
                desc="Require unlock to open the app"
                trailing={<Toggle defaultChecked />}
              />
              <SettingRow
                icon={ShieldCheck}
                tone="accent"
                title="Share anonymised data"
                desc="Help improve medicine info"
                trailing={<Toggle />}
              />
              <SettingRow
                icon={Download}
                title="Export my data"
                desc="Download all your prescriptions & history"
                trailing={<ChevronRight className="h-5 w-5 text-muted" />}
              />
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-body font-bold text-brand-700">
                  AK
                </span>
                <div>
                  <p className="font-bold text-ink">Aarav Kapoor</p>
                  <p className="text-small text-muted">Plus member</p>
                </div>
              </div>
              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink hover:bg-bg"
              >
                Edit profile
              </button>
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-small font-semibold text-ink hover:bg-bg"
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
                    className="flex w-full items-center gap-3 py-3.5 text-left"
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
            <p className="text-center text-tiny text-muted">DawaiBuddy v2.4.0 · Made in India 🇮🇳</p>
          </div>
        </div>
      </div>
    </>
  );
}
