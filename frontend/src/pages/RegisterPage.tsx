import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthField } from "@/features/auth/components/AuthField";
import { GoogleButton, OrDivider } from "@/features/auth/components/AuthExtras";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agreed) {
      setError(t("auth.register.mustAgree"));
      return;
    }
    const [first_name, ...rest] = fullName.trim().split(" ");
    setLoading(true);
    try {
      await register({ email, password, first_name, last_name: rest.join(" ") });
      navigate("/dashboard", { replace: true });
    } catch {
      setError(t("auth.register.registerFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-h1 font-extrabold text-ink">{t("auth.register.title")}</h1>
      <p className="mt-1 text-body text-muted">{t("auth.register.subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
        <GoogleButton />
        <OrDivider />

        {error && (
          <p className="rounded-md bg-danger-bg px-4 py-3 text-small font-medium text-danger">
            {error}
          </p>
        )}

        <AuthField
          label={t("auth.register.fullNameLabel")}
          icon={User}
          required
          placeholder="Aarav Kapoor"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <AuthField
          label={t("auth.register.emailLabel")}
          icon={Mail}
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthField
          label={t("auth.register.mobileLabel")}
          icon={Phone}
          type="tel"
          placeholder="+91 98765 43210"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />

        <AuthField
          label={t("auth.register.passwordLabel")}
          icon={Lock}
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={t("auth.register.passwordHint")}
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
          name="agree-terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          label={
            <>
              {t("auth.register.agreePrefix")}{" "}
              <Link to="#" className="font-semibold text-brand hover:underline">
                {t("auth.register.termsLink")}
              </Link>
            </>
          }
        />

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? t("auth.register.submitting") : t("auth.register.submit")}
          {!loading && <ArrowRight className="h-5 w-5" strokeWidth={2} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-small text-muted">
        {t("auth.register.haveAccount")}{" "}
        <Link to="/login" className="font-bold text-brand hover:underline">
          {t("auth.register.login")}
        </Link>
      </p>
    </div>
  );
}
