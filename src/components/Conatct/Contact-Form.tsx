import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "../../api/appointment.api";
import api from "../axios/api.axios";

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  service: string;
  message: string;
}

interface ContactFormProps {
  className?: string;
  onSubmit?: (data: FormData) => void;
  services?: string[];
}

const EMPTY_FORM: FormData = {
  fullName: "",
  phoneNumber: "",
  email: "",
  service: "",
  message: "",
};

const ContactForm = ({
  className = "",
  onSubmit,
  services = [
    "Eyebrow Threading",
    "Upper Lip Threading",
    "Full Face Threading",
    "Henna Design",
    "Eyelash Extension",
    "Consultation",
  ],
}: ContactFormProps) => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as keyof FormData;
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<FormData> = {};
    if (formData.fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your full name.";
    }
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s().-]{9,20}$/.test(formData.phoneNumber)
    ) {
      nextErrors.phoneNumber = "Enter a valid phone number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formData.service) nextErrors.service = "Choose a service.";
    if (formData.message.trim().length < 10) {
      nextErrors.message = "Please enter at least 10 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await api.post(
        "/contact-messages/",
        {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phoneNumber.trim(),
          subject: `Service enquiry: ${formData.service}`,
          message: formData.message.trim(),
        },
        { skipAuthRedirect: true }
      );
      onSubmit?.(formData);
      setFormData(EMPTY_FORM);
      toast.success("Your message has been sent.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Your message could not be sent."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (field: keyof FormData) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition ${
      errors[field]
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
    }`;

  return (
    <section
      className={`relative mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg ${className}`}
    >
      <div className="absolute left-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r from-yellow-400 to-amber-500" />
      <h2 className="text-xl font-medium text-gray-900">Send us a message</h2>
      <p className="mt-1 text-sm text-gray-500">We aim to reply within 24 hours.</p>

      <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
            Full name
          </label>
          <input
            id="contact-name"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            className={inputClasses("fullName")}
            disabled={isSubmitting}
            aria-describedby={errors.fullName ? "contact-name-error" : undefined}
          />
          {errors.fullName && (
            <p id="contact-name-error" className="mt-1 text-sm text-red-700">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-700">{errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium">
              Phone (optional)
            </label>
            <input
              id="contact-phone"
              type="tel"
              name="phoneNumber"
              autoComplete="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClasses("phoneNumber")}
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-700">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="contact-service" className="mb-1 block text-sm font-medium">
            Service
          </label>
          <select
            id="contact-service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={inputClasses("service")}
            disabled={isSubmitting}
          >
            <option value="">Choose a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-700">{errors.service}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={2000}
            value={formData.message}
            onChange={handleChange}
            className={`${inputClasses("message")} resize-y`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-700">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-8 py-4 font-medium text-black hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
