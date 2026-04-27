import { Routes, Route, Navigate } from "react-router-dom";

import ScanPage from "./pages/ScanPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import QRGeneratorPage from "./pages/QRGeneratorPage";
import MenuPage from "./pages/MenuPage";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";

import { useAuth } from "./lib/useAuth";
import SuccessPage from "./pages/SuccessPage";
export default function App() {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
<Route path="/success" element={<SuccessPage />} />
      {/* Protected */}
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

      {/* Default fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
