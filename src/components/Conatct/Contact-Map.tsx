import React from "react";
import { MapPin, Navigation } from "lucide-react";

interface ContactMapProps {
  title?: string;
  address?: string;
  mapSrc?: string;
  className?: string;
}

const ContactMap: React.FC<ContactMapProps> = ({
  title = "Find Us",
  address = "2931 O'Donnell St, Baltimore, MD 21224, USA",
  mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3103.139146082685!2d-76.57459668464833!3d39.28034347951274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c8049bb3e6c55f%3A0xdeaee2e5a2575ad6!2s2931%20O'Donnell%20St%2C%20Baltimore%2C%20MD%2021224%2C%20USA!5e0!3m2!1sen!2snp!4v1720959059619!5m2!1sen!2snp",
  className = "",
}) => {
  const handleGetDirections = (): void => {
    const encodedAddress = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };

  return (
    <div
      className={`
      relative bg-white rounded-2xl overflow-hidden
      shadow-[0_8px_40px_rgba(0,0,0,0.12)]
      border border-gray-100
      w-full max-w-md mx-auto
      transition-all duration-300 hover:shadow-[0_12px_60px_rgba(0,0,0,0.15)]
      group
      ${className}
    `}
    >
      {/* Header Section */}
      <div className="relative px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-gray-900 mb-1 tracking-wide">
              {title}
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-400"></div>
          </div>
          <div className="p-2 rounded-full bg-gray-50 group-hover:bg-yellow-50 transition-colors duration-200">
            <MapPin className="w-5 h-5 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="px-8 pb-6">
        <div
          className="
          relative w-full h-56 rounded-xl overflow-hidden
          ring-1 ring-gray-200/50
          shadow-inner
          group-hover:ring-yellow-200/60 transition-all duration-300
        "
        >
          <iframe
            title="Location Map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="
              grayscale-[20%] contrast-105 brightness-105
              group-hover:grayscale-0 transition-all duration-500
            "
          />

          {/* Subtle overlay gradient */}
          <div
            className="
            absolute inset-0 
            bg-gradient-to-t from-black/5 via-transparent to-transparent
            pointer-events-none
          "
          ></div>
        </div>
      </div>

      {/* Action Section */}
      <div className="px-8 pb-8">
        <button
          onClick={handleGetDirections}
          className="
            w-full flex items-center justify-center gap-2
            py-3 px-4 rounded-xl
            bg-gradient-to-r from-gray-900 to-black
            text-white font-medium text-sm
            hover:from-yellow-600 hover:to-yellow-500
            transform hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-200
            shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-yellow-500/20
          "
          type="button"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
          {address}
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-gray-900/5 to-transparent rounded-tr-full"></div>
    </div>
  );
};

export default ContactMap;
