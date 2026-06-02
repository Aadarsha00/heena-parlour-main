import React from "react";
import { Calendar, Clock, CreditCard, CheckCircle } from "lucide-react";

export interface AppointmentStatsData {
  total: number;
  upcoming: number;
  paymentPending: number;
  confirmed: number;
  cancelled: number;
}

interface AppointmentStatsProps {
  stats: AppointmentStatsData;
}

const AppointmentStats: React.FC<AppointmentStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Total Appointments",
      value: stats.total,
      color: "bg-blue-500",
      icon: Calendar,
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      color: "bg-green-500",
      icon: Clock,
    },
    {
      label: "Payment Pending",
      value: stats.paymentPending,
      color: "bg-yellow-500",
      icon: CreditCard,
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      color: "bg-purple-500",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.color} rounded-md p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStats;
