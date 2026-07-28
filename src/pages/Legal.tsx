import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/footer-home";

const Legal = ({ kind }: { kind: "privacy" | "terms" }) => {
  const privacy = kind === "privacy";
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-semibold">
          {privacy ? "Privacy policy" : "Terms of service"}
        </h1>
        <p className="mt-3 text-sm text-gray-500">Last updated July 28, 2026</p>

        {privacy ? (
          <div className="mt-10 space-y-7 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
              <p>
                We collect the profile, contact, appointment, and message details
                you submit so we can manage bookings and reply to enquiries. We
                do not collect card or online-payment details.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900">How we use it</h2>
              <p>
                We use this information to provide salon services, contact you
                about appointments, secure accounts, and maintain business
                records. We do not sell personal information.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Your choices</h2>
              <p>
                Contact the parlour to request access, correction, or deletion
                of your information, subject to records we must retain for
                legitimate business or legal reasons.
              </p>
            </section>
          </div>
        ) : (
          <div className="mt-10 space-y-7 leading-7 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Appointments</h2>
              <p>
                A submitted appointment is initially booked and may be confirmed
                by the parlour. Availability can change until the server accepts
                your booking.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Cancellations</h2>
              <p>
                You may cancel before the appointment. Cancellations within 24
                hours are recorded as late cancellations. Contact us if you need
                help changing a booking.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold text-gray-900">Prices</h2>
              <p>
                Displayed prices are service prices. The website does not accept
                online payment; payment is handled at the parlour.
              </p>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Legal;
