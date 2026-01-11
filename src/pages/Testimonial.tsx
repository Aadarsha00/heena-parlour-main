import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import AllClientTestimonials from "../components/testimonial/All";

export const Testimonial: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AllClientTestimonials />
      <Footer
        heading="Ready To Book Your Service?"
        subheading="Experience the exceptional quality and care that Beautiful Eyebrow Threading & Henna is known for. Book your appointment today."
        primaryButtonText="Book an Appointment"
        primaryButtonLink="/booking"
        secondaryButtonText="Contact Us"
        secondaryButtonLink="/contact"
      />
    </div>
  );
};
