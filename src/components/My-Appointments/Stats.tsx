import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

export interface AppointmentStatsData {
  total: number;
  upcoming: number;
  confirmed: number;
  cancelled: number;
}

const AppointmentStats = ({ stats }: { stats: AppointmentStatsData }) => {
  const cards = [
    { label: "Total", value: stats.total, icon: Calendar, color: "bg-blue-600" },
    { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "bg-green-600" },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "bg-purple-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-gray-600",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg bg-white p-4 shadow sm:p-6">
          <div className="flex items-center">
            <div className={`${card.color} rounded-md p-2 sm:p-3`}>
              <card.icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-500 sm:text-sm">
                {card.label}
              </p>
              <p className="text-xl font-semibold sm:text-2xl">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats;
