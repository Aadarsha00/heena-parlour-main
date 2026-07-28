import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, RefreshCw, XCircle } from "lucide-react";
import toast from "react-hot-toast";

import {
  cancelAppointment,
  getApiErrorMessage,
  getAppointments,
} from "../../api/appointment.api";
import type { Appointment } from "../../interface/appointment.interface";
import AppointmentCard from "./Card";
import AppointmentFilters, { type FilterType } from "./Filter";
import AppointmentStats from "./Stats";

const isUpcoming = (appointment: Appointment) =>
  new Date(
    `${appointment.appointment_date}T${appointment.appointment_time}`
  ).getTime() > Date.now() &&
  ["booked", "confirmed"].includes(appointment.status);

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
      toast.error(getApiErrorMessage(error, "The appointment could not be cancelled.")),
  });

  const appointments = appointmentsQuery.data?.results ?? [];
  const filteredAppointments = appointments.filter((appointment) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "upcoming") return isUpcoming(appointment);
    if (activeFilter === "confirmed") return appointment.status === "confirmed";
    if (activeFilter === "cancelled") {
      return ["cancelled", "late_cancelled"].includes(appointment.status);
    }
    return ["completed", "no_show"].includes(appointment.status);
  });

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(isUpcoming).length,
    confirmed: appointments.filter((item) => item.status === "confirmed").length,
    cancelled: appointments.filter((item) =>
      ["cancelled", "late_cancelled"].includes(item.status)
    ).length,
  };

  if (appointmentsQuery.isError) {
    return (
      <main className="min-h-screen bg-[#F5F5DC] p-4">
        <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-red-50 p-5">
          <div className="flex gap-3">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <h1 className="font-semibold text-red-900">
                Appointments could not be loaded
              </h1>
              <button
                type="button"
                onClick={() => appointmentsQuery.refetch()}
                className="mt-3 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F5DC]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My appointments</h1>
            <p className="text-gray-600">View and manage your bookings.</p>
          </div>
          <button
            type="button"
            onClick={() => appointmentsQuery.refetch()}
            disabled={appointmentsQuery.isFetching}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                appointmentsQuery.isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <AppointmentStats stats={stats} />
        <AppointmentFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {appointmentsQuery.isLoading ? (
          <p className="py-12 text-center text-gray-600">Loading appointments…</p>
        ) : filteredAppointments.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-3 font-medium">No appointments found</h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose another filter or book a service.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={(id) => cancelMutation.mutate(id)}
                cancelLoading={cancelMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AppointmentDashboard;
