import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import {
  cancelAppointment,
  getApiErrorMessage,
  getAppointments,
} from "../../api/appointment.api";
import type { Appointment } from "../../interface/appointment.interface";
import AppointmentCard from "./Card";
import AppointmentFilters, { type FilterType } from "./Filter";
import AppointmentStats from "./Stats";
import {
  getAppointmentSortValue,
  isAppointmentCancelled,
  isAppointmentPast,
  isAppointmentUpcoming,
} from "./appointment.utils";

const FILTER_EMPTY_CONTENT: Record<
  FilterType,
  { title: string; description: string }
> = {
  all: {
    title: "No appointments yet",
    description:
      "When you book a service, all of your appointment details will appear here.",
  },
  upcoming: {
    title: "Nothing coming up",
    description: "You do not have any upcoming appointments at the moment.",
  },
  confirmed: {
    title: "No confirmed appointments",
    description:
      "Appointments that the salon confirms will be collected here for you.",
  },
  past: {
    title: "No past appointments",
    description: "Your appointment history will appear here after your first visit.",
  },
  cancelled: {
    title: "No cancelled appointments",
    description: "You have no cancelled bookings in your appointment history.",
  },
};

const AppointmentSkeleton = () => (
  <div
    className="animate-pulse overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
    aria-hidden="true"
  >
    <div className="flex gap-5">
      <div className="h-20 w-16 shrink-0 rounded-2xl bg-stone-200 sm:w-20" />
      <div className="flex-1">
        <div className="h-3 w-28 rounded bg-stone-200" />
        <div className="mt-3 h-6 w-2/3 rounded bg-stone-200" />
        <div className="mt-4 h-4 w-1/2 rounded bg-stone-100" />
      </div>
    </div>
    <div className="mt-6 h-24 rounded-2xl bg-stone-100 sm:ml-[6.5rem]" />
  </div>
);

const AppointmentDashboard = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
  const queryClient = useQueryClient();
  const appointmentsQuery = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
    staleTime: 30_000,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(
        data.status === "late_cancelled"
          ? "Appointment cancelled and recorded as a late cancellation."
          : "Appointment cancelled."
      );
    },
    onError: (error) =>
      toast.error(
        getApiErrorMessage(error, "The appointment could not be cancelled.")
      ),
  });

  const appointments = useMemo(
    () => appointmentsQuery.data?.results ?? [],
    [appointmentsQuery.data?.results]
  );

  const counts = useMemo<Record<FilterType, number>>(
    () => ({
      all: appointments.length,
      upcoming: appointments.filter(isAppointmentUpcoming).length,
      confirmed: appointments.filter(
        (item) =>
          item.status === "confirmed" && isAppointmentUpcoming(item)
      ).length,
      cancelled: appointments.filter(isAppointmentCancelled).length,
      past: appointments.filter(isAppointmentPast).length,
    }),
    [appointments]
  );

  const filteredAppointments = useMemo(() => {
    const filtered = appointments.filter((appointment) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "upcoming") {
        return isAppointmentUpcoming(appointment);
      }
      if (activeFilter === "confirmed") {
        return (
          appointment.status === "confirmed" &&
          isAppointmentUpcoming(appointment)
        );
      }
      if (activeFilter === "cancelled") {
        return isAppointmentCancelled(appointment);
      }
      return isAppointmentPast(appointment);
    });

    return [...filtered].sort((first, second) => {
      const firstIsUpcoming = isAppointmentUpcoming(first);
      const secondIsUpcoming = isAppointmentUpcoming(second);

      if (firstIsUpcoming !== secondIsUpcoming) {
        return firstIsUpcoming ? -1 : 1;
      }

      const difference =
        getAppointmentSortValue(first) - getAppointmentSortValue(second);
      return firstIsUpcoming ? difference : -difference;
    });
  }, [activeFilter, appointments]);

  const stats = {
    total: appointments.length,
    upcoming: counts.upcoming,
    completed: appointments.filter((item) => item.status === "completed").length,
    cancelled: counts.cancelled,
  };

  const emptyContent = FILTER_EMPTY_CONTENT[activeFilter];
  const queryError = appointmentsQuery.isError
    ? getApiErrorMessage(
        appointmentsQuery.error,
        "We could not retrieve your bookings right now."
      )
    : null;

  return (
    <main className="min-h-[70vh] bg-[#faf9f6]">
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-br from-[#f8f1eb] via-[#fdfbf8] to-[#f3eadf]">
        <div
          className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#d6b89f]/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#8b5a3c]">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Your bookings
            </p>
            <h1 className="text-3xl font-light tracking-tight text-stone-950 sm:text-4xl lg:text-5xl">
              My appointments
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
              Keep track of upcoming visits, check appointment details, and
              manage your booking history in one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => appointmentsQuery.refetch()}
              disabled={appointmentsQuery.isFetching}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  appointmentsQuery.isFetching ? "animate-spin" : ""
                }`}
                aria-hidden="true"
              />
              {appointmentsQuery.isFetching ? "Refreshing..." : "Refresh"}
            </button>
            <Link
              to="/services"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
            >
              Book an appointment
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {appointmentsQuery.isLoading ? (
          <div role="status" aria-live="polite">
            <span className="sr-only">Loading your appointments</span>
            <div className="h-24 animate-pulse rounded-2xl bg-stone-200" />
            <div className="mt-8 h-12 w-full max-w-xl animate-pulse rounded-2xl bg-stone-200" />
            <div className="mt-7 space-y-5">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          </div>
        ) : queryError ? (
          <div
            className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-white p-7 text-center shadow-sm sm:p-10"
            role="alert"
          >
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              <TriangleAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-stone-950">
              Appointments could not be loaded
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
              {queryError}
            </p>
            <button
              type="button"
              onClick={() => appointmentsQuery.refetch()}
              disabled={appointmentsQuery.isFetching}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:opacity-60"
            >
              {appointmentsQuery.isFetching ? (
                <LoaderCircle
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              Try again
            </button>
          </div>
        ) : (
          <>
            <AppointmentStats stats={stats} />

            <div className="mt-8">
              <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    Appointment list
                  </h2>
                  <p className="mt-1 text-sm text-stone-500" aria-live="polite">
                    Showing {filteredAppointments.length}{" "}
                    {filteredAppointments.length === 1
                      ? "appointment"
                      : "appointments"}
                  </p>
                </div>
                <AppointmentFilters
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  counts={counts}
                />
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center sm:py-16">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f4ede7] text-[#8b5a3c]">
                    <CalendarDays className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-stone-950">
                    {emptyContent.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
                    {emptyContent.description}
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                    {activeFilter !== "all" && appointments.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveFilter("all")}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                      >
                        View all appointments
                      </button>
                    )}
                    <Link
                      to="/services"
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                    >
                      Browse services
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {filteredAppointments.map((appointment: Appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={(id) => cancelMutation.mutate(id)}
                      cancelLoading={
                        cancelMutation.isPending &&
                        cancelMutation.variables === appointment.id
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AppointmentDashboard;
