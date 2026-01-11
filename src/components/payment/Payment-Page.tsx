import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import dayjs from "dayjs";
import { createPaymentIntent } from "../../api/payment.api";
import PaymentForm from "./Form";

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentPageProps {
  appointmentId: number;
  appointmentData: {
    id: number;
    client_name: string;
    client_email: string;
    client_phone: string;
    service: {
      id: number;
      name: string;
      price: string;
      duration_minutes: number;
      requires_deposit: boolean;
      deposit_amount: string;
    };
    appointment_date: string;
    appointment_time: string;
    status: string;
    notes?: string;
    created_at: string;
  };
}

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    "deposit" | "full"
  >("full");
  const [clientSecret, setClientSecret] = useState<string>("");

  // Get appointment data from navigation state
  const { appointmentId, appointmentData } = location.state as PaymentPageProps;

  // Redirect if no appointment data
  useEffect(() => {
    if (!appointmentData || !appointmentId) {
      navigate("/"); // Redirect to home if no data
    }
  }, [appointmentData, appointmentId, navigate]);

  // Calculate amounts
  const servicePrice = appointmentData?.service
    ? parseFloat(appointmentData.service.price)
    : 0;
  const depositAmount = appointmentData?.service?.requires_deposit
    ? parseFloat(appointmentData.service.deposit_amount)
    : 0;

  const fullAmount = servicePrice;
  const selectedAmount =
    selectedPaymentType === "deposit" ? depositAmount : fullAmount;

  // Create payment intent mutation
  const createPaymentIntentMutation = useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: (data) => {
      console.log("Payment intent created:", data);
      setClientSecret(data.client_secret);
    },
    onError: (error) => {
      console.error("Failed to create payment intent:", error);
      alert(`Failed to create payment intent: ${error}`);
    },
  });

  // Handle payment type change
  const handlePaymentTypeChange = (type: "deposit" | "full") => {
    setSelectedPaymentType(type);
    setClientSecret(""); // Reset client secret when payment type changes
  };

  // Initialize payment intent when component mounts or payment type changes
  useEffect(() => {
    if (appointmentId && selectedAmount > 0) {
      createPaymentIntentMutation.mutate({
        appointment_id: appointmentId,
        payment_type: selectedPaymentType,
        amount: selectedAmount.toFixed(2),
      });
    }
  }, [appointmentId, selectedPaymentType, selectedAmount]);

  // Stripe Elements options
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#A0522D",
        colorBackground: "#ffffff",
        colorText: "#222222",
        colorDanger: "#df1b41",
        fontFamily: "serif",
        spacingUnit: "2px",
        borderRadius: "6px",
      },
    },
  };

  if (!appointmentData || !appointmentId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffefc]">
        <div className="text-center">
          <p className="text-[#222] font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-6 pt-12 pb-6 gap-6 lg:gap-12 font-serif text-[#222] bg-[#fffefc] min-h-screen">
      <div className="w-full lg:w-2/3 space-y-6 mt-4 lg:mt-10 ml-0 lg:ml-6">
        <h2 className="text-2xl lg:text-3xl font-medium ml-7 lg:ml-16">
          Payment Details
        </h2>

        {/* Step Tracker */}
        <div className="relative flex justify-between items-start max-w-full lg:max-w-2xl mt-4 w-full px-2 lg:px-0">
          {["Services", "Date and Time", "Your Details", "Payment"].map(
            (step, index) => {
              const isActive = index <= 3;
              const isCurrent = index === 3;
              const showLine = index < 3;

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
                    } ${
                      isCurrent ? "ring-2 ring-[#A0522D] ring-offset-2" : ""
                    }`}
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
            }
          )}
        </div>

        {/* Payment Type Selection */}
        <div className="max-w-2xl ml-7 lg:ml-16 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#A0522D]">
              Payment Options
            </h3>

            {/* Payment Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Payment Option */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedPaymentType === "full"
                    ? "border-[#A0522D] bg-[#A0522D]/5"
                    : "border-gray-300 hover:border-[#A0522D]/50"
                }`}
                onClick={() => handlePaymentTypeChange("full")}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentType"
                      value="full"
                      checked={selectedPaymentType === "full"}
                      onChange={() => handlePaymentTypeChange("full")}
                      className="mr-3 text-[#A0522D] focus:ring-[#A0522D]"
                    />
                    <h4 className="font-semibold">Pay Full Amount</h4>
                  </div>
                  <span className="font-bold text-[#A0522D]">
                    ${fullAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Complete payment for your appointment service
                </p>
              </div>

              {/* Deposit Payment Option (if applicable) */}
              {appointmentData.service.requires_deposit &&
                depositAmount > 0 && (
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPaymentType === "deposit"
                        ? "border-[#A0522D] bg-[#A0522D]/5"
                        : "border-gray-300 hover:border-[#A0522D]/50"
                    }`}
                    onClick={() => handlePaymentTypeChange("deposit")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="paymentType"
                          value="deposit"
                          checked={selectedPaymentType === "deposit"}
                          onChange={() => handlePaymentTypeChange("deposit")}
                          className="mr-3 text-[#A0522D] focus:ring-[#A0522D]"
                        />
                        <h4 className="font-semibold">Pay Deposit Only</h4>
                      </div>
                      <span className="font-bold text-[#A0522D]">
                        ${depositAmount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      Secure your appointment with a deposit. Pay remaining $
                      {(fullAmount - depositAmount).toFixed(2)} later
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#A0522D]">
                Payment Information
              </h3>

              <Elements options={stripeOptions} stripe={stripePromise}>
                <PaymentForm
                  clientSecret={clientSecret}
                  appointmentData={appointmentData}
                  paymentType={selectedPaymentType}
                  amount={selectedAmount}
                  onSuccess={() => {
                    // Navigate to success page
                    navigate("/booking-success", {
                      state: {
                        appointmentData,
                        paymentType: selectedPaymentType,
                      },
                    });
                  }}
                  onError={(error) => {
                    console.error("Payment failed:", error);
                    alert(`Payment failed: ${error}`);
                  }}
                />
              </Elements>
            </div>
          )}

          {/* Loading State */}
          {createPaymentIntentMutation.isPending && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A0522D] mx-auto mb-2"></div>
                <p className="text-[#A0522D]">Preparing payment...</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-[#A0522D] text-[#A0522D] rounded-md hover:bg-[#A0522D] hover:text-white transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="w-full lg:w-1/3 bg-yellow-50 p-4 rounded space-y-4">
        <h3 className="text-xl font-medium">Payment Summary</h3>

        <div>
          <p className="font-semibold text-sm mb-2">SELECTED SERVICE</p>
          <div className="flex justify-between text-sm">
            <span>{appointmentData.service?.name}</span>
            <span>${servicePrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Duration: {appointmentData.service?.duration_minutes} minutes
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mt-4 mb-1">APPOINTMENT DETAILS</p>
          <p className="italic text-sm">
            {dayjs(appointmentData.appointment_date).format(
              "dddd, MMMM D, YYYY"
            )}
          </p>
          <p className="italic text-sm">{appointmentData.appointment_time}</p>
        </div>

        <div>
          <p className="font-semibold text-sm mt-4 mb-1">CLIENT INFORMATION</p>
          <p className="text-sm">{appointmentData.client_name}</p>
          <p className="text-sm text-gray-600">
            {appointmentData.client_email}
          </p>
          <p className="text-sm text-gray-600">
            {appointmentData.client_phone}
          </p>
        </div>

        <div>
          <p className="font-semibold text-sm mt-4 mb-1">PAYMENT BREAKDOWN</p>
          <div className="flex justify-between text-sm">
            <span>Service Price</span>
            <span>${servicePrice.toFixed(2)}</span>
          </div>

          {selectedPaymentType === "deposit" && (
            <>
              <div className="flex justify-between text-sm text-[#A0522D] font-semibold">
                <span>Paying Now (Deposit)</span>
                <span>${depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Remaining Balance</span>
                <span>${(servicePrice - depositAmount).toFixed(2)}</span>
              </div>
            </>
          )}

          {selectedPaymentType === "full" && (
            <div className="flex justify-between text-sm text-[#A0522D] font-semibold">
              <span>Paying Now (Full Payment)</span>
              <span>${fullAmount.toFixed(2)}</span>
            </div>
          )}

          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-[#A0522D]">
            <span>Amount to Pay</span>
            <span>${selectedAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded text-sm">
          <p className="font-semibold mb-1">Payment Information</p>
          <ul className="space-y-1 text-xs">
            <li>• Secure payment powered by Stripe</li>
            <li>• Your card information is encrypted</li>
            <li>• Confirmation email will be sent</li>
            <li>• Refunds processed within 5-7 business days</li>
          </ul>
        </div>

        <div className="bg-white p-3 rounded text-sm">
          <p className="font-semibold mb-1">Test Card Numbers</p>
          <ul className="space-y-1 text-xs font-mono">
            <li>• 4242 4242 4242 4242 (Visa)</li>
            <li>• 5555 5555 5555 4444 (Mastercard)</li>
            <li>• Use any future date for expiry</li>
            <li>• Use any 3-digit CVC</li>
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

export default PaymentPage;
