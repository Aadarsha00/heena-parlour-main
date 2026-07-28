/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterRequest } from "../../interface/auth.interface";
import { registerSchema } from "../../schema/auth.schema";
import { registerUser } from "../../api/auth.api";
import { useState } from "react";
import toast from "react-hot-toast";

const SignupForm = () => {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created! Redirecting to login...");
      navigate("/login"); // redirect to login after signup
    },
    onError: (err: any) => {
      const errorData = err?.response?.data;
      let errorMessage = "Registration failed. Please try again.";

      if (!err?.response) {
        errorMessage =
          "Cannot reach the account server. Please check that the backend is running and try again.";
      }

      // Try to extract detailed error from backend
      if (errorData && typeof errorData === "object") {
        const messages: string[] = [];
        Object.entries(errorData).forEach(([key, value]: [string, any]) => {
          if (Array.isArray(value)) {
            messages.push(`${key}: ${value.join(", ")}`);
          } else if (typeof value === "string") {
            messages.push(`${key}: ${value}`);
          }
        });
        if (messages.length > 0) {
          errorMessage = messages.join(" | ");
        }
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      }

      setBackendError(errorMessage);
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: RegisterRequest) => {
    setBackendError("");
    mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-3xl shadow-2xl border border-[#e4e4d0]">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Create an Account</h2>
          <p className="mt-2 text-sm text-[#6f6552]">
            Sign up to book your next appointment
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-[#5a5242] mb-1">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="you@example.com"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="register-first-name" className="block text-sm font-medium text-[#5a5242] mb-1">
                First Name
              </label>
              <input
                id="register-first-name"
                autoComplete="given-name"
                {...register("first_name")}
                className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
                placeholder="First name"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.first_name?.message}
              </p>
            </div>
            <div>
              <label htmlFor="register-last-name" className="block text-sm font-medium text-[#5a5242] mb-1">
                Last Name
              </label>
              <input
                id="register-last-name"
                autoComplete="family-name"
                {...register("last_name")}
                className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
                placeholder="Last name"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.last_name?.message}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="register-phone" className="block text-sm font-medium text-[#5a5242] mb-1">
              Phone Number
            </label>
            <input
              id="register-phone"
              type="tel"
              autoComplete="tel"
              {...register("phone_number")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="+14105551234"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.phone_number?.message}
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-[#5a5242] mb-1">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="••••••••"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.password?.message}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="register-password-confirm" className="block text-sm font-medium text-[#5a5242] mb-1">
              Confirm Password
            </label>
            <input
              id="register-password-confirm"
              type="password"
              autoComplete="new-password"
              {...register("re_password")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="Repeat password"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.re_password?.message}
            </p>
          </div>

          {backendError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <p className="text-red-700 text-sm">{backendError}</p>
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm text-center">
              Registration failed. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-[#645746] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
          <div className="text-center pt-4 border-t border-[#eceadd]">
            <p className="text-sm text-[#6f6552]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#4b4032] hover:text-[#645746] transition"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
