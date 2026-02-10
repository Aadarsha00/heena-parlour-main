import React from "react";
import { Trash2, XCircle } from "lucide-react";
import type { Appointment } from "../../interface/appointment.interface";

// Utility function to check if appointment can be cancelled (24 hour rule)
const canCancelAppointment = (
  appointmentDate: string,
  appointmentTime: string
): boolean => {
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const currentTime = new Date();
  const hoursDifference =
    (appointmentDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
  return hoursDifference > 24;
};

interface CancelButtonProps {
  appointment: Appointment;
  onCancel: (id: number) => void;
  isLoading: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({
  appointment,
  onCancel,
  isLoading,
}) => {
  const canCancel = canCancelAppointment(
    appointment.appointment_date,
    appointment.appointment_time
  );

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      onCancel(appointment.id);
    }
  };

  if (!canCancel) {
    return (
      <button
        disabled
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
        title="Cannot cancel within 24 hours of appointment"
      >
        <XCircle className="h-4 w-4 mr-2" />
        Cannot Cancel
      </button>
    );
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      {isLoading ? "Cancelling..." : "Cancel"}
    </button>
  );
};

export default CancelButton;
