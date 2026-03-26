import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CookieConsent } from './components/ui/CookieConsent';

// Importacions del Client
import { EventDashboard } from './pages/client/EventDashboard';
import { EventDetail } from './pages/client/EventDetail';
import { SeatSelection } from './pages/client/SeatSelection';

// Pàgines legals
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Ruta Pública: Login */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />} 
      />

      {/* Rutes Protegides: Admin */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Rutes Protegides: Client */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute role="client">
            <EventDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/event/:id" 
        element={
          <ProtectedRoute role="client">
            <EventDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/session/:id/seats" 
        element={
          <ProtectedRoute role="client">
            <SeatSelection />
          </ProtectedRoute>
        } 
      />

      {/* Pàgines legals (públiques) */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Redirecció per defecte */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <CookieConsent />
      </Router>
    </AuthProvider>
  );
}
