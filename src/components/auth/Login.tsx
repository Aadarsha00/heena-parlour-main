import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "../../api/appointment.api";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/Use-Auth";
import type { LoginRequest } from "../../interface/auth.interface";
import { loginSchema } from "../../schema/auth.schema";

const getLoginErrorMessage = (error: unknown): string => {
  const message = getApiErrorMessage(
    error,
    "The email or password is incorrect."
  );

  if (message.toLowerCase().includes("no active account")) {
    return "This email exists, but the password is incorrect or the account still needs activation. Try the password used when the account was first created.";
  }

  return message;
};

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setAuthenticated, isLoading } = useAuth();
  const returnTo = useMemo(() => {
    const requested = new URLSearchParams(location.search).get("returnTo");
    return requested?.startsWith("/") && !requested.startsWith("//")
      ? requested
      : "/";
  }, [location.search]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({ resolver: yupResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setAuthenticated(true);
      toast.success("Signed in.");
      navigate(returnTo, { replace: true });
    },
    onError: (error) => toast.error(getLoginErrorMessage(error)),
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && !mutation.isPending) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, mutation.isPending, navigate, returnTo]);

  if (isLoading) {
    return <p className="min-h-screen grid place-items-center">Checking sign in…</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-[#e4e4d0] bg-white p-6 shadow-2xl sm:p-10">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-[#4b4032]">Welcome back</h1>
          <p className="mt-2 text-sm text-[#6f6552]">
            Sign in to book and manage appointments
          </p>
        </header>

        <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-lg border border-[#d6d6c2] bg-[#fffdf9] px-4 py-3"
              disabled={mutation.isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-lg border border-[#d6d6c2] bg-[#fffdf9] px-4 py-3"
              disabled={mutation.isPending}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-700">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-[#645746] disabled:opacity-50"
          >
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="border-t border-[#eceadd] pt-4 text-center text-sm text-[#6f6552]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-[#4b4032] underline">
            Create one
          </Link>
          <span className="mt-3 block">
            Account needs activation?{" "}
            <Link
              to="/activation-sent"
              className="font-medium text-[#4b4032] underline"
            >
              Resend the verification email
            </Link>
          </span>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
