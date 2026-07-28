import { Filter } from "lucide-react";

export type FilterType =
  | "all"
  | "upcoming"
  | "confirmed"
  | "cancelled"
  | "history";

interface AppointmentFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: Array<{ key: FilterType; label: string }> = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "history", label: "History" },
];

const AppointmentFilters = ({
  activeFilter,
  onFilterChange,
}: AppointmentFiltersProps) => (
  <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Appointment filters">
    <Filter className="mr-1 h-5 w-5 text-gray-500" aria-hidden="true" />
    {FILTERS.map((filter) => (
      <button
        type="button"
        key={filter.key}
        onClick={() => onFilterChange(filter.key)}
        aria-pressed={activeFilter === filter.key}
        className={`rounded-lg px-4 py-2 text-sm font-medium ${
          activeFilter === filter.key
            ? "bg-[#A0522D] text-white"
            : "bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        {filter.label}
      </button>
    ))}
  </div>
);

export default AppointmentFilters;
