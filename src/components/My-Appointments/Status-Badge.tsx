import {
  AlertCircle,
  CheckCircle2,
  CircleDot,
  Clock3,
  XCircle,
} from "lucide-react";
import type { AppointmentStatus } from "../../interface/appointment.interface";

const STATUS_INFO: Record<
  AppointmentStatus,
  { label: string; color: string; icon: typeof AlertCircle }
> = {
  booked: {
    label: "Pending confirmation",
    color: "border-amber-200 bg-amber-50 text-amber-800",
    icon: Clock3,
  },
  confirmed: {
    label: "Confirmed",
    color: "border-emerald-200 bg-emerald-50 text-emerald-800",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    color: "border-stone-200 bg-stone-50 text-stone-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "border-stone-200 bg-stone-100 text-stone-600",
    icon: XCircle,
  },
  late_cancelled: {
    label: "Late cancellation",
    color: "border-orange-200 bg-orange-50 text-orange-800",
    icon: AlertCircle,
  },
  no_show: {
    label: "No show",
    color: "border-rose-200 bg-rose-50 text-rose-700",
    icon: CircleDot,
  },
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const info = STATUS_INFO[status];
  const Icon = info.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${info.color}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {info.label}
    </span>
  );
};

export default StatusBadge;
