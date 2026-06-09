import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">DawaiBuddy</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered medication management
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
