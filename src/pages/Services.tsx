import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import SEO from "../components/SEO/SEO";
import Breadcrumbs from "../components/SEO/Breadcrumbs";
import HeenaServices from "../components/services/Henna-Services";
import Hero from "../components/services/Hero";
import LashServices from "../components/services/Lash";
import PriceList from "../components/services/Price-List";
import ThreadingServices from "../components/services/Threading";

export const Service: React.FC = () => {
  return (
    <div>
      <SEO
        title="Professional Beauty Services in Baltimore, Maryland | Henna, Threading, Lash"
        description="Professional henna services, eyebrow threading, and lash extensions in Baltimore, Maryland. Expert beauticians for all your beauty needs."
        keywords="professional henna Baltimore, threading salon, lash extensions Baltimore, beauty services Maryland, eyebrow threading, bridal henna"
        ogTitle="Our Beauty Services - Beautiful Brows & Henna Baltimore"
        ogDescription="Discover our henna, threading, and lash extension services with expert beauticians in Baltimore."
        canonical="https://beautifulbrowsandhenna.com/services"
      />
      <Navbar />
      <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
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
