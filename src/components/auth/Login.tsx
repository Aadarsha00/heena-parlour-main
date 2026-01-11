/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { loginSchema } from "../../schema/auth.schema";
import type { LoginRequest } from "../../interface/auth.interface";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/Use-Auth";
import { useEffect, useState, useMemo, useCallback } from "react";
import { startTokenRefreshTimer } from "../../components/axios/api.axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setAuthenticated, isLoading, checkAuth } = useAuth();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  // OPTIMIZED: Memoize the returnTo path to prevent recreation on every render
  const returnToPath = useMemo(() => {
    const urlParams = new URLSearchParams(location.search);
    const returnTo = urlParams.get("returnTo");
    console.log("🔍 Current location.search:", location.search);
    console.log("🔍 Parsed returnTo parameter:", returnTo);
    console.log("🔍 Will redirect to:", returnTo || "/");
    return returnTo || "/"; // Default to home if no returnTo
  }, [location.search]);

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("🎯 Login successful, storing tokens...");

      // Store tokens first
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Update auth state
      setAuthenticated(true);

      // Start token refresh timer
      startTokenRefreshTimer();

      // Show success toast
      toast.success("Login successful!");

      // Use the memoized return path
      console.log("🔄 Redirecting to:", returnToPath);

      // Navigate to the return path with a small delay to ensure state updates
      setTimeout(() => {
        navigate(returnToPath, { replace: true });
      }, 100);
    },
    onError: (error: any) => {
      console.error("❌ Login failed:", error);
      const errorMessage = error?.response?.data?.detail || "Login failed";
      toast.error(errorMessage);
    },
  });

  // OPTIMIZED: Memoize the auth check callback to prevent recreation
  const performAuthCheck = useCallback(async () => {
    if (!hasCheckedAuth) {
      const refreshToken = localStorage.getItem("refresh");
      const accessToken = localStorage.getItem("access");

      // Only check auth if user has existing tokens
      if (refreshToken || accessToken) {
        console.log("🔍 Login page: Found existing tokens, checking auth...");
        await checkAuth();
      } else {
        console.log(
          "🆕 Login page: First time visitor, no auth check needed"
        );
      }
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth, checkAuth]);

  useEffect(() => {
    performAuthCheck();
  }, [performAuthCheck]);

  useEffect(() => {
    // Only redirect if auth check is complete, user is authenticated, and not currently logging in
    if (hasCheckedAuth && !isLoading && isAuthenticated && !isPending) {
      console.log("🔄 Already authenticated, redirecting...");
      console.log("🔄 Redirecting already authenticated user to:", returnToPath);
      navigate(returnToPath, { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    isPending,
    hasCheckedAuth,
    returnToPath, // FIXED: Use memoized value instead of location.search
  ]);

  const onSubmit = (data: LoginRequest) => {
    console.log("🔐 Attempting login...");
    mutate(data);
  };

  // Show loading only if we're checking auth (and user has tokens) or during login
  const shouldShowLoading = (isLoading && !hasCheckedAuth) || isPending;

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-3xl shadow-2xl border border-[#e4e4d0]">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#4b4032]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#6f6552]">
            Sign in to book your beauty service
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#5a5242] mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg focus:ring-2 focus:ring-[#b9ad90] focus:border-transparent bg-[#fffdf9] placeholder:text-sm"
              placeholder="you@example.com"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#5a5242] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg focus:ring-2 focus:ring-[#b9ad90] focus:border-transparent bg-[#fffdf9] placeholder:text-sm"
              placeholder="Enter your password"
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#645746] focus:outline-none focus:ring-2 focus:ring-[#b9ad90] focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-[#eceadd]">
          <p className="text-sm text-[#6f6552]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-[#4b4032] hover:text-[#645746] transition"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;