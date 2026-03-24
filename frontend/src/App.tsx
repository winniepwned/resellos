import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/layout/AppShell";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { SourcingPage } from "@/pages/SourcingPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Laden...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/sourcing" element={<SourcingPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ConsentBanner />
    </ErrorBoundary>
  );
}
