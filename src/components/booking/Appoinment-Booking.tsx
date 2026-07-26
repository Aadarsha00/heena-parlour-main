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

// FIXED: Move timeSlots constant outside component to prevent re-creation on every render
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

const AppointmentBooking = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [viewDate, setViewDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState("11:00 AM");

  // Fetch service data using React Query
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
      // Handle different API response formats
      if (Array.isArray(data)) {
        return data;
      }
      // If API returns paginated response like { results: [...] }
      if (data && typeof data === "object" && "results" in data) {
        const results = (data as any).results || [];
        return results;
      }
      // If API returns object with appointments key
      if (data && typeof data === "object" && "appointments" in data) {
        const appointments = (data as any).appointments || [];
        return appointments;
      }
      return [];
    },
  });

  // We also need to fetch services for the booked appointments to get their durations
  const bookedServiceIds = Array.isArray(appointments)
    ? appointments.map((apt) => apt.service)
    : [];

  const { data: bookedServices = [], isLoading: bookedServicesLoading } =
    useQuery({
      queryKey: ["bookedServices", bookedServiceIds],
      queryFn: async () => {
        if (bookedServiceIds.length === 0) return [];
        try {
          // Fetch all services for the booked appointments
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

  // FIXED: Calculate available time slots with TIME_SLOTS constant
  const availableTimeSlots = useMemo(() => {
    if (!service || !Array.isArray(appointments) || bookedServicesLoading)
      return TIME_SLOTS;

    const serviceDuration = service.duration_minutes;
    const blockedSlots = new Set<string>();

    // Create a map of service ID to service object for quick lookup
    const serviceMap = new Map();
    bookedServices.forEach((svc) => serviceMap.set(svc.id, svc));

    // For each existing appointment, calculate which time slots are blocked
    appointments.forEach((appointment) => {
      const bookedService = serviceMap.get(appointment.service);
      if (!bookedService) return; // Skip if service data not available

      try {
        // Convert 24-hour time to 12-hour format for comparison
        const appointmentTime12 = convert24to12(appointment.appointment_time);
        const appointmentStartMinutes = timeToMinutes(appointmentTime12);
        const appointmentEndMinutes =
          appointmentStartMinutes + bookedService.duration_minutes;

        // Block all time slots that would conflict with this appointment
        TIME_SLOTS.forEach((slot) => {
          const slotStartMinutes = timeToMinutes(slot);
          const slotEndMinutes = slotStartMinutes + serviceDuration;

          // Check if there's any overlap between the new service and existing appointment
          const hasOverlap =
            // New service starts during existing appointment
            (slotStartMinutes >= appointmentStartMinutes &&
              slotStartMinutes < appointmentEndMinutes) ||
            // New service ends during existing appointment
            (slotEndMinutes > appointmentStartMinutes &&
              slotEndMinutes <= appointmentEndMinutes) ||
            // New service completely encompasses existing appointment
            (slotStartMinutes <= appointmentStartMinutes &&
              slotEndMinutes >= appointmentEndMinutes);

          if (hasOverlap) {
            blockedSlots.add(slot);
          }
        });
      } catch (error) {
        console.error("Error processing appointment time:", appointment, error);
      }
    });

    // Also block slots that would run past business hours (6 PM end time)
    const businessEndTime = timeToMinutes("6:00 PM");
    TIME_SLOTS.forEach((slot) => {
      const slotStartMinutes = timeToMinutes(slot);
      const slotEndMinutes = slotStartMinutes + serviceDuration;
      if (slotEndMinutes > businessEndTime) {
        blockedSlots.add(slot);
      }
    });

    return TIME_SLOTS.filter((slot) => !blockedSlots.has(slot));
  }, [service, appointments, bookedServices, bookedServicesLoading]);

  // Calculate totals based on fetched service data
  const subTotal = service ? parseFloat(service.price) : 0;
  const bookingDeposit =
    service && service.requires_deposit
      ? parseFloat(service.deposit_amount)
      : 0;
  const total = subTotal + bookingDeposit;

  const daysInMonth = viewDate.daysInMonth();
  const startDay = viewDate.startOf("month").day(); // 0 = Sunday

  // Fix: Properly calculate leading empty days for Monday start
  const leadingEmptyDays = startDay === 0 ? 6 : startDay - 1;

  const calendarDays = [
    ...Array(leadingEmptyDays).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleDateClick = (day: any) => {
    const fullDate = viewDate.date(day).format("YYYY-MM-DD");
    setSelectedDate(fullDate);
  };

  // Handle navigation to details page
  const handleNextClick = () => {
    if (!selectedTime || !selectedDate || availableTimeSlots.length === 0) {
      alert("Please select a date and time slot before proceeding.");
      return;
    }

    // Convert time to 24-hour format for the API
    const appointmentTime24 = convert12to24(selectedTime);

    // Navigate to details page with appointment data
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

  // Loading state
  if (serviceLoading || appointmentsLoading || bookedServicesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold">
            {serviceLoading
              ? "Loading service details..."
              : appointmentsLoading
              ? "Loading appointments..."
              : "Loading available time slots..."}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (serviceError || appointmentsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600">
            {serviceError
              ? `Error loading service: ${serviceError as unknown as string}`
              : `Error loading appointments: ${
                  appointmentsError as unknown as unknown as string
                }`}
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-[#A0522D] text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No service found
  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold">Service not found</div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-[#A0522D] text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Book Your Appointment
        </h1>

        {/* Step Tracker */}
        <div className="flex items-center justify-center mb-12 relative">
          {["Services", "Date and Time", "Your Details"].map((step, index) => {
            const isActive = index < 2;
            const showLine = index < 1;

            return (
              <div key={step} className="flex items-center">
                {showLine && (
                  <div
                    className={`w-16 lg:w-32 h-1 ${
                      isActive ? "bg-[#A0522D]" : "bg-gray-300"
                    }`}
                  />
                )}
                <div className="flex flex-col items-center mx-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-[#A0522D] text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      isActive ? "text-[#A0522D]" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar and Time Slot Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Select Date and Time
            </h2>

            {/* Month Header */}
            <div className="flex justify-center items-center mb-4">
              <h3 className="text-lg font-semibold">
                {viewDate.format("MMMM YYYY")}
              </h3>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              <div className="text-center text-sm font-medium text-gray-600">
                mon
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                tue
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                wed
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                thu
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                fri
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                sat
              </div>
              <div className="text-center text-sm font-medium text-gray-600">
                sun
              </div>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {calendarDays.map((day, index) =>
                day ? (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`text-black w-8 h-8 flex items-center justify-center rounded-none font-normal border-0 bg-transparent ${
                      selectedDate ===
                      viewDate.date(day).format("YYYY-MM-DD")
                        ? "text-black bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div key={index} className="w-8 h-8" />
                )
              )}
            </div>

            {/* Nav Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setViewDate(viewDate.subtract(1, "month"))}
                className="bg-[#A0522D] text-white px-3 lg:px-4 py-1 rounded text-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setViewDate(viewDate.add(1, "month"))}
                className="bg-[#A0522D] text-white px-4 lg:px-8 py-1 rounded text-sm"
              >
                Next
              </button>
            </div>

            {/* Time Slots */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2">
                Available Time Slots - {dayjs(selectedDate).format("MMMM D")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Service duration: {service.duration_minutes} minutes
              </p>

              {availableTimeSlots.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 font-medium">
                    No available time slots for this date
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please select a different date
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-4 rounded text-sm transition-colors ${
                        selectedTime === slot
                          ? "bg-[#A0522D] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              {Array.isArray(appointments) &&
                TIME_SLOTS.length - availableTimeSlots.length > 0 && (
                  <p className="text-sm text-gray-500 mt-4">
                    {TIME_SLOTS.length - availableTimeSlots.length} time slot(s)
                    unavailable due to existing bookings
                  </p>
                )}
            </div>

            {/* Next Button */}
            <div className="mt-8">
              <button
                onClick={handleNextClick}
                disabled={availableTimeSlots.length === 0}
                className={`w-full py-3 rounded text-white font-semibold transition-colors ${
                  availableTimeSlots.length > 0
                    ? "bg-[#A0522D] hover:bg-[#8B4513] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed for confirmation
              </button>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Your Booking</h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  SELECTED SERVICES
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{service.name}</span>
                  <span className="text-sm font-semibold">
                    ${parseFloat(service.price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  APPOINTMENT DETAILS
                </h3>
                <div className="text-sm space-y-2">
                  <div>{dayjs(selectedDate).format("dddd, MMMM D, YYYY")}</div>
                  <div>{selectedTime}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  PRICE SUMMARY
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking Deposit</span>
                    <span>${bookingDeposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {service.requires_deposit && bookingDeposit > 0 ? (
                <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  *${bookingDeposit.toFixed(2)} deposit required now, remaining
                  balance due at appointment
                </div>
              ) : (
                <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  *Full payment due at appointment
                </div>
              )}

              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">
                  Cancellation Policy
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>
                    * Free cancellation or rescheduling up to 24 hours before
                    appointment
                  </li>
                  <li>
                    * Late cancellations or no-shows incur a 10% service fee
                  </li>
                  <li>
                    * Booking deposit is non-refundable but will be applied to
                    your final bill
                  </li>
                </ul>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold mb-2">Need Help?</h3>
                <p className="text-xs text-gray-600">📞 (410) 555-1234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;