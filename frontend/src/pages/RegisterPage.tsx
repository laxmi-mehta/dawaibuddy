import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthField } from "@/features/auth/components/AuthField";
import { GoogleButton, OrDivider } from "@/features/auth/components/AuthExtras";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h1 className="text-h1 font-extrabold text-ink">Create your account</h1>
      <p className="mt-1 text-body text-muted">Free forever. No credit card needed.</p>

      <div className="mt-7 flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />

        <AuthField label="Full name" icon={User} placeholder="Aarav Kapoor" />
        <AuthField label="Email address" icon={Mail} type="email" placeholder="you@email.com" />
        <AuthField label="Mobile number" icon={Phone} type="tel" placeholder="+91 98765 43210" />

        <AuthField
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          hint="Use 8+ characters with a mix of letters and numbers."
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

        <Checkbox
          name="agree-terms"
          label={
            <>
              I agree to the{" "}
              <Link to="#" className="font-semibold text-brand hover:underline">
                Terms &amp; Privacy Policy
              </Link>
            </>
          }
        />

        <Button size="lg" className="w-full">
          Create account
          <ArrowRight className="h-5 w-5" strokeWidth={2} />
        </Button>
      </div>

      <p className="mt-6 text-center text-small text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
