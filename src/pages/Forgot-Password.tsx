import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { requestPasswordReset } from "../api/auth.api";
import type { PasswordResetRequest } from "../interface/auth.interface";
import { passwordResetRequestSchema } from "../schema/auth.schema";

export default function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequest>({
    resolver: yupResolver(passwordResetRequestSchema),
  });

  const resetMutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (_data, variables) => setSubmittedEmail(variables.email),
  });

  if (resetMutation.isSuccess) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50/60 via-white to-stone-100 px-4 py-12">
        <section
          className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 text-center shadow-xl sm:p-10"
          aria-live="polite"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Mail className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-stone-950">
            Check your email
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            If an account exists for <strong>{submittedEmail}</strong>, a
            password reset link is on its way. Check your spam folder as well.
          </p>
          <Link
            to="/login"
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
          >
            Return to sign in
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedEmail("");
              resetMutation.reset();
            }}
            className="mt-3 min-h-10 text-sm font-semibold text-stone-600 underline decoration-stone-300 underline-offset-4 hover:text-stone-950"
          >
            Use another email
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50/60 via-white to-stone-100 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-xl sm:p-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to sign in
        </Link>

        <div className="mt-7">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4ede7] text-[#8b5a3c]">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-950">
            Forgot your password?
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Enter the email used for your account and we will send you a secure
            link to choose a new password.
          </p>
        </div>

        <form
          className="mt-7 space-y-5"
          onSubmit={handleSubmit((data) => resetMutation.mutate(data))}
          noValidate
        >
          <div>
            <label
              htmlFor="reset-email"
              className="mb-2 block text-sm font-semibold text-stone-800"
            >
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              disabled={resetMutation.isPending}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "reset-email-error" : undefined}
              {...register("email")}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-950 outline-none transition placeholder:text-stone-400 focus:border-[#9a6a4c] focus:ring-2 focus:ring-[#d8bda9] disabled:bg-stone-100"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="reset-email-error" className="mt-2 text-sm text-rose-700">
                {errors.email.message}
              </p>
            )}
          </div>

          {resetMutation.isError && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700" role="alert">
              We could not request a reset link right now. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="mr-2 h-4 w-4" aria-hidden="true" />
            {resetMutation.isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </section>
    </main>
  );
}
