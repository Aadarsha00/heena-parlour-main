import React from "react";

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
