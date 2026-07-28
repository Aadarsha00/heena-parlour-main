export type FilterType =
  | "all"
  | "upcoming"
  | "confirmed"
  | "cancelled"
  | "past";

interface AppointmentFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

const FILTERS: Array<{ key: FilterType; label: string }> = [
  { key: "upcoming", label: "Upcoming" },
  { key: "confirmed", label: "Confirmed" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
];

const AppointmentFilters = ({
  activeFilter,
  onFilterChange,
  counts,
}: AppointmentFiltersProps) => (
  <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
    <div
      className="flex min-w-max items-center gap-1 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-sm"
      role="group"
      aria-label="Filter appointments"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <button
            type="button"
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            aria-pressed={isActive}
            className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a3c] focus-visible:ring-offset-2 sm:px-4 ${
              isActive
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
            }`}
          >
            {filter.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[11px] leading-none ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {counts[filter.key]}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default AppointmentFilters;
