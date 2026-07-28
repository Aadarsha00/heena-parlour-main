import type { Appointment } from "../../interface/appointment.interface";

const ACTIVE_STATUSES = new Set(["booked", "confirmed"]);
const CANCELLED_STATUSES = new Set(["cancelled", "late_cancelled"]);

export const isAppointmentCancelled = (appointment: Appointment) =>
  CANCELLED_STATUSES.has(appointment.status);

export const isAppointmentUpcoming = (appointment: Appointment) =>
  ACTIVE_STATUSES.has(appointment.status) && !appointment.is_past_due;

export const isAppointmentPast = (appointment: Appointment) =>
  !isAppointmentCancelled(appointment) && !isAppointmentUpcoming(appointment);

export const getAppointmentSortValue = (appointment: Appointment) => {
  const [year, month, day] = appointment.appointment_date
    .split("-")
    .map(Number);
  const [hour, minute, second = 0] = appointment.appointment_time
    .split(":")
    .map(Number);

  return Date.UTC(year, month - 1, day, hour, minute, second);
};

export const getAppointmentDateParts = (appointment: Appointment) => {
  const [year, month, day] = appointment.appointment_date
    .split("-")
    .map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const [hour, minute] = appointment.appointment_time.split(":").map(Number);
  const time = new Date(Date.UTC(2000, 0, 1, hour, minute));

  return {
    day: new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      timeZone: "UTC",
    }).format(date),
    month: new Intl.DateTimeFormat("en-US", {
      month: "short",
      timeZone: "UTC",
    }).format(date),
    weekday: new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      timeZone: "UTC",
    }).format(date),
    longDate: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date),
    time: new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(time),
  };
};

export const formatCurrency = (value: string) => {
  const amount = Number(String(value).replace(/[^0-9.-]/g, ""));

  if (!Number.isFinite(amount)) return value;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
