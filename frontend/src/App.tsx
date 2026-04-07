import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CookieConsent } from './components/ui/CookieConsent';
import { AnimatePresence, motion } from 'framer-motion';

// Importacions del Client
import { EventDashboard } from './pages/client/EventDashboard';
import { EventDetail } from './pages/client/EventDetail';
import { SeatSelection } from './pages/client/SeatSelection';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { MyTickets } from './pages/client/MyTickets';

// Pàgines legals
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';

function AppRoutes() {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
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
        <Route 
          path="/session/:id/checkout" 
          element={
            <ProtectedRoute role="client">
              <CheckoutPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute role="client">
              <MyTickets />
            </ProtectedRoute>
          } 
        />

        {/* Pàgines legals (públiques) */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Redirecció per defecte */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-mesh" />
        <SocketProvider>
          <AppRoutes />
          <CookieConsent />
        </SocketProvider>
      </Router>
    </AuthProvider>
  );
}
