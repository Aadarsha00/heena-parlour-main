import { Calendar, Clock, Tag, User } from "lucide-react";

import type { Appointment } from "../../interface/appointment.interface";
import CancelButton from "./Cancel-Button";
import StatusBadge from "./Status-Badge";

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
  const appointmentDate = new Date(
    `${appointment.appointment_date}T${appointment.appointment_time}`
  );

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {appointment.service_details?.name ?? `Service #${appointment.service}`}
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            {appointmentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" at "}
            {appointmentDate.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="mt-5 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          {appointment.duration_minutes} minutes
        </div>
        <div className="flex items-center">
          <Tag className="mr-2 h-4 w-4" />
          Service price: ${Number(appointment.total_amount).toFixed(2)}
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Booked {new Date(appointment.created_at).toLocaleDateString()}
        </div>
        {appointment.stylist_name && (
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            {appointment.stylist_name}
          </div>
        )}
      </div>

      {appointment.notes && (
        <p className="mt-4 rounded bg-stone-50 p-3 text-sm text-gray-700">
          {appointment.notes}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <CancelButton
          appointment={appointment}
          onCancel={onCancel}
          isLoading={cancelLoading}
        />
      </div>
    </article>
  );
};

export default AppointmentCard;
