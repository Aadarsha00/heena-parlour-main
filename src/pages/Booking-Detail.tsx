import AppointmentDetailsForm from "../components/booking/Appoinntment-Detail";
import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";

export const BookingDetail: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AppointmentDetailsForm />
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
