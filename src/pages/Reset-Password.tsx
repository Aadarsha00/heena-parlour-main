import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, CircleCheck, KeyRound, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";

import { confirmPasswordReset } from "../api/auth.api";
import type { PasswordResetConfirmForm } from "../interface/auth.interface";
import { passwordResetConfirmSchema } from "../schema/auth.schema";

export default function ResetPassword() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetConfirmForm>({
    resolver: yupResolver(passwordResetConfirmSchema),
  });

  const resetMutation = useMutation({
    mutationFn: confirmPasswordReset,
  });

  const invalidLink = !uid || !token;

  if (invalidLink) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50/60 via-white to-stone-100 px-4 py-12">
        <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl sm:p-10">
          <CircleAlert
            className="mx-auto h-14 w-14 text-rose-700"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-3xl font-semibold text-stone-950">
            Reset link is incomplete
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            This password reset link is invalid. Request a new link and try
            again.
          </p>
          <Link
            to="/forgot-password"
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Request another link
          </Link>
        </section>
      </main>
    );
  }

  if (resetMutation.isSuccess) {
    return (
      <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50/60 via-white to-stone-100 px-4 py-12">
        <section
          className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl sm:p-10"
          aria-live="polite"
        >
          <CircleCheck
            className="mx-auto h-14 w-14 text-emerald-700"
            aria-hidden="true"
          />
          <h1 className="mt-5 text-3xl font-semibold text-stone-950">
            Password updated
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Your new password is ready. You can now sign in to your account.
          </p>
          <Link
            to="/login"
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-amber-50/60 via-white to-stone-100 px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-7 shadow-xl sm:p-10">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f4ede7] text-[#8b5a3c]">
          <KeyRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-stone-950">
          Choose a new password
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          Use at least eight characters and choose a password you do not use
          elsewhere.
        </p>

        <form
          className="mt-7 space-y-5"
          onSubmit={handleSubmit((data) =>
            resetMutation.mutate({ ...data, uid, token })
          )}
          noValidate
        >
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-sm font-semibold text-stone-800"
            >
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              disabled={resetMutation.isPending}
              aria-invalid={Boolean(errors.new_password)}
              aria-describedby={
                errors.new_password ? "new-password-error" : undefined
              }
              {...register("new_password")}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#9a6a4c] focus:ring-2 focus:ring-[#d8bda9]"
            />
            {errors.new_password && (
              <p id="new-password-error" className="mt-2 text-sm text-rose-700">
                {errors.new_password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-new-password"
              className="mb-2 block text-sm font-semibold text-stone-800"
            >
              Confirm new password
            </label>
            <input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              disabled={resetMutation.isPending}
              aria-invalid={Boolean(errors.re_new_password)}
              aria-describedby={
                errors.re_new_password
                  ? "confirm-new-password-error"
                  : undefined
              }
              {...register("re_new_password")}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none transition focus:border-[#9a6a4c] focus:ring-2 focus:ring-[#d8bda9]"
            />
            {errors.re_new_password && (
              <p
                id="confirm-new-password-error"
                className="mt-2 text-sm text-rose-700"
              >
                {errors.re_new_password.message}
              </p>
            )}
          </div>

          {resetMutation.isError && (
            <div
              className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
              role="alert"
            >
              <p className="font-semibold">This link could not be used.</p>
              <p className="mt-1">
                It may be expired or already used. Request a new reset link.
              </p>
              <Link
                to="/forgot-password"
                className="mt-2 inline-block font-semibold underline"
              >
                Request another link
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {resetMutation.isPending && (
              <LoaderCircle
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            {resetMutation.isPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
