import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import AppointmentDashboard from "../components/My-Appointments/Appointment-Dashboard";

export const MyAppointment: React.FC = () => {
  return (
    <div>
      <Navbar />
      <AppointmentDashboard />
      <Footer />
    </div>
  );
};
