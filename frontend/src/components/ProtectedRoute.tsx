import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'client' }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return null; // Skeleton Loader podria anar aquí

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
};
