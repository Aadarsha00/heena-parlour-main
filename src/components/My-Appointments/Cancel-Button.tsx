import { LoaderCircle, X } from "lucide-react";
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
      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <X className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      {isLoading ? "Cancelling..." : "Cancel appointment"}
    </button>
  );
};

export default CancelButton;
