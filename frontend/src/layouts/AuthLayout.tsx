import { Outlet } from "react-router-dom";
import { AuthSidePanel } from "@/features/auth/components/AuthSidePanel";

/** Split-screen auth shell: gradient brand panel (lg+) + centered form. */
export default function AuthLayout() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <AuthSidePanel />
      <div className="flex items-center justify-center bg-surface px-6 py-12">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
