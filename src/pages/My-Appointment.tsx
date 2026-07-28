import Footer from "../components/Home/footer-home";
import Navbar from "../components/Home/Navbar";
import AppointmentDashboard from "../components/My-Appointments/Appointment-Dashboard";

export const MyAppointment: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#faf9f6]">
      <Navbar />
      <div className="flex-1">
        <AppointmentDashboard />
      </div>
      <Footer />
    </div>
  );
};
