import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { resendActivation } from "../api/auth.api";

interface ActivationLocationState {
  email?: string;
}

export default function ActivationSent() {
  const location = useLocation();
  const initialEmail =
    (location.state as ActivationLocationState | null)?.email || "";
  const [email, setEmail] = useState(initialEmail);

  const resendMutation = useMutation({
    mutationFn: resendActivation,
    onSuccess: () =>
      toast.success("If the account is awaiting activation, a new link was sent."),
    onError: () =>
      toast.error("We could not send another activation email. Please try again."),
  });

  return (
    <main className="min-h-screen bg-amber-50/30 px-4 py-16 grid place-items-center">
      <section className="w-full max-w-lg rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-xl sm:p-10">
        <Mail
          aria-hidden="true"
          className="mx-auto mb-6 h-16 w-16 text-amber-700"
        />
        <h1 className="text-3xl font-semibold text-stone-900">
          Check your email
        </h1>
        <p className="mt-4 leading-relaxed text-stone-600">
          We sent an activation link
          {initialEmail ? ` to ${initialEmail}` : ""}. Open that link before
          signing in. Also check your spam folder.
        </p>

        <form
          className="mt-8 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (email.trim()) {
              resendMutation.mutate(email.trim());
            }
          }}
        >
          <label htmlFor="activation-email" className="sr-only">
            Email address
          </label>
          <input
            id="activation-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />
          <button
            type="submit"
            disabled={resendMutation.isPending}
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {resendMutation.isPending ? "Sending..." : "Resend activation link"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 inline-block font-medium text-amber-700 underline"
        >
          Return to sign in
        </Link>
      </section>
    </main>
  );
}
