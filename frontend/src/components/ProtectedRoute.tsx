import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'client' }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                borderRadius: ["20%", "50%", "20%"]
            }}
            transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="w-16 h-16 bg-indigo-600 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
        />
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronitzant...</p>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} />;
  }

  return <>{children}</>;
};
