/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import api from "../axios/api.axios";
import toast from "react-hot-toast";

// Interfaces
interface CreateAppointmentData {
  client_name: string;
  client_email: string;
  client_phone: string;
  service: number;
  stylist?: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

interface AppointmentFormProps {
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  selectedTimeDisplay: string;
  service: any;
}

// API functions
const createAppointment = async (data: CreateAppointmentData): Promise<any> => {
  try {
    const response = await api.post("/appointments/", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw error?.response?.data?.message || "Failed to create appointment";
  }
};

const AppointmentDetailsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get appointment data from navigation state
  const appointmentData = location.state as AppointmentFormProps;

  // Redirect if no appointment data
  useEffect(() => {
    if (!appointmentData) {
      navigate(-1); // Go back to previous page
    }
  }, [appointmentData, navigate]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateAppointmentData>({
    defaultValues: {
      service: appointmentData?.serviceId || 0,
      appointment_date: appointmentData?.appointmentDate || "",
      appointment_time: appointmentData?.appointmentTime || "",
      client_name: "",
      client_email: "",
      client_phone: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Appointment confirmed successfully! Payment is pending.");
      navigate("/my-appointment");
    },
    onError: (error) => {
      console.error("Failed to create appointment:", error);
      toast.error("Failed to create appointment! Please try again later");
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (data: CreateAppointmentData) => {
    setIsSubmitting(true);

    try {
      await createAppointmentMutation.mutateAsync(data);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!appointmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffefc]">
        <div className="text-center">
          <p className="text-[#222] font-serif">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subTotal = appointmentData.service
    ? parseFloat(appointmentData.service.price)
    : 0;
  const bookingDeposit =
    appointmentData.service && appointmentData.service.requires_deposit
      ? parseFloat(appointmentData.service.deposit_amount)
      : 0;
  const total = subTotal + bookingDeposit;

  return (
    <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-6 pt-12 pb-6 gap-6 lg:gap-12 font-serif text-[#222] bg-[#fffefc] min-h-screen">
      <div className="w-full lg:w-2/3 space-y-6 mt-4 lg:mt-10 ml-0 lg:ml-6">
        <h2 className="text-2xl lg:text-3xl font-medium ml-7 lg:ml-16">
          Your Details
        </h2>

        {/* Step Tracker */}
        <div className="relative flex justify-between items-start max-w-full lg:max-w-2xl mt-4 w-full px-2 lg:px-0">
          {["Services", "Date and Time", "Your Details"].map((step, index) => {
            const isActive = index < 3;
            const isCurrent = index === 2;
            const showLine = index < 2;

            return (
              <div
                className="flex flex-col items-center flex-1 relative"
                key={step}
              >
                {showLine && (
                  <div className="absolute top-4 left-1/2 w-full h-0.5 bg-[#A0522D] z-0" />
                )}
                <div
                  className={`z-10 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-semibold ${
                    isActive
                      ? "bg-[#A0522D] text-white"
                      : "bg-gray-300 text-gray-600"
                  } ${isCurrent ? "ring-2 ring-[#A0522D] ring-offset-2" : ""}`}
                >
                  {index + 1}
                </div>
                <div
                  className={`mt-2 text-xs lg:text-sm text-center ${
                    isActive ? "text-[#A0522D]" : "text-gray-600"
                  } ${isCurrent ? "font-semibold" : ""}`}
                >
                  {step}
                </div>
              </div>
            );
          })}
        </div>

        {/* Form */}
        <div className="max-w-2xl ml-7 lg:ml-16">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#A0522D]">
                Personal Information
              </h3>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="client_name"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="client_name"
                  {...register("client_name", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {errors.client_name && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.client_name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="client_email"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="client_email"
                  {...register("client_email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-transparent"
                  placeholder="Enter your email address"
                />
                {errors.client_email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.client_email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="client_phone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="client_phone"
                  {...register("client_phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[+]?[1-9][\d]{0,15}$/,
                      message: "Invalid phone number",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-transparent"
                  placeholder="Enter your phone number"
                />
                {errors.client_phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.client_phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Appointment Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#A0522D]">
                Appointment Preferences
              </h3>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium mb-1"
                >
                  Special Requests or Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#A0522D] focus:border-transparent resize-vertical"
                  placeholder="Any special requests, allergies, or additional information..."
                />
              </div>
            </div>

            {/* Hidden fields for appointment data */}
            <input type="hidden" {...register("service")} />
            <input type="hidden" {...register("appointment_date")} />
            <input type="hidden" {...register("appointment_time")} />

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-[#A0522D] text-[#A0522D] rounded-md hover:bg-[#A0522D] hover:text-white transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={
                  !isValid ||
                  isSubmitting ||
                  createAppointmentMutation.isPending
                }
                className={`px-8 py-2 rounded-md text-white font-medium transition-colors ${
                  isValid &&
                  !isSubmitting &&
                  !createAppointmentMutation.isPending
                    ? "bg-[#A0522D] hover:bg-[#8B4513] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting || createAppointmentMutation.isPending
                  ? "Confirming..."
                  : "Confirm Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="w-full lg:w-1/3 bg-yellow-50 p-4 rounded space-y-4">
        <h3 className="text-xl font-medium">Booking Summary</h3>

        <div>
          <p className="font-semibold text-sm mb-2">SELECTED SERVICE</p>
          <div className="flex justify-between text-sm">
            <span>{appointmentData.service?.name}</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Duration: {appointmentData.service?.duration_minutes} minutes
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mt-4 mb-1">APPOINTMENT DETAILS</p>
          <p className="italic text-sm">
            {dayjs(appointmentData.appointmentDate).format(
              "dddd, MMMM D, YYYY"
            )}
          </p>
          <p className="italic text-sm">
            {appointmentData.selectedTimeDisplay}
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mt-4 mb-1">PRICE SUMMARY</p>
          <div className="flex justify-between text-sm">
            <span>Service Price</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {bookingDeposit > 0 && (
            <div className="flex justify-between text-sm">
              <span>Booking Deposit</span>
              <span>${bookingDeposit.toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="text-xs italic mt-1 text-green-700">
            *Full Payment due at appointment.
          </p>
        </div>

        <div className="bg-white p-3 rounded text-sm">
          <p className="font-semibold mb-1">What happens next?</p>
          <ul className="space-y-1 text-xs">
            <li>• You'll receive a confirmation email</li>
            <li>• Payment status will be set to pending</li>
            <li>• We'll contact you to arrange payment</li>
            <li>• You can cancel/reschedule up to 24 hours before</li>
          </ul>
        </div>

        <div className="bg-white p-3 rounded text-sm">
          <p className="font-semibold mb-1">Cancellation Policy</p>
          <ul className="list-disc ml-4 space-y-1 text-xs">
            <li>Free cancellation up to 24 hours before</li>
            <li>Late cancellations incur a 10% service fee</li>
            <li>No-shows will be charged the full deposit amount</li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-semibold mb-1">Need Help?</p>
          <p className="text-orange-700">📞 (410) 555-1234</p>
          <p className="text-gray-600 text-xs">Available Mon-Fri 9AM-6PM</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsForm;
