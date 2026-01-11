/* eslint-disable @typescript-eslint/no-explicit-any */

import api from "../components/axios/api.axios";
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../interface/appointment.interface";

// Get all appointments with optional filters
export const getAppointments = async (filters?: AppointmentFilters) => {
  try {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = queryParams.toString()
      ? `/appointments/?${queryParams.toString()}`
      : "/appointments/";
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get appointments";
  }
};

// Get appointment details by ID
export const getAppointmentDetails = async (appointmentId: number) => {
  try {
    const response = await api.get(`/appointments/${appointmentId}/`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get appointment details";
  }
};

// Create new appointment
export const createAppointment = async (
  appointmentData: CreateAppointmentData
) => {
  try {
    const response = await api.post("/appointments/", appointmentData);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to create appointment";
  }
};

// Update appointment
export const updateAppointment = async (
  appointmentId: number,
  appointmentData: UpdateAppointmentData
) => {
  try {
    const response = await api.put(
      `/appointments/${appointmentId}/`,
      appointmentData
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to update appointment";
  }
};

// Cancel appointment
export const cancelAppointment = async (appointmentId: number) => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/cancel/`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to cancel appointment";
  }
};

// Get payment summary for appointment
export const getAppointmentPaymentSummary = async (appointmentId: number) => {
  try {
    const response = await api.get(
      `/appointments/${appointmentId}/payment_summary/`
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get payment summary";
  }
};

// Check payment status for appointment
export const checkAppointmentPaymentStatus = async (appointmentId: number) => {
  try {
    const response = await api.get(
      `/appointments/${appointmentId}/check_payment_status/`
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to check payment status";
  }
};

// Get user's upcoming appointments
export const getMyUpcomingAppointments = async () => {
  try {
    const response = await api.get("/appointments/my_upcoming/");
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message || "Failed to get upcoming appointments"
    );
  }
};

// Get appointments with pending payments
export const getPaymentPendingAppointments = async () => {
  try {
    const response = await api.get("/appointments/payment_pending/");
    return response.data;
  } catch (error: any) {
    throw (
      error?.response?.data?.message ||
      "Failed to get payment pending appointments"
    );
  }
};

//get appointment through date
export const getAppointmentsForDate = async (
  date: string
): Promise<Appointment[]> => {
  try {
    const response = await api.get(`/appointments/?appointment_date=${date}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to fetch appointments";
  }
};
