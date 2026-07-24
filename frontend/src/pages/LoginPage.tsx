import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthField } from "@/features/auth/components/AuthField";
import { GoogleButton, OrDivider } from "@/features/auth/components/AuthExtras";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { t } = useTranslation();
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
      setError(t("auth.login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-extrabold text-ink">{t("auth.login.title")}</h1>
      <p className="mt-1 text-body text-muted">{t("auth.login.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />

        {error && (
          <p className="rounded-md bg-danger-bg px-4 py-3 text-small font-medium text-danger">
            {error}
          </p>
        )}

        <AuthField
          label={t("auth.login.emailLabel")}
          icon={Mail}
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthField
          label={t("auth.login.passwordLabel")}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          labelAction={
            <Link to="#" className="text-small font-semibold text-brand hover:underline">
              {t("auth.login.forgot")}
            </Link>
          }
          rightSlot={
            <button
              type="button"
              aria-label={t(showPassword ? "auth.login.hidePassword" : "auth.login.showPassword")}
              onClick={() => setShowPassword((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />

        <Checkbox
          name="keep-signed-in"
          defaultChecked
          label={t("auth.login.keepSignedIn")}
        />

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? t("auth.login.submitting") : t("auth.login.submit")}
          {!loading && <ArrowRight className="h-5 w-5" strokeWidth={2} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-small text-muted">
        {t("auth.login.newToApp")}{" "}
        <Link to="/register" className="font-bold text-brand hover:underline">
          {t("auth.login.createAccount")}
        </Link>
      </p>
    </div>
  );
}
