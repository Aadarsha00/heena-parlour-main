import axios from "axios";

import api from "../components/axios/api.axios";
import type {
  AppointmentFilters,
  AppointmentListResponse,
  AvailabilityResponse,
  CreateAppointmentData,
  UpdateAppointmentData,
} from "../interface/appointment.interface";

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong"
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return fallback;

  const record = data as Record<string, unknown>;
  if (typeof record.detail === "string") return record.detail;
  if (typeof record.message === "string") return record.message;

  const firstValue = Object.values(record)[0];
  if (Array.isArray(firstValue)) return firstValue.join(" ");
  if (typeof firstValue === "string") return firstValue;
  return fallback;
};

export const getAppointments = async (
  filters?: AppointmentFilters
): Promise<AppointmentListResponse> => {
  const params = new URLSearchParams();
  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });

  let path = `/appointments/${params.size ? `?${params}` : ""}`;
  const results: AppointmentListResponse["results"] = [];

  do {
    const response = await api.get<AppointmentListResponse>(path);
    const page = response.data;
    results.push(...page.results);
    path = page.next
      ? `${new URL(page.next).pathname}${new URL(page.next).search}`
      : "";
  } while (path);

  return { count: results.length, next: null, previous: null, results };
};

export const createAppointment = async (
  appointmentData: CreateAppointmentData
) => {
  const response = await api.post("/appointments/", appointmentData);
  return response.data;
};

export const updateAppointment = async (
  appointmentId: number,
  appointmentData: UpdateAppointmentData
) => {
  const response = await api.patch(
    `/appointments/${appointmentId}/`,
    appointmentData
  );
  return response.data;
};

export const cancelAppointment = async (appointmentId: number) => {
  const response = await api.post(`/appointments/${appointmentId}/cancel/`);
  return response.data;
};

export const getAvailability = async (
  serviceId: number,
  date: string
): Promise<AvailabilityResponse> => {
  const response = await api.get("/appointments/availability/", {
    params: { service: serviceId, date },
  });
  return response.data;
};
