import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthSidePanel } from "@/features/auth/components/AuthSidePanel";
import { Logo } from "@/components/shared/Logo";

/** Split-screen auth shell: gradient brand panel (lg+) + centered form. */
export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthSidePanel />
      <div className="flex flex-col bg-surface px-6 py-8">
        {/* Top bar: mobile logo + back-to-home (always available) */}
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="DawaiBuddy home" className="lg:invisible">
            <Logo />
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-small font-semibold text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
