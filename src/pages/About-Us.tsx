import Hero from "../components/about-us/Hero";
import PhilosophySection from "../components/about-us/Philosophy";
import WhatSetsUsApart from "../components/about-us/SetUs";
import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import VisitParlor from "../components/Home/Visit-parlour";

export const AboutUs: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <PhilosophySection />
      <WhatSetsUsApart />
      <VisitParlor />
      <Footer
        heading="Ready To Book Your Service?"
        subheading="Experience the exceptional quality and care that Beautiful Eyebrow Threading & Henna is known for. Book your appointment today."
        primaryButtonText="Book an Appointment"
        primaryButtonLink="/services"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/contact"
      />
    </div>
  );
};
