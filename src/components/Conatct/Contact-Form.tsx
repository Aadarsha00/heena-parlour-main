import React, { useState } from "react";

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

const ContactForm: React.FC<ContactFormProps> = ({
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
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
    email: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
        formData.phoneNumber
      )
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.service.trim()) {
      newErrors.service = "Please select a service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSubmit) {
        onSubmit(formData);
      } else {
        console.log("Form submitted:", formData);
      }

      // Reset form on success
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        service: "",
        message: "",
      });

      // Show success message (you could add a toast notification here)
      alert("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (fieldName: keyof FormData) =>
    `
    w-full px-4 py-3 border rounded-xl transition-all duration-300 outline-none font-light
    ${
      errors[fieldName]
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
    }
    hover:border-gray-300 placeholder-gray-400
  `.trim();

  return (
    <div
      className={`group relative bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden max-w-lg mx-auto ${className}`}
    >
      {/* Golden Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-500" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl flex-shrink-0">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-lg text-gray-900">
            Send Us a Message
          </h3>
          <p className="text-sm text-gray-500 font-light">
            We'll respond within 24 hours
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name and Phone Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className={inputClasses("fullName")}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className={inputClasses("phoneNumber")}
              disabled={isSubmitting}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.phoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className={inputClasses("email")}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.email}
            </p>
          )}
        </div>

        {/* Service Selection */}
        <div>
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className={`${inputClasses("service")} ${
              !formData.service ? "text-gray-400" : "text-gray-900"
            }`}
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Select a Service
            </option>
            {services.map((service, index) => (
              <option key={index} value={service} className="text-gray-900">
                {service}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.service}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us about your beauty goals and any specific requirements..."
            rows={4}
            className={`${inputClasses("message")} resize-none`}
            disabled={isSubmitting}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="group/button w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-4 rounded-full font-medium tracking-wide transition-all duration-300 hover:shadow-xl hover:shadow-yellow-400/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Message
                <svg
                  className="w-4 h-4 transition-transform group-hover/button:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ContactForm;
