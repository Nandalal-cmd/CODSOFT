import { useCallback, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { authApi } from '../lib/api';

const SESSION_STORAGE_KEY = 'stylecart-session';

const readSession = () => {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  useEffect(() => {
    if (!session) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const authenticate = async (mode, role, values) => {
    const response =
      mode === 'register'
        ? await authApi.register(role, values)
        : await authApi.login(role, values);

    const nextSession = {
      token: response.token,
      role: response.user.role,
      user: response.user,
    };

    setSession(nextSession);
    return response.user;
  };

  const login = useCallback((role, values) => authenticate('login', role, values), []);
  const register = useCallback((role, values) => authenticate('register', role, values), []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const refreshAdminOverview = useCallback(async () => {
    if (!session?.token || session.role !== 'admin') {
      return null;
    }

    return authApi.getAdminOverview(session.token);
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        session,
        token: session?.token || null,
        user: session?.user || null,
        role: session?.role || null,
        isAuthenticated: Boolean(session?.token),
        isAdmin: session?.role === 'admin',
        login,
        register,
        logout,
        refreshAdminOverview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
