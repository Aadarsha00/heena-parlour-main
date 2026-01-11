import GalleryItems from "../components/Gallery/Gallery-Items";
import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";

export const Gallery: React.FC = () => {
  return (
    <div>
      <Navbar />
      <GalleryItems />
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
