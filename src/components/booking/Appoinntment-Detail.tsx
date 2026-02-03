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

  const appointmentData = location.state as AppointmentFormProps;

  useEffect(() => {
    if (!appointmentData) {
      navigate(-1);
    }
  }, [appointmentData, navigate]);

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

  const onSubmit = async (data: CreateAppointmentData) => {
    setIsSubmitting(true);
    try {
      await createAppointmentMutation.mutateAsync(data);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // Loading / missing state
  if (!appointmentData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p className="text-gray-600 font-light text-lg">Loading appointment details…</p>
        </div>
      </div>
    );
  };

  // Totals
  const subTotal = appointmentData.service
    ? parseFloat(appointmentData.service.price)
    : 0;
  const bookingDeposit =
    appointmentData.service && appointmentData.service.requires_deposit
      ? parseFloat(appointmentData.service.deposit_amount)
      : 0;
  const total = subTotal + bookingDeposit;

  // Reusable input style
  const inputBase =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-base text-gray-800 font-medium bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200";

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-10 w-64 h-64 bg-gradient-to-br from-yellow-400/8 to-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-10 w-48 h-48 bg-gradient-to-br from-amber-400/8 to-yellow-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-10 pb-16">

          {/* ── Page Header ── */}
          <div className="text-center mb-8">
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto mb-5" />
            <h1 className="text-4xl lg:text-5xl font-display font-light text-gray-900 leading-tight">
              Your
              <span className="block bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent font-semibold">
                Details
              </span>
            </h1>
          </div>

          {/* ── Step Tracker ── */}
          <div className="flex items-center justify-center mb-10">
            {["Services", "Date & Time", "Your Details"].map((step, index) => {
              const isCompleted = index < 2;
              const isCurrent  = index === 2;

              return (
                <div key={step} className="flex items-center">
                  {index > 0 && (
                    <div className={`w-12 lg:w-24 h-0.5 ${
                      isCompleted ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gray-200"
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

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── Left: single form card ── */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />
                <div className="p-6 lg:p-8">

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

                    {/* ── Personal Information ── */}
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
                        <h2 className="text-sm font-display font-medium text-yellow-700 tracking-wide uppercase">Personal Information</h2>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label htmlFor="client_name" className="block text-sm text-gray-700 font-medium mb-1.5">
                            Full Name <span className="text-amber-500">*</span>
                          </label>
                          <input
                            type="text" id="client_name"
                            {...register("client_name", {
                              required: "Full name is required",
                              minLength: { value: 2, message: "Name must be at least 2 characters" },
                            })}
                            className={inputBase}
                            placeholder="Enter your full name"
                          />
                          {errors.client_name && <p className="text-red-500 text-sm font-medium mt-1.5">{errors.client_name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                          <label htmlFor="client_email" className="block text-sm text-gray-700 font-medium mb-1.5">
                            Email Address <span className="text-amber-500">*</span>
                          </label>
                          <input
                            type="email" id="client_email"
                            {...register("client_email", {
                              required: "Email address is required",
                              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                            })}
                            className={inputBase}
                            placeholder="Enter your email address"
                          />
                          {errors.client_email && <p className="text-red-500 text-sm font-medium mt-1.5">{errors.client_email.message}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="client_phone" className="block text-sm text-gray-700 font-medium mb-1.5">
                            Phone Number <span className="text-amber-500">*</span>
                          </label>
                          <input
                            type="tel" id="client_phone"
                            {...register("client_phone", {
                              required: "Phone number is required",
                              pattern: { value: /^[+]?[1-9][\d]{0,15}$/, message: "Invalid phone number" },
                            })}
                            className={inputBase}
                            placeholder="Enter your phone number"
                          />
                          {errors.client_phone && <p className="text-red-500 text-sm font-medium mt-1.5">{errors.client_phone.message}</p>}
                        </div>
                      </div>
                    </div>

                    {/* ── Appointment Preferences — divider, no second card ── */}
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500" />
                        <h2 className="text-sm font-display font-medium text-yellow-700 tracking-wide uppercase">Appointment Preferences</h2>
                      </div>

                      <div>
                        <label htmlFor="notes" className="block text-sm text-gray-700 font-medium mb-1.5">
                          Special Requests or Notes <span className="text-gray-500 font-medium">(Optional)</span>
                        </label>
                        <textarea
                          id="notes"
                          {...register("notes")}
                          rows={4}
                          className={`${inputBase} resize-vertical`}
                          placeholder="Any special requests, allergies, or additional information…"
                        />
                      </div>
                    </div>

                    {/* Hidden fields */}
                    <input type="hidden" {...register("service")} />
                    <input type="hidden" {...register("appointment_date")} />
                    <input type="hidden" {...register("appointment_time")} />

                    {/* ── Nav buttons ── */}
                    <div className="flex justify-between items-center pt-2">
                      {/* Back */}
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 font-medium hover:border-amber-400 hover:text-amber-700 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back
                      </button>

                      {/* Confirm */}
                      <button
                        type="submit"
                        disabled={!isValid || isSubmitting || createAppointmentMutation.isPending}
                        className={`
                          group inline-flex items-center gap-3 px-8 py-2.5 text-sm font-medium tracking-wide uppercase transition-all duration-300
                          ${isValid && !isSubmitting && !createAppointmentMutation.isPending
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:shadow-xl hover:shadow-yellow-400/25 hover:-translate-y-0.5 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        {isSubmitting || createAppointmentMutation.isPending ? "Confirming…" : "Confirm Appointment"}
                        {!(isSubmitting || createAppointmentMutation.isPending) && (
                          <svg className={`w-4 h-4 transition-transform duration-300 ${isValid ? "group-hover:translate-x-1" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </form>
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

                  {/* Service pill */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Selected Service</p>
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-800 font-semibold">{appointmentData.service?.name}</span>
                      <span className="text-base font-bold text-gray-900">${subTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-1">Duration: {appointmentData.service?.duration_minutes} min</p>
                  </div>

                  {/* Appointment details */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-display font-bold text-yellow-700 tracking-wide uppercase mb-2">Appointment Details</p>
                    <div className="space-y-1.5 text-sm text-gray-700 font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v1.5M17.25 3v1.5M3 8.25h18.75M5.25 4.5h13.5a2.25 2.25 0 012.25 2.25v13.5a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25z" />
                        </svg>
                        {dayjs(appointmentData.appointmentDate).format("dddd, MMMM D, YYYY")}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4m6 0a10 10 0 11-20 0 10 10 0 0120 0z" />
                        </svg>
                        {appointmentData.selectedTimeDisplay}
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
                        {appointmentData.service?.requires_deposit && bookingDeposit > 0
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

export default AppointmentDetailsForm;