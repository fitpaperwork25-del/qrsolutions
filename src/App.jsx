import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import ScanPage from "./pages/ScanPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import QRGeneratorPage from "./pages/QRGeneratorPage";
import MenuPage from "./pages/MenuPage";
import SettingsPage from "./pages/SettingsPage";
import SuccessPage from "./pages/SuccessPage";
import StaffDashboardPage from "./pages/StaffDashboardPage";
import OnboardingPage from "./pages/OnboardingPage";

import { useAuth } from "./lib/useAuth";

export default function App() {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>

      {/* STAFF */}
      <Route path="/staff" element={<StaffDashboardPage />} />

      {/* PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/scan/:bizId/:locSlug" element={<ScanPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/success" element={<SuccessPage />} />

      {/* PROTECTED (OWNER) */}
      <Route
        path="/onboarding"
        element={session ? <OnboardingPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/dashboard"
        element={session ? <DashboardPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/qr"
        element={session ? <QRGeneratorPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/menu"
        element={session ? <MenuPage /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/settings"
        element={session ? <SettingsPage /> : <Navigate to="/login" replace />}
      />

    </Routes>
  );
}