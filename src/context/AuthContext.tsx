/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ensureValidToken,
  startTokenRefreshTimer,
  stopTokenRefreshTimer,
} from "../components/axios/api.axios";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticated: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

let authContextRef: {
  setAuthenticated?: (value: boolean) => void;
} = {};

export const getAuthContextRef = () => authContextRef;

const tokenIsCurrent = (token: string | null) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000 + 30;
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setAuthenticated = useCallback((value: boolean) => {
    setIsAuthenticated(value);
    if (value) startTokenRefreshTimer();
    else stopTokenRefreshTimer();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthenticated(false);
  }, [setAuthenticated]);

  const refreshAuth = useCallback(async () => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (!refresh || !tokenIsCurrent(refresh)) {
      logout();
      setIsLoading(false);
      return;
    }
    if (tokenIsCurrent(access)) {
      setAuthenticated(true);
      setIsLoading(false);
      return;
    }
    const validToken = await ensureValidToken();
    setAuthenticated(Boolean(validToken));
    setIsLoading(false);
  }, [logout, setAuthenticated]);

  useEffect(() => {
    authContextRef = { setAuthenticated };
    refreshAuth();

    const handleStorage = () => refreshAuth();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("localStorageChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("localStorageChange", handleStorage);
      stopTokenRefreshTimer();
      authContextRef = {};
    };
  }, [refreshAuth, setAuthenticated]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      setAuthenticated,
      refreshAuth,
      checkAuth: refreshAuth,
      logout,
    }),
    [isAuthenticated, isLoading, logout, refreshAuth, setAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
