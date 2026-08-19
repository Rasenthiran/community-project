import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services";
import { storage } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => setIsBooting(false), []);

  const logout = useCallback(() => {
    storage.clear();
    setUser(null);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("hospital:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("hospital:unauthorized", handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (values) => {
    const result = await authService.login(values);
    storage.setToken(result.token);
    storage.setUser(result.user);
    setUser(result.user);
    return result.user;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user && storage.getToken()),
    isBooting,
    login,
    logout,
  }), [user, isBooting, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
