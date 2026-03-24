import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

// Un Dashboard simple per al client (temporal)
const ClientDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-black mb-4">HOLA, {user?.name?.toUpperCase()}!</h1>
      <p className="text-slate-400 mb-8">Benvingut a la teva plataforma de concerts.</p>
      <button 
        onClick={logout}
        className="px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
      >
        Tancar Sessió
      </button>
    </div>
  );
};

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
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />

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
      </Router>
    </AuthProvider>
  );
}
