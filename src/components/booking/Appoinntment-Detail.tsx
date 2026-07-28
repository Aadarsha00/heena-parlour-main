import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import toast from "react-hot-toast";

import {
  createAppointment,
  getApiErrorMessage,
  getAvailability,
} from "../../api/appointment.api";
import { getCurrentUser } from "../../api/auth.api";
import { getServiceById } from "../../api/services.api";
import type { CreateAppointmentData } from "../../interface/appointment.interface";
import { formatUsdPrice } from "../../lib/format-price";

const AppointmentDetailsForm = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const numericServiceId = Number(serviceId);
  const appointmentDate = searchParams.get("date") ?? "";
  const appointmentTime = searchParams.get("time") ?? "";

  const serviceQuery = useQuery({
    queryKey: ["service", numericServiceId],
    queryFn: () => getServiceById(numericServiceId),
    enabled: numericServiceId > 0,
  });
  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
  });
  const availabilityQuery = useQuery({
    queryKey: ["availability", numericServiceId, appointmentDate],
    queryFn: () => getAvailability(numericServiceId, appointmentDate),
    enabled: numericServiceId > 0 && Boolean(appointmentDate),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAppointmentData>({
    mode: "onChange",
    defaultValues: {
      service: numericServiceId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      client_name: "",
      client_email: "",
      client_phone: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (!userQuery.data) return;
    reset({
      service: numericServiceId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      client_name: `${userQuery.data.first_name} ${userQuery.data.last_name}`.trim(),
      client_email: userQuery.data.email,
      client_phone: userQuery.data.phone_number,
      notes: "",
    });
  }, [
    appointmentDate,
    appointmentTime,
    numericServiceId,
    reset,
    userQuery.data,
  ]);

  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Your appointment request has been booked.");
      navigate("/my-appointment", { replace: true });
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(
          error,
          "This time may no longer be available. Please choose another slot."
        )
      );
      availabilityQuery.refetch();
    },
  });

  const service = serviceQuery.data;
  const selectedSlot = availabilityQuery.data?.slots.find(
    (slot) => slot.value === appointmentTime
  );
  const bookingDetailsValid =
    Boolean(appointmentDate && appointmentTime && service) &&
    (availabilityQuery.isLoading || Boolean(selectedSlot));

  if (!appointmentDate || !appointmentTime || !numericServiceId) {
    return (
      <main className="min-h-screen grid place-items-center text-center">
        <div>
          <p className="text-xl font-semibold">Choose a date and time first.</p>
          <button
            type="button"
            className="mt-4 underline"
            onClick={() => navigate(`/booking/${numericServiceId || ""}`)}
          >
            Return to booking
          </button>
        </div>
      </main>
    );
  }

  if (serviceQuery.isLoading || userQuery.isLoading || availabilityQuery.isLoading) {
    return <p className="min-h-screen grid place-items-center">Loading details…</p>;
  }

  if (!service || serviceQuery.isError || userQuery.isError) {
    return (
      <main className="min-h-screen grid place-items-center text-center">
        <div>
          <p className="text-xl font-semibold text-red-700">
            Booking details could not be loaded.
          </p>
          <button className="mt-4 underline" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </main>
    );
  }

  if (!bookingDetailsValid || availabilityQuery.isError) {
    return (
      <main className="min-h-screen grid place-items-center text-center">
        <div>
          <p className="text-xl font-semibold">
            That time is no longer available.
          </p>
          <button
            className="mt-4 rounded bg-[#A0522D] px-5 py-2 text-white"
            onClick={() => navigate(`/booking/${numericServiceId}`)}
          >
            Choose another time
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffefc] px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
          <h1 className="text-3xl font-semibold">Your details</h1>
          <p className="mt-2 text-sm text-gray-600">
            Confirm how the parlour should contact you about this appointment.
          </p>

          <form
            className="mt-8 space-y-5"
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
          >
            <div>
              <label htmlFor="client_name" className="mb-1 block text-sm font-medium">
                Full name
              </label>
              <input
                id="client_name"
                autoComplete="name"
                className="w-full rounded-lg border border-stone-300 px-3 py-2"
                {...register("client_name", {
                  required: "Your name is required.",
                  minLength: { value: 2, message: "Enter at least 2 characters." },
                })}
              />
              {errors.client_name && (
                <p className="mt-1 text-sm text-red-700">{errors.client_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="client_email" className="mb-1 block text-sm font-medium">
                Email
              </label>
              <input
                id="client_email"
                type="email"
                autoComplete="email"
                className="w-full rounded-lg border border-stone-300 px-3 py-2"
                {...register("client_email", {
                  required: "Your email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
              {errors.client_email && (
                <p className="mt-1 text-sm text-red-700">{errors.client_email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="client_phone" className="mb-1 block text-sm font-medium">
                Phone number
              </label>
              <input
                id="client_phone"
                type="tel"
                autoComplete="tel"
                placeholder="+14105551234"
                className="w-full rounded-lg border border-stone-300 px-3 py-2"
                {...register("client_phone", {
                  required: "Your phone number is required.",
                  pattern: {
                    value: /^\+?\d{9,15}$/,
                    message: "Use 9–15 digits, optionally beginning with +.",
                  },
                })}
              />
              {errors.client_phone && (
                <p className="mt-1 text-sm text-red-700">{errors.client_phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={1000}
                className="w-full rounded-lg border border-stone-300 px-3 py-2"
                {...register("notes")}
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || mutation.isPending}
              className="w-full rounded-lg bg-[#A0522D] py-3 font-semibold text-white hover:bg-[#8B4513] disabled:bg-gray-400"
            >
              {mutation.isPending ? "Booking…" : "Confirm appointment"}
            </button>
          </form>
        </section>

        <aside className="h-fit rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Booking summary</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-gray-500">Service</dt>
              <dd className="font-medium">{service.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">When</dt>
              <dd>{dayjs(appointmentDate).format("dddd, MMMM D, YYYY")}</dd>
              <dd>{selectedSlot?.label}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Duration</dt>
              <dd>{service.duration_minutes} minutes</dd>
            </div>
            <div className="flex justify-between border-t pt-4 text-base">
              <dt>Service price</dt>
              <dd className="font-semibold">
                {formatUsdPrice(service.price)}
              </dd>
            </div>
          </dl>
          <p className="mt-4 rounded bg-stone-50 p-3 text-xs text-gray-600">
            Pay at the parlour after your service. We do not take payment online.
          </p>
          <p className="mt-4 text-xs text-gray-600">
            You may cancel before the appointment. Cancellations made within 24
            hours are recorded as late cancellations.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default AppointmentDetailsForm;
