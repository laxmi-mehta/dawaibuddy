import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthField } from "@/features/auth/components/AuthField";
import { GoogleButton, OrDivider } from "@/features/auth/components/AuthExtras";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-extrabold text-ink">Log in</h1>
      <p className="mt-1 text-body text-muted">Enter your details to continue.</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />

        {error && (
          <p className="rounded-md bg-danger-bg px-4 py-3 text-small font-medium text-danger">
            {error}
          </p>
        )}

        <AuthField
          label="Email address"
          icon={Mail}
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthField
          label="Password"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
          {!loading && <ArrowRight className="h-5 w-5" strokeWidth={2} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-small text-muted">
        New to DawaiBuddy?{" "}
        <Link to="/register" className="font-bold text-brand hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
