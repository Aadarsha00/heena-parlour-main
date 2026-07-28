import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";

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
  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));
  const [viewDate, setViewDate] = useState(today.startOf("month"));
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

  const selectDate = (date: Dayjs) => {
    setSelectedDate(date.format("YYYY-MM-DD"));
    setSelectedTime(null);
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
    <main className="min-h-screen bg-[#fffefc] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Choose your appointment
        </h1>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-xl bg-white p-5 shadow-lg sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate((date) => date.subtract(1, "month"))}
                disabled={!viewDate.isAfter(today.startOf("month"), "month")}
                className="rounded px-3 py-2 text-sm disabled:opacity-30"
                aria-label="Previous month"
              >
                ← Previous
              </button>
              <h2 className="text-lg font-semibold">
                {viewDate.format("MMMM YYYY")}
              </h2>
              <button
                type="button"
                onClick={() => setViewDate((date) => date.add(1, "month"))}
                disabled={!viewDate
                  .add(1, "month")
                  .startOf("month")
                  .isBefore(lastBookableDate, "day")}
                className="rounded px-3 py-2 text-sm disabled:opacity-30"
                aria-label="Next month"
              >
                Next →
              </button>
            </div>

            <div className="grid grid-cols-7 text-center">
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
                return (
                  <button
                    type="button"
                    key={date.format("YYYY-MM-DD")}
                    disabled={disabled}
                    onClick={() => selectDate(date)}
                    aria-pressed={selected}
                    className={`m-1 aspect-square rounded-full text-sm ${
                      selected
                        ? "bg-[#A0522D] text-white"
                        : "hover:bg-stone-100 disabled:text-gray-300 disabled:hover:bg-transparent"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t pt-6">
              <h2 className="text-lg font-semibold">
                Available times for {dayjs(selectedDate).format("MMMM D")}
              </h2>
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
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      type="button"
                      key={slot.value}
                      onClick={() => setSelectedTime(slot.value)}
                      aria-pressed={selectedTime === slot.value}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        selectedTime === slot.value
                          ? "border-[#A0522D] bg-[#A0522D] text-white"
                          : "border-stone-300 hover:border-[#A0522D]"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-xl bg-white p-6 shadow-lg lg:sticky lg:top-24">
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
