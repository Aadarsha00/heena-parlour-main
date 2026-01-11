/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../components/axios/api.axios";

//create
export const createPaymentIntent = async (paymentData: {
  appointment_id: number;
  payment_type: "deposit" | "full";
  amount: string;
}) => {
  try {
    const response = await api.post(
      "/payments/create_payment_intent/",
      paymentData
    );
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to create payment intent";
  }
};

export const confirmPayment = async (stripePaymentIntentId: string) => {
  try {
    const response = await api.post("/payments/confirm_payment/", {
      stripe_payment_intent_id: stripePaymentIntentId,
    });
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to confirm payment";
  }
};

export const getAllPayments = async (filters?: {
  status?: string;
  payment_type?: string;
  appointment?: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.payment_type)
      params.append("payment_type", filters.payment_type);
    if (filters?.appointment)
      params.append("appointment", filters.appointment.toString());

    const response = await api.get(`/payments/?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get payments";
  }
};

export const getPaymentDetails = async (paymentId: number) => {
  try {
    const response = await api.get(`/payments/${paymentId}/`);
    return response.data;
  } catch (error: any) {
    throw error?.response?.data?.message || "Failed to get payment details";
  }
};
