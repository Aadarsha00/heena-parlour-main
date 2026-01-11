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
      
      // Try to extract detailed error from backend
      if (typeof errorData === "object") {
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
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#5a5242] mb-1">
              Username
            </label>
            <input
              {...register("username")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="Your username"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.username?.message}
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5a5242] mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
              placeholder="you@example.com"
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          {/* First and Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#5a5242] mb-1">
                First Name
              </label>
              <input
                {...register("first_name")}
                className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a5242] mb-1">
                Last Name
              </label>
              <input
                {...register("last_name")}
                className="w-full px-4 py-3 border border-[#d6d6c2] rounded-lg bg-[#fffdf9] focus:ring-2 focus:ring-[#b9ad90] focus:outline-none"
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a5242] mb-1">
              Password
            </label>
            <input
              type="password"
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
            <label className="block text-sm font-medium text-[#5a5242] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
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
