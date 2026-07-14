import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Droplet,
  Pencil,
  Pill,
  Plus,
  Trash2,
  User,
  type LucideIcon,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconBadge } from "@/components/shared/IconBadge";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";
import { AddFamilyForm } from "@/features/profile/components/AddFamilyForm";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { remindersService } from "@/services/reminders.service";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth.store";
import type { DashboardStats, FamilyMember, Profile, Reminder } from "@/types";

export default function ProfilePage() {
  const setUser = useAuthStore((s) => s.setUser);
  const authUser = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [addingFamily, setAddingFamily] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [user, prof, familyPage, remindersPage, dashboard] = await Promise.all([
        authService.getMe(),
        profileService.get(),
        profileService.listFamily(),
        remindersService.list(),
        dashboardService.get(),
      ]);
      setUser(user);
      setProfile(prof);
      setFamily(familyPage.results ?? []);
      setReminders(remindersPage.results ?? []);
      setStats(dashboard);
      setError(null);
    } catch {
      setError("Could not load profile. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveProfile(data: Partial<Profile>) {
    const updated = await profileService.update(data);
    setProfile(updated);
    setEditing(false);
  }

  async function handleAddFamily(data: Partial<FamilyMember>) {
    const member = await profileService.addFamily(data);
    setFamily((prev) => [...prev, member]);
    setAddingFamily(false);
  }

  async function handleUpdateFamily(id: string, data: Partial<FamilyMember>) {
    const updated = await profileService.updateFamily(id, data);
    setFamily((prev) => prev.map((f) => (f.id === id ? updated : f)));
    setEditingFamilyId(null);
  }

  async function handleRemoveFamily(id: string) {
    await profileService.removeFamily(id);
    setFamily((prev) => prev.filter((f) => f.id !== id));
  }

  const initials = authUser
    ? `${authUser.first_name?.[0] ?? ""}${authUser.last_name?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";
  const fullName = authUser ? `${authUser.first_name} ${authUser.last_name}`.trim() : "…";

  const HEALTH: { icon: LucideIcon; label: string; value: string }[] = profile
    ? [
        { icon: User, label: "Age", value: profile.age ? `${profile.age} years` : "—" },
        { icon: Droplet, label: "Blood group", value: profile.blood_group || "—" },
        {
          icon: Activity,
          label: "Height",
          value: profile.height_cm ? `${profile.height_cm} cm` : "—",
        },
        {
          icon: Activity,
          label: "Weight",
          value: profile.weight_kg ? `${profile.weight_kg} kg` : "—",
        },
      ]
    : [];

  const uniqueMedicines = Array.from(new Map(reminders.map((r) => [r.medicine_name, r])).values());

  if (loading) {
    return (
      <>
        <AppHeader title="My profile" subtitle="Your health information & saved medicines" />
        <p className="p-6 text-body text-muted">Loading profile…</p>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title="My profile"
        subtitle="Your health information & saved medicines"
        actions={
          <Button variant="ghost" size="sm" onClick={() => setEditing((v) => !v)}>
            <Pencil className="h-4 w-4" /> {editing ? "Close" : "Edit profile"}
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {error && (
          <Card className="border-l-4 border-l-danger p-5 text-body text-danger">{error}</Card>
        )}

        {/* Cover */}
        <Card className="overflow-hidden">
          <div className="h-28 bg-brand-gradient" />
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="-mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-surface bg-brand-100 text-h2 font-extrabold text-brand-700">
                {initials}
              </span>
              <div className="pb-1">
                <h2 className="text-h2 font-extrabold text-ink">{fullName || "—"}</h2>
                <p className="mt-1 text-small text-muted">{authUser?.email}</p>
              </div>
            </div>
            <Button size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          </div>
        </Card>

        {editing && profile && (
          <Card className="p-6">
            <h3 className="mb-4 text-h3 font-extrabold text-ink">Edit health profile</h3>
            <EditProfileForm
              profile={profile}
              onSubmit={handleSaveProfile}
              onCancel={() => setEditing(false)}
            />
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Left */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Health profile</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {HEALTH.map((h) => (
                  <div key={h.label} className="flex items-center gap-3 rounded-md bg-bg p-4">
                    <IconBadge icon={h.icon} tone="brand" />
                    <div>
                      <p className="text-small text-muted">{h.label}</p>
                      <p className="font-bold text-ink">{h.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Conditions &amp; allergies</h3>
              <p className="mt-4 text-tiny font-bold uppercase tracking-wider text-muted">
                Ongoing conditions
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile?.conditions.length ? (
                  profile.conditions.map((c) => (
                    <Badge key={c} variant="brand" size="sm">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <p className="text-small text-muted">None recorded.</p>
                )}
              </div>
              <p className="mt-4 text-tiny font-bold uppercase tracking-wider text-muted">
                Allergies
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile?.allergies.length ? (
                  profile.allergies.map((a) => (
                    <Badge key={a} variant="danger" size="sm">
                      <AlertTriangle className="h-3.5 w-3.5" /> {a}
                    </Badge>
                  ))
                ) : (
                  <p className="text-small text-muted">None recorded.</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">My medicines</h3>
                <Badge variant="default" size="sm">
                  {uniqueMedicines.length}
                </Badge>
              </div>
              {uniqueMedicines.length === 0 ? (
                <p className="mt-4 text-small text-muted">
                  No medicines yet — add a reminder to track one.
                </p>
              ) : (
                <ul className="mt-2 divide-y divide-line">
                  {uniqueMedicines.map((m) => (
                    <li key={m.medicine_name} className="flex items-center gap-3 py-3.5">
                      <IconBadge icon={Pill} tone="brand" />
                      <span className="flex-1 font-bold text-ink">{m.medicine_name}</span>
                      {m.dosage && (
                        <Badge variant="brand" size="sm">
                          {m.dosage}
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-h3 font-extrabold text-ink">Adherence</h3>
              <div className="mt-4">
                <div className="flex items-center justify-between text-small">
                  <span className="text-muted">Today</span>
                  <span className="font-bold text-success">{stats?.adherence_percent ?? 0}%</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-brand-gradient"
                    style={{ width: `${stats?.adherence_percent ?? 0}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-extrabold text-ink">Family</h3>
                <Button variant="soft" size="sm" onClick={() => setAddingFamily((v) => !v)}>
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>

              {addingFamily && (
                <div className="mt-3">
                  <AddFamilyForm
                    onSubmit={handleAddFamily}
                    onCancel={() => setAddingFamily(false)}
                  />
                </div>
              )}

              {family.length === 0 ? (
                <p className="mt-4 text-small text-muted">No family members added yet.</p>
              ) : (
                <ul className="mt-2 divide-y divide-line">
                  {family.map((f) =>
                    editingFamilyId === f.id ? (
                      <li key={f.id} className="py-3.5">
                        <AddFamilyForm
                          initial={f}
                          onSubmit={(data) => handleUpdateFamily(f.id, data)}
                          onCancel={() => setEditingFamilyId(null)}
                        />
                      </li>
                    ) : (
                      <li key={f.id} className="flex items-center gap-3 py-3.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-100 text-small font-bold text-accent-600">
                          {f.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="font-bold text-ink">{f.name}</p>
                          <p className="text-small text-muted">
                            {f.relation}
                            {f.age ? ` · ${f.age}` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingFamilyId(f.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-bg hover:text-ink"
                          aria-label={`Edit ${f.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFamily(f.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:bg-danger-bg hover:text-danger"
                          aria-label={`Remove ${f.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
