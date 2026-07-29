import { Navigate, useLocation } from "react-router";
import { useAuth } from "./Use-Auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50">
        <div
          className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"
          aria-label="Checking sign in"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }
  return children;
};

export default ProtectedRoute;
