/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  ensureValidToken,
  startTokenRefreshTimer,
  stopTokenRefreshTimer,
} from "../components/axios/api.axios";

type AuthContextType = {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  isLoading: boolean;
  refreshAuth: () => Promise<void>;
  checkAuth: () => Promise<void>; // New method for explicit auth checking
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setAuthenticated: () => {},
  isLoading: false, // Changed default to false
  refreshAuth: async () => {},
  checkAuth: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

let authContextRef: {
  setAuthenticated?: (value: boolean) => void;
  refreshAuth?: () => Promise<void>;
} = {};

export const setAuthContextRef = (ref: typeof authContextRef) => {
  authContextRef = ref;
};

export const getAuthContextRef = () => authContextRef;

// Helper function for refresh token validation
const isTokenValid = (
  token: string | null,
  bufferSeconds: number = 30
): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime + bufferSeconds;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start with false
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const performAuthCheck = useCallback(async (skipLoading = false) => {
    console.log("🔍 performAuthCheck called, skipLoading:", skipLoading);
    console.log("🔍 Checking auth status...");
    // Add this at the very beginning of your AuthProvider component
    console.log(
      "🏁 AuthProvider rendering, isAuthenticated:",
      isAuthenticated,
      "isLoading:",
      isLoading
    );

    if (!skipLoading) {
      setIsLoading(true);
    }

    try {
      const refreshToken = localStorage.getItem("refresh");
      const accessToken = localStorage.getItem("access");

      // If no refresh token, definitely not authenticated
      if (!refreshToken) {
        console.log("❌ No refresh token found");
        setAuthenticated(false);
        stopTokenRefreshTimer();
        return;
      }

      // Check if refresh token is still valid
      if (!isTokenValid(refreshToken, 60)) {
        console.log("❌ Refresh token expired");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAuthenticated(false);
        stopTokenRefreshTimer();
        return;
      }

      // If we have a valid access token, use it directly
      if (isTokenValid(accessToken, 60)) {
        console.log("✅ User authenticated (valid access token)");
        setAuthenticated(true);
        startTokenRefreshTimer();
        return;
      }

      // Try to refresh the access token if needed
      console.log("🔄 Access token expired, attempting refresh...");
      const validToken = await ensureValidToken();

      if (validToken) {
        console.log("✅ User authenticated (refreshed token)");
        setAuthenticated(true);
        startTokenRefreshTimer();
      } else {
        console.log("❌ Could not obtain valid access token");
        setAuthenticated(false);
        stopTokenRefreshTimer();
      }
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      setAuthenticated(false);
      stopTokenRefreshTimer();
    } finally {
      if (!skipLoading) {
        setIsLoading(false);
      }
      setHasCheckedAuth(true);
    }
  }, []);

  // Only check auth if there are tokens present (user was previously logged in)
  const checkAuthOnInit = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh");
    const accessToken = localStorage.getItem("access");

    // Only run auth check if tokens exist (user was previously authenticated)
    if (refreshToken || accessToken) {
      console.log("🔧 Found existing tokens, checking auth status...");
      await performAuthCheck();
    } else {
      console.log("🆕 First time visitor, skipping auth check");
      setHasCheckedAuth(true);
    }
  }, [performAuthCheck]);

  useEffect(() => {
    // Only run initial auth check once and only if tokens exist
    if (!hasCheckedAuth) {
      checkAuthOnInit();
    }

    const handleStorageChange = (e?: StorageEvent) => {
      // Only react to auth-related storage changes
      if (hasCheckedAuth && (!e || e.key === "access" || e.key === "refresh")) {
        // Skip loading state for storage-triggered checks
        performAuthCheck(true);
      }
    };

    // Listen for storage changes from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-tab changes
    const handleCustomStorageChange = () => {
      if (hasCheckedAuth) {
        performAuthCheck(true);
      }
    };
    window.addEventListener("localStorageChange", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorageChange",
        handleCustomStorageChange
      );
      stopTokenRefreshTimer();
    };
  }, [checkAuthOnInit, performAuthCheck, hasCheckedAuth]);

  useEffect(() => {
    setAuthContextRef({
      setAuthenticated: setAuthenticatedWrapper,
      refreshAuth,
    });
  }, []);

  // Explicit method to check authentication (for protected routes)
  const checkAuth = async () => {
    // Don't perform auth check if no tokens exist
    const refreshToken = localStorage.getItem("refresh");
    const accessToken = localStorage.getItem("access");

    if (!refreshToken && !accessToken) {
      console.log("🆕 No tokens found, skipping auth check");
      setAuthenticated(false);
      setHasCheckedAuth(true);
      return;
    }

    console.log("🔒 Explicit auth check requested...");
    await performAuthCheck();
  };

  const refreshAuth = async () => {
    console.log("🔄 Manually refreshing auth state...");
    await performAuthCheck();
  };

  const setAuthenticatedWrapper = (value: boolean) => {
    console.log("🎯 Setting authenticated:", value);
    setAuthenticated(value);

    if (value) {
      // Start auto-refresh when user becomes authenticated
      startTokenRefreshTimer();
    } else {
      // Stop auto-refresh when setting to unauthenticated
      stopTokenRefreshTimer();
    }

    // Always set loading to false when authentication state is set
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated: setAuthenticatedWrapper,
        isLoading,
        refreshAuth,
        checkAuth, // Expose explicit auth check method
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
