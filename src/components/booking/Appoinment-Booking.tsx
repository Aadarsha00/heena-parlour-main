import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";

import { getAvailability } from "../../api/appointment.api";
import { getServiceById } from "../../api/services.api";
import { formatUsdPrice } from "../../lib/format-price";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX_ADVANCE_DAYS = 90;

const AppointmentBooking = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const numericServiceId = Number(serviceId);
  const today = dayjs().startOf("day");
  const lastBookableDate = today.add(MAX_ADVANCE_DAYS, "day");
  const firstBookableMonth = today.startOf("month");
  const lastBookableMonth = lastBookableDate.startOf("month");
  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));
  const [viewDate, setViewDate] = useState(firstBookableMonth);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const serviceQuery = useQuery({
    queryKey: ["service", numericServiceId],
    queryFn: () => getServiceById(numericServiceId),
    enabled: Number.isInteger(numericServiceId) && numericServiceId > 0,
  });

  const availabilityQuery = useQuery({
    queryKey: ["availability", numericServiceId, selectedDate],
    queryFn: () => getAvailability(numericServiceId, selectedDate),
    enabled: Boolean(serviceQuery.data),
    staleTime: 15_000,
  });

  const service = serviceQuery.data;
  const slots = availabilityQuery.data?.slots ?? [];
  const selectedSlot = slots.find((slot) => slot.value === selectedTime);
  const leadingDays = (viewDate.startOf("month").day() + 6) % 7;
  const calendarDays: Array<number | null> = [
    ...Array.from({ length: leadingDays }, () => null),
    ...Array.from({ length: viewDate.daysInMonth() }, (_, index) => index + 1),
  ];
  const bookableMonths = Array.from(
    { length: lastBookableMonth.diff(firstBookableMonth, "month") + 1 },
    (_, index) => firstBookableMonth.add(index, "month")
  );
  const canViewPreviousMonth = viewDate.isAfter(firstBookableMonth, "month");
  const canViewNextMonth = viewDate.isBefore(lastBookableMonth, "month");

  const selectDate = (date: Dayjs) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setSelectedTime(null);
  };

  const showMonth = (month: Dayjs) => {
    const nextMonth = month.startOf("month");
    setViewDate(nextMonth);

    if (!dayjs(selectedDate).isSame(nextMonth, "month")) {
      const firstSelectableDate = nextMonth.isSame(today, "month")
        ? today
        : nextMonth;
      selectDate(
        firstSelectableDate.isAfter(lastBookableDate, "day")
          ? lastBookableDate
          : firstSelectableDate
      );
    }
  };

  const proceed = () => {
    if (!selectedSlot || !service) return;
    const params = new URLSearchParams({
      date: selectedDate,
      time: selectedSlot.value,
    });
    navigate(`/booking/${numericServiceId}/detail?${params}`);
  };

  if (serviceQuery.isLoading) {
    return <p className="min-h-screen grid place-items-center">Loading service…</p>;
  }

  if (serviceQuery.isError || !service) {
    return (
      <div className="min-h-screen grid place-items-center text-center">
        <div>
          <p className="text-xl font-semibold text-red-700">
            This service is unavailable.
          </p>
          <button className="mt-4 underline" onClick={() => navigate("/services")}>
            Return to services
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fffefc] px-4 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <button
          type="button"
          onClick={() => navigate("/services")}
          className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D]"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to services
        </button>
        <h1 className="mb-8 mt-4 px-2 text-center text-2xl font-bold sm:text-3xl">
          Choose your appointment
        </h1>

        <div className="grid min-w-0 gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="min-w-0 rounded-xl bg-white p-5 shadow-lg sm:p-7">
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2 text-stone-900">
                <CalendarDays className="h-5 w-5 text-[#A0522D]" />
                <h2 className="text-lg font-semibold">Select a date</h2>
              </div>

              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 p-2 sm:gap-4">
              <button
                type="button"
                onClick={() => showMonth(viewDate.subtract(1, "month"))}
                disabled={!canViewPreviousMonth}
                className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-[#A0522D] hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <label className="block min-w-0 max-w-full overflow-hidden">
                <span className="sr-only">Choose month</span>
                <select
                  value={viewDate.format("YYYY-MM")}
                  onChange={(event) =>
                    showMonth(dayjs(`${event.target.value}-01`))
                  }
                  className="min-h-11 w-full min-w-0 max-w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-center text-sm font-semibold text-stone-900 shadow-sm outline-none focus:border-[#A0522D] focus:ring-2 focus:ring-[#A0522D]/20 sm:px-3 sm:text-base"
                >
                  {bookableMonths.map((month) => (
                    <option
                      key={month.format("YYYY-MM")}
                      value={month.format("YYYY-MM")}
                    >
                      {month.format("MMMM YYYY")}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => showMonth(viewDate.add(1, "month"))}
                disabled={!canViewNextMonth}
                className="inline-flex min-h-11 items-center justify-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm transition hover:border-[#A0522D] hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-400 disabled:shadow-none"
                aria-label="Next month"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((weekday) => (
                <div key={weekday} className="py-2 text-xs font-semibold text-gray-500">
                  {weekday}
                </div>
              ))}
              {calendarDays.map((day, index) => {
                if (!day) return <div key={`empty-${index}`} />;
                const date = viewDate.date(day).startOf("day");
                const disabled =
                  date.isBefore(today, "day") ||
                  date.isAfter(lastBookableDate, "day");
                const selected = date.format("YYYY-MM-DD") === selectedDate;
                const isToday = date.isSame(today, "day");
                return (
                  <button
                    type="button"
                    key={date.format("YYYY-MM-DD")}
                    disabled={disabled}
                    onClick={() => selectDate(date)}
                    aria-pressed={selected}
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${date.format("dddd, MMMM D, YYYY")}${
                      isToday ? ", today" : ""
                    }`}
                    className={`relative h-11 min-h-11 rounded-lg border p-0 text-sm font-semibold transition focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2 ${
                      selected
                        ? "border-[#A0522D] bg-[#A0522D] text-white shadow-sm"
                        : disabled
                          ? "cursor-not-allowed border-transparent bg-transparent text-stone-300"
                          : `border-transparent bg-white text-stone-900 hover:border-amber-300 hover:bg-amber-50 ${
                              isToday ? "ring-1 ring-[#A0522D]" : ""
                            }`
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center gap-2 text-stone-900">
                <Clock3 className="h-5 w-5 text-[#A0522D]" />
                <h2 className="text-lg font-semibold">
                  Available times for{" "}
                  {dayjs(selectedDate).format("MMMM D")}
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {service.duration_minutes}-minute service
              </p>

              {availabilityQuery.isLoading ? (
                <p className="py-8 text-gray-600">Checking availability…</p>
              ) : availabilityQuery.isError ? (
                <div className="py-8 text-red-700">
                  <p>Availability could not be loaded.</p>
                  <button
                    type="button"
                    className="mt-2 underline"
                    onClick={() => availabilityQuery.refetch()}
                  >
                    Try again
                  </button>
                </div>
              ) : slots.length === 0 ? (
                <p className="py-8 text-gray-600">
                  No times remain on this date. Please choose another day.
                </p>
              ) : (
                <div className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      aria-pressed={selectedTime === slot.value}
                      aria-label={`Select ${slot.label}`}
                      className={`inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-lg border-2 px-2 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0522D] focus-visible:ring-offset-2 sm:px-3 ${
                        selectedTime === slot.value
                          ? "border-[#A0522D] bg-[#A0522D] text-white"
                          : "border-stone-300 bg-white text-stone-900 hover:border-[#A0522D] hover:bg-amber-50"
                      }`}
                    >
                      {selectedTime === slot.value && (
                        <Check className="h-4 w-4" aria-hidden="true" />
                      )}
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit min-w-0 rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold">Booking summary</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Service</dt>
                <dd className="font-medium">{service.name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Date</dt>
                <dd>{dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Time</dt>
                <dd>{selectedSlot?.label ?? "Choose a time"}</dd>
              </div>
              <div className="flex justify-between border-t pt-4 text-base">
                <dt>Service price</dt>
                <dd className="font-semibold">
                  {formatUsdPrice(service.price)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded bg-stone-50 p-3 text-xs text-gray-600">
              No online payment is required. Pay at the parlour after your service.
            </p>
            <button
              type="button"
              onClick={proceed}
              disabled={!selectedSlot || availabilityQuery.isFetching}
              className="mt-6 w-full rounded-lg bg-[#A0522D] py-3 font-semibold text-white hover:bg-[#8B4513] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Continue
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default AppointmentBooking;
