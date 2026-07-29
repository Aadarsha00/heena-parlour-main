import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { Link, useParams } from "react-router";

import { activateAccount } from "../api/auth.api";

export default function ActivateAccount() {
  const { uid, token } = useParams<{ uid: string; token: string }>();
  const activationStarted = useRef(false);
  const {
    mutate: activate,
    isPending,
    isSuccess,
    isError: activationFailed,
  } = useMutation({
    mutationFn: activateAccount,
  });

  useEffect(() => {
    if (!uid || !token || activationStarted.current) {
      return;
    }

    activationStarted.current = true;
    activate({ uid, token });
  }, [activate, token, uid]);

  const isInvalidLink = !uid || !token;
  const isError = activationFailed || isInvalidLink;
  const isActivating = !isSuccess && !isError;

  return (
    <main className="min-h-screen bg-amber-50/30 px-4 py-16 grid place-items-center">
      <section
        aria-live="polite"
        className="w-full max-w-lg rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-xl sm:p-10"
      >
        {isActivating && (
          <>
            <LoaderCircle
              aria-hidden="true"
              className={`mx-auto h-12 w-12 text-amber-700 ${
                isPending ? "animate-spin" : ""
              }`}
            />
            <h1 className="mt-6 text-2xl font-semibold">
              Activating your account...
            </h1>
          </>
        )}

        {isSuccess && (
          <>
            <CircleCheck
              aria-hidden="true"
              className="mx-auto h-16 w-16 text-emerald-700"
            />
            <h1 className="mt-6 text-3xl font-semibold text-stone-900">
              Account activated
            </h1>
            <p className="mt-3 text-stone-600">
              Your email is verified. You can now sign in and book services.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-block rounded-xl bg-black px-7 py-3 font-medium text-white"
            >
              Sign in
            </Link>
          </>
        )}

        {isError && (
          <>
            <CircleAlert
              aria-hidden="true"
              className="mx-auto h-16 w-16 text-red-700"
            />
            <h1 className="mt-6 text-3xl font-semibold text-stone-900">
              Activation link invalid
            </h1>
            <p className="mt-3 text-stone-600">
              This link may be expired or already used. Request a new
              activation email and try again.
            </p>
            <Link
              to="/activation-sent"
              className="mt-8 inline-block rounded-xl bg-black px-7 py-3 font-medium text-white"
            >
              Request another link
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
