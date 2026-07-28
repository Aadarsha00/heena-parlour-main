import { Trash2 } from "lucide-react";
import type { Appointment } from "../../interface/appointment.interface";

interface CancelButtonProps {
  appointment: Appointment;
  onCancel: (id: number) => void;
  isLoading: boolean;
}

const CancelButton = ({
  appointment,
  onCancel,
  isLoading,
}: CancelButtonProps) => {
  if (
    appointment.is_past_due ||
    !["booked", "confirmed"].includes(appointment.status)
  ) {
    return null;
  }

  const handleCancel = () => {
    const warning = appointment.can_cancel
      ? "Cancel this appointment?"
      : "This is within 24 hours and will be recorded as a late cancellation. Continue?";
    if (window.confirm(warning)) onCancel(appointment.id);
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={isLoading}
      className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      {isLoading ? "Cancelling…" : "Cancel appointment"}
    </button>
  );
};

export default CancelButton;
