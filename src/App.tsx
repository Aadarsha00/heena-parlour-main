import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import RouteSEO from "./components/SEO/Route-SEO";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/Protected-Route";
import ScrollToTop from "./ui/Scroll-Top";

const Home = lazy(() => import("./pages/Home").then((module) => ({ default: module.Home })));
const AboutUs = lazy(() =>
  import("./pages/About-Us").then((module) => ({ default: module.AboutUs }))
);
const Service = lazy(() =>
  import("./pages/Services").then((module) => ({ default: module.Service }))
);
const Contact = lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact }))
);
const Booking = lazy(() =>
  import("./pages/Booking").then((module) => ({ default: module.Booking }))
);
const Gallery = lazy(() =>
  import("./pages/Gallery").then((module) => ({ default: module.Gallery }))
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login }))
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register }))
);
const ActivationSent = lazy(() => import("./pages/Activation-Sent"));
const ActivateAccount = lazy(() => import("./pages/Activate-Account"));
const ForgotPassword = lazy(() => import("./pages/Forgot-Password"));
const ResetPassword = lazy(() => import("./pages/Reset-Password"));
const BookingDetail = lazy(
  () =>
    import("./pages/Booking-Detail").then((module) => ({
      default: module.BookingDetail,
    }))
);
const MyAppointment = lazy(() =>
  import("./pages/My-Appointment").then((module) => ({
    default: module.MyAppointment,
  }))
);
const Blog = lazy(() =>
  import("./pages/Blog").then((module) => ({ default: module.Blog }))
);
const BlogDetailPage = lazy(() => import("./components/Blogs/Blog-Deatil"));
const Testimonial = lazy(() =>
  import("./pages/Testimonial").then((module) => ({
    default: module.Testimonial,
  }))
);
const Sitemap = lazy(() =>
  import("./pages/Sitemap").then((module) => ({ default: module.Sitemap }))
);
const Legal = lazy(() => import("./pages/Legal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen grid place-items-center" role="status">
    Loading…
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <RouteSEO />
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
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
              element={
                <ProtectedRoute>
                  <BookingDetail />
                </ProtectedRoute>
              }
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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/activation-sent" element={<ActivationSent />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/activate/:uid/:token"
              element={<ActivateAccount />}
            />
            <Route
              path="/password/reset/confirm/:uid/:token"
              element={<ResetPassword />}
            />
            <Route
              path="/reset-password/:uid/:token"
              element={<ResetPassword />}
            />
            <Route path="/testimonials" element={<Testimonial />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </>
  );
}

export default App;
