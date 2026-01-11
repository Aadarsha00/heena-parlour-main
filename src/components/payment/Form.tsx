import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { confirmPayment } from "../../api/payment.api";

interface PaymentFormProps {
  clientSecret: string;
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
  paymentType: "deposit" | "full";
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  appointmentData,
  paymentType,
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string>("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Clear error when client secret changes
  useEffect(() => {
    setPaymentError("");
  }, [clientSecret]);

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: confirmPayment,
    onSuccess: (data) => {
      console.log("Payment confirmed:", data);
      onSuccess();
    },
    onError: (error) => {
      console.error("Payment confirmation failed:", error);
      onError(
        typeof error === "string" ? error : "Payment confirmation failed"
      );
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setPaymentError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsLoading(true);
    setPaymentError("");
    setPaymentProcessing(true);

    try {
      // Confirm the payment with Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
          payment_method_data: {
            billing_details: {
              name: appointmentData.client_name,
              email: appointmentData.client_email,
              phone: appointmentData.client_phone,
            },
          },
        },
        redirect: "if_required",
      });

      if (result.error) {
        // Payment failed
        console.error("Payment failed:", result.error);
        setPaymentError(
          result.error.message ||
            "An error occurred while processing your payment."
        );
        setPaymentProcessing(false);
      } else if (result.paymentIntent) {
        // Payment succeeded
        console.log("Payment succeeded:", result.paymentIntent);

        // Confirm payment in our backend
        await confirmPaymentMutation.mutateAsync(result.paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentError("An unexpected error occurred. Please try again.");
      setPaymentProcessing(false);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: "tabs" as const,
    defaultValues: {
      billingDetails: {
        name: appointmentData.client_name,
        email: appointmentData.client_email,
        phone: appointmentData.client_phone,
      },
    },
  };

  const addressElementOptions = {
    mode: "billing" as const,
    defaultValues: {
      name: appointmentData.client_name,
    },
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <PaymentElement
              id="payment-element"
              options={paymentElementOptions}
            />
          </div>
        </div>

        {/* Address Element */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-[#A0522D]">
            Billing Address
          </h4>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <AddressElement options={addressElementOptions} />
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[#A0522D] mb-3">Payment Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Service:</span>
              <span>{appointmentData.service.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Type:</span>
              <span className="capitalize">
                {paymentType === "deposit" ? "Deposit Payment" : "Full Payment"}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-[#A0522D] border-t pt-2">
              <span>Amount to Pay:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Payment Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{paymentError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Message */}
        {paymentProcessing && !paymentError && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <div className="text-sm text-blue-700">
                <p>Processing your payment securely...</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || !elements || isLoading || paymentProcessing}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
            !stripe || !elements || isLoading || paymentProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#A0522D] hover:bg-[#8B4513] cursor-pointer"
          }`}
        >
          {isLoading || paymentProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : (
            `Pay $${amount.toFixed(2)} Now`
          )}
        </button>

        {/* Security Info */}
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>🔒 Your payment information is secure and encrypted</p>
          <p>Powered by Stripe | PCI DSS Compliant</p>
        </div>
      </form>

      {/* Test Mode Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Test Mode Active
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>This is a test payment. Use test card numbers:</p>
              <ul className="list-disc list-inside mt-1 font-mono text-xs">
                <li>4242 4242 4242 4242 (Visa)</li>
                <li>5555 5555 5555 4444 (Mastercard)</li>
                <li>Any future expiry date and CVC</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
