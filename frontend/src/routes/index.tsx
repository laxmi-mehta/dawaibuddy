import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { MarketingLayout } from "@/layouts/MarketingLayout";
import { useAuth } from "@/hooks/useAuth";

import { LandingPage } from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import PrescriptionsPage from "@/pages/PrescriptionsPage";
import MedicinesPage from "@/pages/MedicinesPage";
import InteractionsPage from "@/pages/InteractionsPage";
import RemindersPage from "@/pages/RemindersPage";
import AssistantPage from "@/pages/AssistantPage";
import UploadPage from "@/pages/UploadPage";
import AppComingSoon from "@/pages/AppComingSoon";

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing routes */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Guest-only routes */}
      <Route
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* App routes — UI design phase: auth guard added once auth logic lands */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/interactions" element={<InteractionsPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/medicines" element={<MedicinesPage />} />
        <Route path="/profile" element={<AppComingSoon title="Profile" />} />
        <Route path="/settings" element={<AppComingSoon title="Settings" />} />
        <Route path="/design-system" element={<AppComingSoon title="Design System" />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
