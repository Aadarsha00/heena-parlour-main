import React from "react";
import { Filter } from "lucide-react";

export type FilterType =
  | "all"
  | "upcoming"
  | "payment_pending"
  | "confirmed"
  | "cancelled";

interface AppointmentFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters = [
    { key: "all" as FilterType, label: "All Appointments" },
    { key: "upcoming" as FilterType, label: "Upcoming" },
    { key: "payment_pending" as FilterType, label: "Payment Pending" },
    { key: "confirmed" as FilterType, label: "Confirmed" },
    { key: "cancelled" as FilterType, label: "Cancelled" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Filter className="h-5 w-5 text-gray-400 mt-2 mr-2" />
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default AppointmentFilters;
