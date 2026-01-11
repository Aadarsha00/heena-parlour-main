import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import PaymentPage from "../components/payment/Payment-Page";

export const Payment: React.FC = () => {
  return (
    <div>
      <Navbar />
      <PaymentPage />
      <Footer />
    </div>
  );
};
