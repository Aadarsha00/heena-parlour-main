import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";

export interface AppointmentStatsData {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

const AppointmentStats = ({ stats }: { stats: AppointmentStatsData }) => {
  const cards = [
    {
      label: "All bookings",
      value: stats.total,
      icon: CalendarDays,
      color: "bg-[#f4ede7] text-[#8b5a3c]",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock3,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "bg-sky-50 text-sky-700",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-stone-100 text-stone-600",
    },
  ];

  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border-b border-stone-100 p-4 even:border-l sm:p-5 lg:border-b-0 lg:border-l lg:first:border-l-0"
        >
          <div className="flex items-center gap-3">
            <div className={`${card.color} rounded-xl p-2.5`}>
              <card.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </div>
            <div>
              <dt className="text-xs font-medium text-stone-500 sm:text-sm">
                {card.label}
              </dt>
              <dd className="mt-0.5 text-xl font-semibold tracking-tight text-stone-950 sm:text-2xl">
                {card.value}
              </dd>
            </div>
          </div>
        </div>
      ))}
    </dl>
  );
};

export default AppointmentStats;
