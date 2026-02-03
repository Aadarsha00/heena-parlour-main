/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { Appointment } from "../../interface/appointment.interface";
import api from "../axios/api.axios";
import { getServiceById } from "../../api/services.api";

// API function to get appointments for a specific date
const getAppointmentsForDate = async (date: string): Promise<Appointment[]> => {
  try {
    const response = await api.get(`/appointments/?appointment_date=${date}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error?.response?.data?.message || "Failed to fetch appointments";
  }
};

// Helper function to convert 24-hour time to 12-hour format
const convert24to12 = (time24: string): string => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
};

// Helper function to convert time string to minutes
const timeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes = minutes;
  }
  return totalMinutes;
};

// Helper function to convert 12-hour time to 24-hour format
const convert12to24 = (time12: string): string => {
  const [time, period] = time12.split(" ");
  const [hours, minutes] = time.split(":");
  let hour = parseInt(hours, 10);
  if (period === "PM" && hour !== 12) {
    hour += 12;
  } else if (period === "AM" && hour === 12) {
    hour = 0;
  }
  return `${hour.toString().padStart(2, "0")}:${minutes}:00`;
};

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AppointmentBooking = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [viewDate, setViewDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState("11:00 AM");

  // Fetch service data
  const {
    data: service,
    isLoading: serviceLoading,
    error: serviceError,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(Number(serviceId)),
    enabled: !!serviceId,
  });

  // Fetch appointments for the selected date
  const {
    data: appointments = [],
    isLoading: appointmentsLoading,
    error: appointmentsError,
  } = useQuery({
    queryKey: ["appointments", selectedDate],
    queryFn: () => getAppointmentsForDate(selectedDate),
    enabled: !!selectedDate,
    staleTime: 2 * 60 * 1000,
    select: (data) => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object" && "results" in data)
        return (data as any).results || [];
      if (data && typeof data === "object" && "appointments" in data)
        return (data as any).appointments || [];
      return [];
    },
  });

  // Fetch services for booked appointments to get durations
  const bookedServiceIds = Array.isArray(appointments)
    ? appointments.map((apt) => apt.service)
    : [];

  const { data: bookedServices = [], isLoading: bookedServicesLoading } =
    useQuery({
      queryKey: ["bookedServices", bookedServiceIds],
      queryFn: async () => {
        if (bookedServiceIds.length === 0) return [];
        try {
          const servicePromises = bookedServiceIds.map((id) =>
            getServiceById(id)
          );
          return Promise.all(servicePromises);
        } catch (error) {
          console.error("Error fetching booked services:", error);
          return [];
        }
      },
      enabled: bookedServiceIds.length > 0,
    });

  // Calculate available time slots
  const availableTimeSlots = useMemo(() => {
    if (!service || !Array.isArray(appointments) || bookedServicesLoading)
      return TIME_SLOTS;

    const serviceDuration = service.duration_minutes;
    const blockedSlots = new Set<string>();
    const serviceMap = new Map();
    bookedServices.forEach((svc) => serviceMap.set(svc.id, svc));

    appointments.forEach((appointment) => {
      const bookedService = serviceMap.get(appointment.service);
      if (!bookedService) return;

      try {
        const appointmentTime12 = convert24to12(appointment.appointment_time);
        const appointmentStartMinutes = timeToMinutes(appointmentTime12);
        const appointmentEndMinutes =
          appointmentStartMinutes + bookedService.duration_minutes;

        TIME_SLOTS.forEach((slot) => {
          const slotStartMinutes = timeToMinutes(slot);
          const slotEndMinutes = slotStartMinutes + serviceDuration;

          const hasOverlap =
            (slotStartMinutes >= appointmentStartMinutes &&
              slotStartMinutes < appointmentEndMinutes) ||
            (slotEndMinutes > appointmentStartMinutes &&
              slotEndMinutes <= appointmentEndMinutes) ||
            (slotStartMinutes <= appointmentStartMinutes &&
              slotEndMinutes >= appointmentEndMinutes);

          if (hasOverlap) blockedSlots.add(slot);
        });
      } catch (error) {
        console.error("Error processing appointment time:", appointment, error);
      }
    });

    // Block slots that would run past business hours
    const businessEndTime = timeToMinutes("6:00 PM");
    TIME_SLOTS.forEach((slot) => {
      const slotStartMinutes = timeToMinutes(slot);
      const slotEndMinutes = slotStartMinutes + serviceDuration;
      if (slotEndMinutes > businessEndTime) blockedSlots.add(slot);
    });

    return TIME_SLOTS.filter((slot) => !blockedSlots.has(slot));
  }, [service, appointments, bookedServices, bookedServicesLoading]);

  // Totals
  const subTotal = service ? parseFloat(service.price) : 0;
  const bookingDeposit =
    service && service.requires_deposit
      ? parseFloat(service.deposit_amount)
      : 0;
  const total = subTotal + bookingDeposit;

  // Calendar math
  const daysInMonth = viewDate.daysInMonth();
  const startDay = viewDate.startOf("month").day();
  const leadingEmptyDays = startDay === 0 ? 6 : startDay - 1;
  const calendarDays = [
    ...Array(leadingEmptyDays).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const today = dayjs().format("YYYY-MM-DD");

  const handleDateClick = (day: any) => {
    const fullDate = viewDate.date(day).format("YYYY-MM-DD");
    setSelectedDate(fullDate);
  };

  const handleNextClick = () => {
    if (!selectedTime || !selectedDate || availableTimeSlots.length === 0) {
      alert("Please select a date and time slot before proceeding.");
      return;
    }
    const appointmentTime24 = convert12to24(selectedTime);
    navigate("detail", {
      state: {
        serviceId: Number(serviceId),
        appointmentDate: selectedDate,
        appointmentTime: appointmentTime24,
        selectedTimeDisplay: selectedTime,
        service: service,
      },
    });
  };

  // ─── Loading ────────────────────────────────────────────
  if (serviceLoading || appointmentsLoading || bookedServicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-gray-600 font-light text-lg">
            {serviceLoading
              ? "Loading service details…"
              : appointmentsLoading
              ? "Loading appointments…"
              : "Preparing available slots…"}
          </p>
        </div>
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────
  if (serviceError || appointmentsError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376a12 12 0 1021.593 0M12 15.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-gray-700 font-light text-lg">Something went wrong</p>
          <p className="text-gray-500 text-sm font-light">
            {serviceError ? "Could not load service details." : "Could not load appointments."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── No service ─────────────────────────────────────────
  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <p className="text-gray-700 font-light text-lg">Service not found</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-6 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ─── Main render ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-10 w-64 h-64 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-48 h-48 bg-gradient-to-br from-amber-400/8 to-yellow-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-16">

          {/* ── Page Header ── */}
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-5" />
            <h1 className="text-4xl lg:text-5xl font-display font-light text-gray-900 leading-tight">
              Book Your
              <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">
                Appointment
              </span>
            </h1>
          </div>

          {/* ── Step Tracker ── */}
          <div className="flex items-center justify-center mb-10">
            {["Services", "Date & Time", "Your Details"].map((step, index) => {
              const isCompleted = index < 1;
              const isCurrent  = index === 1;

              return (
                <div key={step} className="flex items-center">
                  {index > 0 && (
                    <div className={`w-12 lg:w-24 h-0.5 ${
                      isCompleted || isCurrent
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                        : "bg-gray-200"
                    }`} />
                  )}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-md shadow-yellow-400/30"
                        : isCurrent
                        ? "bg-white border-2 border-amber-500 text-amber-600 shadow-md shadow-yellow-400/20 ring-4 ring-yellow-100"
                        : "bg-gray-100 border border-gray-200 text-gray-400"
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium tracking-wide uppercase ${
                      isCompleted ? "text-amber-600"
                        : isCurrent ? "text-amber-600 font-semibold"
                        : "text-gray-400"
                    }`}>{step}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Two-column grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: Calendar + Time Slots ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Calendar card */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="p-6 lg:p-8">

                  {/* label row */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
                    <h2 className="text-sm font-display font-medium text-yellow-700 tracking-wide uppercase">Choose a Date</h2>
                  </div>

                  {/* Month nav - now takes full width */}
                  <div>
                    <div className="flex justify-between items-center mb-5">
                      <button
                        onClick={() => setViewDate(viewDate.subtract(1, "month"))}
                        className="group p-2 hover:opacity-70 transition-opacity duration-200"
                        type="button"
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                      </button>

                      <h3 className="text-xl font-display font-semibold text-gray-900">
                        {viewDate.format("MMMM")} <span className="font-medium text-amber-600">{viewDate.format("YYYY")}</span>
                      </h3>

                      <button
                        onClick={() => setViewDate(viewDate.add(1, "month"))}
                        className="group p-2 hover:opacity-70 transition-opacity duration-200"
                        type="button"
                        style={{ backgroundColor: 'transparent', border: 'none' }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#d97706' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>

                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {WEEKDAYS.map((d) => (
                        <div key={d} className="text-center text-sm font-semibold text-amber-600 uppercase tracking-wider py-2">{d}</div>
                      ))}
                    </div>

                    {/* Day grid - compact with proper sizing */}
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, index) => {
                        if (!day) return <div key={`e-${index}`} />;

                        const fullDate = viewDate.date(day).format("YYYY-MM-DD");
                        const isSelected = selectedDate === fullDate;
                        const isToday   = fullDate === today;
                        const isPast    = viewDate.date(day).isBefore(dayjs(), "day");

                        return (
                          <button
                            key={index}
                            onClick={() => !isPast && handleDateClick(day)}
                            disabled={isPast}
                            style={{
                              backgroundColor: isSelected 
                                ? undefined 
                                : 'transparent',
                              color: isPast 
                                ? '#d1d5db' 
                                : isSelected 
                                ? '#000' 
                                : '#d97706',
                              fontWeight: isSelected ? '700' : '600'
                            }}
                            className={`
                              w-9 h-9 flex items-center justify-center text-base rounded-xl transition-all duration-200
                              ${isPast
                                ? "cursor-not-allowed"
                                : isSelected
                                ? "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md shadow-yellow-400/30"
                                : isToday
                                ? "border-2 border-amber-500 hover:bg-yellow-50"
                                : "hover:bg-yellow-50"
                              }
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* end full-width calendar */}
                </div>
              </div>

              {/* Time Slots card */}
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="p-6 lg:p-8">

                  {/* label + meta — all flush left, no orphan indent */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
                    <h2 className="text-base font-display font-semibold text-yellow-700 tracking-wide uppercase">Pick a Time</h2>
                  </div>
                  <p className="text-gray-700 font-medium text-base">{dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</p>
                  <p className="text-gray-500 font-medium text-sm mb-5">Service duration: {service.duration_minutes} min</p>

                  {availableTimeSlots.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
                      <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4m6 0a10 10 0 11-20 0 10 10 0 0120 0z" />
                      </svg>
                      <p className="text-gray-700 font-semibold text-base">No available slots for this date</p>
                      <p className="text-gray-500 text-sm font-medium mt-1">Please choose another date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {availableTimeSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={`
                              relative group py-3 px-4 rounded-xl border text-base font-semibold transition-all duration-300 text-center
                              ${isSelected
                                ? "bg-gradient-to-br from-yellow-400 to-amber-500 border-transparent text-black shadow-md shadow-yellow-400/30 -translate-y-0.5"
                                : "bg-white border-gray-200 text-gray-700 hover:border-yellow-300 hover:shadow-sm hover:-translate-y-0.5"
                              }
                            `}
                          >
                            {!isSelected && (
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                            )}
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* booked-count note */}
                  {Array.isArray(appointments) && TIME_SLOTS.length - availableTimeSlots.length > 0 && (
                    <p className="text-sm text-gray-600 font-medium mt-4">
                      {TIME_SLOTS.length - availableTimeSlots.length} slot(s) already booked for this date
                    </p>
                  )}

                  {/* CTA — not full-width; sits left-aligned */}
                  <div className="mt-7">
                    <button
                      onClick={handleNextClick}
                      disabled={availableTimeSlots.length === 0}
                      className={`
                        group inline-flex items-center gap-3 px-8 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300
                        ${availableTimeSlots.length > 0
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:shadow-xl hover:shadow-yellow-400/25 hover:-translate-y-0.5 cursor-pointer"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      Proceed to Confirmation
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${availableTimeSlots.length > 0 ? "group-hover:translate-x-1" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Booking Summary (sticky) ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="p-6 space-y-5">

                  {/* Title */}
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
                    <h2 className="text-base font-display font-semibold text-yellow-700 tracking-wide uppercase">Your Booking</h2>
                  </div>

                  {/* Selected service pill */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Selected Service</p>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-800 font-semibold">{service.name}</span>
                      <span className="text-base font-bold text-gray-900">${parseFloat(service.price).toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-1">Duration: {service.duration_minutes} min</p>
                  </div>

                  {/* Appointment details */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Appointment Details</p>
                    <div className="space-y-1.5 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v1.5M17.25 3v1.5M3 8.25h18.75M5.25 4.5h13.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25z" />
                        </svg>
                        {dayjs(selectedDate).format("dddd, MMMM D, YYYY")}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4m6 0a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                        {selectedTime}
                      </div>
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Price Summary</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-gray-700 font-medium">
                        <span>Sub Total</span>
                        <span>${subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 font-medium">
                        <span>Booking Deposit</span>
                        <span>${bookingDeposit.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                        <span className="text-gray-900 font-semibold">Total</span>
                        <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-2.5 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
                      <p className="text-xs text-green-700 font-medium italic">
                        {service.requires_deposit && bookingDeposit > 0
                          ? `$${bookingDeposit.toFixed(2)} deposit required now — remaining balance due at appointment.`
                          : "Full payment due at appointment."}
                      </p>
                    </div>
                  </div>

                  {/* Cancellation */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Cancellation Policy</p>
                    <ul className="text-sm text-gray-600 font-medium space-y-1">
                      <li className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span>Free cancellation up to 24 hours before</li>
                      <li className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span>Late cancellations incur a 10% service fee</li>
                      <li className="flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span>Deposit is non-refundable but applied to your bill</li>
                    </ul>
                  </div>

                  {/* Help */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-1.5">Need Help?</p>
                    <p className="text-base text-amber-600 font-semibold">📞 (410) 555-1234</p>
                    <p className="text-sm text-gray-500 font-medium">Mon–Fri, 9 AM – 6 PM</p>
                  </div>

                  {/* Accent dots */}
                  <div className="flex justify-center gap-2 pt-1">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;