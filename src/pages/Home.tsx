import React from "react";
import SEO from "../components/SEO/SEO";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Home/Navbar";
import OurWork from "../components/Home/Our-work";
import ClientTestimonials from "../components/Home/Testimonial";
import VisitParlor from "../components/Home/Visit-parlour";

import Footer from "../components/Home/footer-home";
import ServicesSection from "../components/Home/ServicesSection";
import BlogSection from "../components/Home/Blog";

import AppointmentPage from "../components/Home/Appointment-Booking";

export const Home: React.FC = () => {
  return (
    <div>
      <SEO
        title="Henna Services & Threading Salon in Baltimore, Maryland | Book Online"
        description="Best henna parlour in Baltimore, Maryland | Professional threading, lash extensions & bridal henna services near you. Book appointments online today!"
        keywords="henna services Baltimore, threading salon Baltimore MD, lash extensions Baltimore, bridal henna artist Maryland, beauty parlour near me"
        ogTitle="Beautiful Brows & Henna - Professional Henna, Threading & Lash Services"
        ogDescription="Premium beauty salon in Baltimore offering professional henna, threading, and lash extensions. Book your appointment online."
        canonical="https://beautifulbrowsandhenna.com/"
      />
      <Navbar />
      <Hero />
      <ServicesSection />
      <AppointmentPage />
      <OurWork />
      <ClientTestimonials />
      <BlogSection />
      <VisitParlor />
      <Footer />
    </div>
  );
};
