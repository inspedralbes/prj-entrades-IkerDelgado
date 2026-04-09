import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'client';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        try {
          // Si VITE_API_URL ya termina en /api, no lo añadimos de nuevo
          const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
          const res = await fetch(`${apiUrl}/user`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [token]);

  const login = (userData: User, userToken: string) => {
    localStorage.setItem('auth_token', userToken);
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
