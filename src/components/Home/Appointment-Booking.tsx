import { Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppointmentPage = () => {
  const navigate = useNavigate();
  const handleBookingRedirect = () => {
    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-amber-50/20 to-stone-50/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-display font-light tracking-wide text-stone-900 mb-4">
            Book Your
            <span className="block text-6xl font-thin bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent mt-2">
              Experience
            </span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Info Section */}
          <div className="space-y-12">
            <div className="space-y-6">
              <p className="text-lg text-stone-600 leading-relaxed font-light">
                Reserve your moment of luxury. A refined experience awaits,
                secured with a modest deposit to ensure your exclusive
                appointment.
              </p>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-200/30 rounded-3xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-stone-900 mb-3">
                    Cancellation Policy
                  </h2>
                  <p className="text-stone-600 leading-relaxed">
                    Reschedule or cancel up to 24 hours prior. Late changes
                    incur a 10% service adjustment to maintain our premium
                    standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  icon: CheckCircle,
                  title: "Effortless Booking",
                  description: "Curated services, seamless scheduling",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-stone-800 to-stone-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-stone-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right CTA Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-stone-200/20 p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-display font-light text-stone-900 mb-4">
                Ready to Begin?
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-6"></div>
              <p className="text-stone-600 leading-relaxed text-lg">
                Experience our curated selection of premium services with expert
                stylists dedicated to your transformation.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleBookingRedirect}
                className="w-full bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white py-6 px-8 rounded-2xl font-medium tracking-wide transition-all duration-300 hover:shadow-2xl hover:shadow-stone-900/25 transform hover:-translate-y-1 group"
              >
                <span className="flex items-center justify-center gap-4">
                  <span className="text-lg">Book Your Experience</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                  </div>
                </span>
              </button>

              <p className="text-sm text-stone-500 mt-4">
                Instant confirmation • Premium experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
