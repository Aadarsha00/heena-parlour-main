import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import HeenaServices from "../components/services/Henna-Services";
import Hero from "../components/services/Hero";
import LashServices from "../components/services/Lash";
import PriceList from "../components/services/Price-List";
import ThreadingServices from "../components/services/Threading";

export const Service: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <ThreadingServices />
      <LashServices />
      <HeenaServices />
      <PriceList />

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
