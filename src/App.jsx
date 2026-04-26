import { Routes, Route, Navigate } from "react-router-dom";
import ScanPage from "./pages/ScanPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import QRGeneratorPage from "./pages/QRGeneratorPage";
import MenuPage from "./pages/MenuPage";
import SettingsPage from "./pages/SettingsPage";
import RegisterPage from "./pages/RegisterPage";
import { useAuth } from "./lib/useAuth";

// Global styles injected once
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { background: #080808; color: #F0EDE8; font-family: 'Syne', sans-serif; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  @keyframes fadeUp   { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes slideIn  { from { transform:translateX(16px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes popIn    { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
`;

// Staff-only route guard
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/staff/login" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <Routes>
        {/* Customer — QR scan entry point */}
        <Route path="/scan/:bizId/:locationSlug" element={<ScanPage />} />
        <Route path="/register" element={<RegisterPage />} />
<Route path="/" element={<Navigate to="/register" replace />} />
        {/* Staff */}
        <Route path="/staff/login"    element={<LoginPage />} />
        <Route path="/staff/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/staff/qr"        element={<ProtectedRoute><QRGeneratorPage /></ProtectedRoute>} />
        <Route path="/staff/menu"      element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/staff/settings"  element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, background: "#080808", color: "#F0EDE8", fontFamily: "'DM Mono', monospace" }}>
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#E8C547" }}>QRS — 404</div>
      <h1 style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>Not Found</h1>
      <p style={{ opacity: 0.35, fontSize: 13 }}>Scan a valid QR code to continue.</p>
    </div>
  );
}
