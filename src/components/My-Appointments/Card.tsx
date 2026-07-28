import {
  Clock3,
  History,
  MapPin,
  RotateCcw,
  Sparkles,
  StickyNote,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { Appointment } from "../../interface/appointment.interface";
import CancelButton from "./Cancel-Button";
import StatusBadge from "./Status-Badge";
import {
  formatCurrency,
  getAppointmentDateParts,
  isAppointmentCancelled,
  isAppointmentPast,
  isAppointmentUpcoming,
} from "./appointment.utils";

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: number) => void;
  cancelLoading: boolean;
}

const AppointmentCard = ({
  appointment,
  onCancel,
  cancelLoading,
}: AppointmentCardProps) => {
  const date = getAppointmentDateParts(appointment);
  const upcoming = isAppointmentUpcoming(appointment);
  const cancelled = isAppointmentCancelled(appointment);
  const past = isAppointmentPast(appointment);
  const titleId = `appointment-${appointment.id}-title`;
  const serviceName =
    appointment.service_details?.name ?? `Service #${appointment.service}`;
  const createdDate = new Date(appointment.created_at);
  const createdLabel = Number.isNaN(createdDate.getTime())
    ? null
    : createdDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  const accentClass = upcoming
    ? appointment.status === "confirmed"
      ? "bg-emerald-500"
      : "bg-amber-500"
    : cancelled
      ? "bg-stone-300"
      : "bg-[#a4775b]";

  return (
    <article
      aria-labelledby={titleId}
      className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_10px_35px_rgba(41,37,36,0.06)] transition-shadow hover:shadow-[0_14px_42px_rgba(41,37,36,0.10)]"
    >
      <div
        className={`absolute inset-y-0 left-0 w-1.5 ${accentClass}`}
        aria-hidden="true"
      />

      <div className="p-5 pl-6 sm:p-7 sm:pl-8">
        <div className="flex items-start gap-4 sm:gap-6">
          <time
            dateTime={`${appointment.appointment_date}T${appointment.appointment_time}`}
            className="flex w-16 shrink-0 flex-col items-center overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 text-center sm:w-20"
            aria-label={`${date.longDate} at ${date.time} Eastern Time`}
          >
            <span className="w-full bg-stone-900 px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white sm:text-xs">
              {date.month}
            </span>
            <span className="pt-2 text-2xl font-semibold leading-none tracking-tight text-stone-950 sm:text-3xl">
              {date.day}
            </span>
            <span className="pb-2 pt-1 text-[11px] font-medium text-stone-500 sm:text-xs">
              {date.weekday}
            </span>
          </time>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row">
              <div className="min-w-0">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#8b5a3c]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Beauty appointment
                </p>
                <h2
                  id={titleId}
                  className="text-lg font-semibold tracking-tight text-stone-950 sm:text-xl"
                >
                  {serviceName}
                </h2>
              </div>
              <StatusBadge status={appointment.status} />
            </div>

            <div className="mt-4 flex flex-col gap-1">
              <p className="text-base font-semibold text-stone-900">
                {date.longDate}
              </p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-stone-600">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-[#9a6a4c]" aria-hidden="true" />
                  {date.time}
                </span>
                <span aria-hidden="true">•</span>
                <span>{appointment.duration_minutes} minutes</span>
                <span className="text-xs text-stone-500">
                  (Baltimore / Eastern Time)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl bg-[#faf9f6] p-4 text-sm sm:ml-[6.5rem] sm:grid-cols-2 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#8b5a3c] shadow-sm">
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-500">Artist</p>
              <p className="truncate font-medium text-stone-800">
                {appointment.stylist_name || "Assigned by the salon"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#8b5a3c] shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-stone-500">Service price</p>
              <p className="font-medium text-stone-800">
                {formatCurrency(appointment.total_amount)}
              </p>
            </div>
          </div>

          {appointment.notes && (
            <div className="flex items-start gap-3 sm:col-span-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#8b5a3c] shadow-sm">
                <StickyNote className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-stone-500">Your note</p>
                <p className="break-words font-medium text-stone-800">
                  {appointment.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t border-stone-100 pt-5 sm:ml-[6.5rem] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
            {upcoming && (
              <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                Upcoming
              </span>
            )}
            {past && (
              <span className="inline-flex items-center gap-1.5 font-medium text-stone-600">
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                Past appointment
              </span>
            )}
            {createdLabel && <span>Booked {createdLabel}</span>}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            {(past || cancelled) && (
              <Link
                to={`/booking/${appointment.service}`}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2"
                aria-label={`Book ${serviceName} again`}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Book again
              </Link>
            )}
            <CancelButton
              appointment={appointment}
              onCancel={onCancel}
              isLoading={cancelLoading}
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default AppointmentCard;
