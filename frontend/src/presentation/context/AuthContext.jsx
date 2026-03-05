import { createContext, useContext, useState, useEffect } from 'react';
import { authUseCases } from '../../application/usecases/AuthUseCases.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authUseCases.getCurrentUser());
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user: u } = await authUseCases.login(email, password);
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const { user: u } = await authUseCases.register(name, email, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await authUseCases.logout();
    setUser(null);
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('No autenticado');
    return authUseCases.changePassword(user.id, currentPassword, newPassword);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
