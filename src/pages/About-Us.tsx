import Hero from "../components/about-us/Hero";
import PhilosophySection from "../components/about-us/Philosophy";
import WhatSetsUsApart from "../components/about-us/SetUs";
import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import SEO from "../components/SEO/SEO";
import Breadcrumbs from "../components/SEO/Breadcrumbs";
import VisitParlor from "../components/Home/Visit-parlour";

export const AboutUs: React.FC = () => {
  return (
    <div>
      <SEO
        title="About Beautiful Brows & Henna Baltimore - Expert Beauty Services & Salon"
        description="Learn about Beautiful Brows & Henna Baltimore - our expert beauticians, beauty philosophy, and commitment to quality services in Baltimore, Maryland."
        keywords="about Beautiful Brows & Henna, expert beauticians Baltimore, beauty salon philosophy, professional beauty services"
        ogTitle="About Beautiful Brows & Henna Baltimore"
        ogDescription="Discover our story and meet the expert beauticians behind Beautiful Brows & Henna Baltimore."
        canonical="https://beautifulbrowsandhenna.com/about"
      />
      <Navbar />
      <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} />
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
