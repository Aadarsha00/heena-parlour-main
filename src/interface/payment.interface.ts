// types/payment.types.ts

export interface PaymentIntent {
  id: number;
  appointment: number;
  stripe_payment_intent_id: string;
  amount: string;
  payment_type: "deposit" | "full payment";
  status: "pending" | "succeeded" | "failed" | "canceled";
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentIntentData {
  appointment_id: number;
  payment_type: "deposit" | "full payment";
  amount: string;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentData {
  stripe_payment_intent_id: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  payment: PaymentIntent;
  message: string;
}

export interface PaymentFilters {
  status?: string;
  payment_type?: string;
  appointment?: number;
}

export interface AppointmentData {
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
}

export interface PaymentPageProps {
  appointmentId: number;
  appointmentData?: AppointmentData;
}

export interface StripeElementsOptions {
  clientSecret: string;
  appearance?: {
    theme?: "stripe" | "night" | "flat";
    variables?: Record<string, string>;
  };
}

export interface PaymentFormData {
  paymentType: "deposit" | "full";
  savePaymentMethod?: boolean;
}
