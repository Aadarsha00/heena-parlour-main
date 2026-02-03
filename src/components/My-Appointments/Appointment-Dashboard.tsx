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
  | "confirmed"
  | "cancelled";

export interface AppointmentStats {
  total: number;
  upcoming: number;
  confirmed: number;
  cancelled: number;
}

const AppointmentDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("upcoming");
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
    refetchInterval: 30000,
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

    const bufferTime = 30 * 60 * 1000;

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
    confirmed: confirmedAppointments.length,
    cancelled: cancelledAppointments.length,
  };

  const filteredAppointments = getFilteredAppointments();

  const handleCancelAppointment = (appointmentId: number) => {
    cancelMutation.mutate(appointmentId);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    console.log("View details for appointment:", appointment);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-500" />
            <div className="flex items-start gap-4">
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error loading appointments
                </h3>
                <p className="text-gray-600 mb-4">{error.toString()}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-red-400 to-red-500 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-400/25 hover:-translate-y-0.5"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Appointments
            </h1>
            <p className="text-gray-600">
              Manage and track your upcoming appointments
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="group/button bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-3 rounded-xl font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25 hover:-translate-y-0.5 flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5 transition-transform group-hover/button:rotate-180 duration-300" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <AppointmentStats stats={stats} />

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <AppointmentFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white shadow-lg rounded-2xl p-16 transition-all duration-300">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent"></div>
              <p className="text-gray-600 font-medium">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!isLoading && (
          <div>
            {filteredAppointments.length === 0 ? (
              <div className="bg-white shadow-lg hover:shadow-xl rounded-2xl p-16 transition-all duration-300 text-center">
                <div className="inline-block p-6 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl mb-6">
                  <Calendar className="h-16 w-16 text-yellow-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No appointments found
                </h3>
                <p className="text-gray-600 text-lg">
                  {activeFilter === "all"
                    ? "You don't have any appointments yet."
                    : `No ${activeFilter.replace("_", " ")} appointments found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
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