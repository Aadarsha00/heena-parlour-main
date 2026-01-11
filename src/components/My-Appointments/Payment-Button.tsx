import React from "react";
import { CreditCard } from "lucide-react";

interface PaymentButtonProps {
  appointmentId: number;
  onPaymentSuccess: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ appointmentId }) => {
  const handlePayment = () => {
    // TODO: Integrate with Stripe
    // For now, we'll just simulate navigation to payment page
    console.log(`Redirecting to payment for appointment ${appointmentId}`);

    // Example implementation:
    // window.location.href = `/payment/stripe/${appointmentId}`;

    // Or if you want to handle it programmatically:
    // initiateStripePayment(appointmentId).then(() => {
    //   onPaymentSuccess();
    // });

    alert(
      "Payment integration coming soon! This will redirect to Stripe checkout."
    );
  };

  return (
    <button
      onClick={handlePayment}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <CreditCard className="h-4 w-4 mr-2" />
      Pay Now
    </button>
  );
};

export default PaymentButton;
