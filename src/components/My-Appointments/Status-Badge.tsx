import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import type { AppointmentStatus } from "../../interface/appointment.interface";

const STATUS_INFO: Record<
  AppointmentStatus,
  { label: string; color: string; icon: typeof AlertCircle }
> = {
  booked: {
    label: "Awaiting confirmation",
    color: "bg-blue-100 text-blue-800",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700",
    icon: XCircle,
  },
  late_cancelled: {
    label: "Late cancellation",
    color: "bg-orange-100 text-orange-800",
    icon: XCircle,
  },
  no_show: {
    label: "No show",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const info = STATUS_INFO[status];
  const Icon = info.icon;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${info.color}`}
    >
      <Icon className="mr-1 h-3 w-3" />
      {info.label}
    </span>
  );
};

export default StatusBadge;
