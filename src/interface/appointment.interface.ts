export interface ServiceDetails {
  id: number;
  name: string;
  description?: string;
  price: string;
  duration_minutes: number;
  category: string;
}

export type AppointmentStatus =
  | "booked"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "late_cancelled"
  | "no_show";

export interface Appointment {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  service: number;
  service_details: ServiceDetails;
  stylist: number | null;
  stylist_name?: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  duration_minutes: number;
  total_amount: string;
  can_cancel: boolean;
  is_past_due: boolean;
}

export interface CreateAppointmentData {
  client_name: string;
  client_email: string;
  client_phone: string;
  service: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  appointment_date?: string;
  appointment_time?: string;
  notes?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  appointment_date?: string;
  service?: number;
}

export interface AppointmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appointment[];
}

export interface AvailableSlot {
  value: string;
  label: string;
}

export interface AvailabilityResponse {
  date: string;
  service: number;
  duration_minutes: number;
  time_zone?: string;
  slots: AvailableSlot[];
}
