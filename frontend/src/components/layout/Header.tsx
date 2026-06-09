import { useAuthStore } from "@/store/auth.store";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex h-14 items-center justify-between border-b bg-card px-6">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-muted-foreground">{user.email}</span>
        )}
        <button
          onClick={logout}
          className="text-sm font-medium text-destructive hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
