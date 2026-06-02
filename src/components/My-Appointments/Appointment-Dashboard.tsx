import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { XCircle, RefreshCw, Calendar } from "lucide-react";
import type { Appointment } from "../../interface/appointment.interface";
import { cancelAppointment, getAppointments } from "../../api/appointment.api";
import AppointmentStats from "./Stats";
import AppointmentFilters from "./Filter";
import AppointmentCard from "./Card";

// Types for filter states
export type FilterType =
  | "all"
  | "upcoming"
  | "payment_pending"
  | "confirmed"
  | "cancelled";

export interface AppointmentStats {
  total: number;
  upcoming: number;
  paymentPending: number;
  confirmed: number;
  cancelled: number;
}

const AppointmentDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming"); // Changed from "all" to "upcoming"
  const [, setSelectedAppointment] = useState<Appointment | null>(null);
  const queryClient = useQueryClient();

  // Fetch all appointments - single API call
  const {
    data: allAppointmentsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getAppointments(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  console.log("data", allAppointmentsResponse);

  // Extract appointments array from API response
  const allAppointments = Array.isArray(allAppointmentsResponse)
    ? allAppointmentsResponse
    : allAppointmentsResponse?.results || [];

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      // Invalidate and refetch appointment data
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error) => {
      alert(`Failed to cancel appointment: ${error}`);
    },
  });

  // Helper function to check if appointment is upcoming
  const isUpcoming = (appointment: Appointment): boolean => {
    const now = new Date();
    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.appointment_time}`
    );

    const bufferTime = 30 * 60 * 1000; // 30 minutes in milliseconds

    return (
      appointmentDateTime.getTime() > now.getTime() - bufferTime &&
      appointment.status !== "cancelled" &&
      appointment.status !== "completed"
    );
  };

  // Filter appointments based on active filter
  const getFilteredAppointments = (): Appointment[] => {
    switch (activeFilter) {
      case "upcoming":
        return allAppointments.filter((apt: Appointment) => isUpcoming(apt));
      case "payment_pending":
        return allAppointments.filter(
          (apt: Appointment) => apt.payment_status === "pending"
        );
      case "confirmed":
        return allAppointments.filter(
          (apt: Appointment) => apt.status === "confirmed"
        );
      case "cancelled":
        return allAppointments.filter(
          (apt: Appointment) => apt.status === "cancelled"
        );
      case "all":
      default:
        return allAppointments;
    }
  };

  // Calculate upcoming appointments
  const upcomingAppointments = allAppointments.filter((apt: Appointment) =>
    isUpcoming(apt)
  );

  // Calculate payment pending appointments
  const paymentPendingAppointments = allAppointments.filter(
    (apt: Appointment) => apt.payment_status === "pending"
  );

  // Calculate confirmed appointments
  const confirmedAppointments = allAppointments.filter(
    (apt: Appointment) => apt.status === "confirmed"
  );

  // Calculate cancelled appointments
  const cancelledAppointments = allAppointments.filter(
    (apt: Appointment) => apt.status === "cancelled"
  );

  // Calculate stats
  const stats: AppointmentStats = {
    total: allAppointments.length,
    upcoming: upcomingAppointments.length,
    paymentPending: paymentPendingAppointments.length,
    confirmed: confirmedAppointments.length,
    cancelled: cancelledAppointments.length,
  };

  const filteredAppointments = getFilteredAppointments();

  const handleCancelAppointment = (appointmentId: number) => {
    cancelMutation.mutate(appointmentId);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    // TODO: Open modal or navigate to details page
    console.log("View details for appointment:", appointment);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F5F5DC" }}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading appointments
                </h3>
                <p className="mt-2 text-sm text-red-700">{error.toString()}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 bg-red-100 px-3 py-2 rounded-md text-sm text-red-800 hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F5DC" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-gray-600">
              Manage your upcoming appointments and payments
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <AppointmentStats stats={stats} />

        {/* Filters */}
        <AppointmentFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No appointments found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeFilter === "all"
                    ? "You don't have any appointments yet."
                    : `No ${activeFilter.replace(
                        "_",
                        " "
                      )} appointments found.`}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancelAppointment}
                    onViewDetails={handleViewDetails}
                    cancelLoading={cancelMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDashboard;
