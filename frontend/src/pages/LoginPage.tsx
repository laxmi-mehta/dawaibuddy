import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthField } from "@/features/auth/components/AuthField";
import { GoogleButton, OrDivider } from "@/features/auth/components/AuthExtras";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h1 className="text-h1 font-extrabold text-ink">Log in</h1>
      <p className="mt-1 text-body text-muted">Enter your details to continue.</p>

      <div className="mt-7 flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />

        <AuthField label="Email address" icon={Mail} type="email" placeholder="you@email.com" />

        <AuthField
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          labelAction={
            <Link to="#" className="text-small font-semibold text-brand hover:underline">
              Forgot?
            </Link>
          }
          rightSlot={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <Checkbox name="keep-signed-in" defaultChecked label="Keep me signed in on this device" />

        <Button size="lg" className="w-full">
          Log in
          <ArrowRight className="h-5 w-5" strokeWidth={2} />
        </Button>
      </div>

      <p className="mt-6 text-center text-small text-muted">
        New to DawaiBuddy?{" "}
        <Link to="/register" className="font-bold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
