import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Use-Auth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Explicitly check authentication when protected route is accessed
    const performAuthCheck = async () => {
      if (!hasCheckedAuth) {
        console.log("🔒 Protected route accessed, checking auth...");
        await checkAuth();
        setHasCheckedAuth(true);
      }
    };

    performAuthCheck();
  }, [checkAuth, hasCheckedAuth]);

  // Show loading while checking authentication status
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated, including current location
  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    console.log(
      "🚫 Not authenticated, redirecting to login with returnTo:",
      location.pathname + location.search
    );
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
