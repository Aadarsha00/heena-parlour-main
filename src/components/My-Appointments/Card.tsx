import React from "react";
import { Calendar, CreditCard, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Appointment } from "../../interface/appointment.interface";
import StatusBadge from "./Status-Badge";
import PaymentButton from "./Payment-Button";
import CancelButton from "./Cancel-Button";

// Enhanced utility function to format date and time with more details
const formatDetailedDateTime = (date: string, time: string) => {
  const dateTime = new Date(`${date}T${time}`);
  const now = new Date();

  // Calculate days difference
  const diffTime = dateTime.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = dateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Add relative time indicator
  let relativeTime = "";
  if (diffDays === 0) {
    relativeTime = "Today";
  } else if (diffDays === 1) {
    relativeTime = "Tomorrow";
  } else if (diffDays === -1) {
    relativeTime = "Yesterday";
  } else if (diffDays > 1 && diffDays <= 7) {
    relativeTime = `In ${diffDays} days`;
  } else if (diffDays < -1 && diffDays >= -7) {
    relativeTime = `${Math.abs(diffDays)} days ago`;
  }

  return {
    fullDate: formattedDate,
    time: formattedTime,
    relativeTime,
    isToday: diffDays === 0,
    isPast: diffDays < 0,
    isUpcoming: diffDays > 0 && diffDays <= 7,
  };
};

// Payment Status Badge Component
const PaymentStatusBadge: React.FC<{ paymentStatus: string }> = ({
  paymentStatus,
}) => {
  const getPaymentBadgeStyles = () => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentDisplayText = () => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "Paid";
      case "pending":
        return "Payment Pending";
      case "unpaid":
        return "Unpaid";
      case "failed":
        return "Payment Failed";
      case "refunded":
        return "Refunded";
      default:
        return paymentStatus || "Unknown";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPaymentBadgeStyles()}`}
    >
      <CreditCard className="h-3 w-3 mr-1" />
      {getPaymentDisplayText()}
    </span>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: number) => void;
  onViewDetails: (appointment: Appointment) => void;
  cancelLoading: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  cancelLoading,
}) => {
  const queryClient = useQueryClient();

  const dateTimeInfo = formatDetailedDateTime(
    appointment.appointment_date,
    appointment.appointment_time
  );

  // Payment button logic - disabled since payment is not integrated
  const showPaymentButton = false;

  const showCancelButton =
    appointment.status !== "cancelled" && appointment.status !== "completed";

  const handlePaymentSuccess = () => {
    // Invalidate and refetch appointment data
    queryClient.invalidateQueries({ queryKey: ["appointments"] });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow ${
        dateTimeInfo.isToday ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {appointment.service_details?.name ||
              `Service #${appointment.service}`}
          </h3>

          {/* Enhanced Date and Time Display */}
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-900">
              {dateTimeInfo.fullDate}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-gray-900">
                {dateTimeInfo.time}
              </p>
              {dateTimeInfo.relativeTime && (
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    dateTimeInfo.isToday
                      ? "bg-blue-100 text-blue-800"
                      : dateTimeInfo.isUpcoming
                      ? "bg-green-100 text-green-800"
                      : dateTimeInfo.isPast
                      ? "bg-gray-100 text-gray-600"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {dateTimeInfo.relativeTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end">
          <StatusBadge
            status={appointment.status}
            paymentStatus={appointment.payment_status}
          />
          <PaymentStatusBadge paymentStatus={appointment.payment_status} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          Duration:{" "}
          {appointment.service_details?.duration_minutes ||
            appointment.duration_minutes}{" "}
          minutes
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <CreditCard className="h-4 w-4 mr-2" />
          Price: $
          {appointment.service_details?.price || appointment.total_amount}
        </div>
        {appointment.stylist && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            Stylist ID: {appointment.stylist}
          </div>
        )}
        {appointment.notes && (
          <p className="text-sm text-gray-600 italic">"{appointment.notes}"</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-end items-center">
        {showPaymentButton && (
          <PaymentButton
            appointmentId={appointment.id}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        {showCancelButton && (
          <CancelButton
            appointment={appointment}
            onCancel={onCancel}
            isLoading={cancelLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
