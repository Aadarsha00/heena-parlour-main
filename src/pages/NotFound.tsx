import { Link } from "react-router";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/footer-home";

const NotFound = () => (
  <>
    <Navbar />
    <main className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <p className="text-sm font-semibold text-[#A0522D]">404</p>
        <h1 className="mt-2 text-4xl font-bold">Page not found</h1>
        <p className="mt-3 text-gray-600">
          The page may have moved or the address may be incorrect.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          Return home
        </Link>
      </div>
    </main>
    <Footer />
  </>
);

export default NotFound;
