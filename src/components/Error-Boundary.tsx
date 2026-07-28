import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-stone-50 px-6">
        <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">
            We could not display this page.
          </h1>
          <p className="mt-3 text-stone-600">
            Reload the page to try again. If the problem continues, return to
            the home page.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-700"
            >
              Reload page
            </button>
            <a
              href="/"
              className="rounded-xl border border-stone-300 px-5 py-3 font-semibold text-stone-800 hover:bg-stone-100"
            >
              Return home
            </a>
          </div>
        </section>
      </main>
    );
  }
}
