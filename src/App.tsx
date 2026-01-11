import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { AboutUs } from "./pages/About-Us";
import { Service } from "./pages/Services";
import { Contact } from "./pages/Contact";
import { Booking } from "./pages/Booking";
import { Payment } from "./pages/Payment";
import ScrollToTop from "./ui/Scroll-Top";
import { Gallery } from "./pages/Gallery";
import { AuthProvider } from "./context/AuthContext";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Toaster } from "react-hot-toast";
import AppointmentDetailsForm from "./components/booking/Appoinntment-Detail";
import { MyAppointment } from "./pages/My-Appointment";
import { Blog } from "./pages/Blog";
import BlogDetailPage from "./components/Blogs/Blog-Deatil";
import ProtectedRoute from "./context/Protected-Route";
import { Testimonial } from "./pages/Testimonial";

function App() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Service />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/booking/:serviceId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:serviceId/detail"
            element={<AppointmentDetailsForm />}
          />
          <Route
            path="/my-appointment"
            element={
              <ProtectedRoute>
                <MyAppointment />
              </ProtectedRoute>
            }
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/testimonials" element={<Testimonial />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
