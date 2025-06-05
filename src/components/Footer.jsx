import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa6";
import logo from "../assets/CodeITDark.png"; // Adjust the path to your logo image

const Footer = () => {
  return (
    <footer className="bg-blue-200 text-sky-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">CodeIt</h3>
            {/* <img
              src={logo}
              alt="CodeIt Logo"
              className="mx-auto w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 transition-transform duration-500 hover:scale-105"
            /> */}

            <p className="text-sm leading-relaxed text-sky-700">
              Empowering global innovation by connecting you with top-tier
              freelancers who turn ideas into impact.
            </p>
          </div>

          {/* Contact / Address Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-sky-700" />
              Global Offices
            </h3>
            <ul className="text-sm space-y-2 text-sky-700">
              <li>
                <strong>Afghanistan:</strong> Phase 4, Omid-e-Sabz Township,
                Kabul
              </li>
              <li>
                <strong>India:</strong> Anand, Gujarat, India
              </li>
              <li>
                <strong>Germany:</strong> Hansastraße 79a, Munich
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/codeit_official"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-100 rounded-full hover:bg-sky-800 text-sky-800 hover:text-white transition"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/codeit_official"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-100 rounded-full hover:bg-sky-800 text-sky-800 hover:text-white transition"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.x.com/codeit_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-100 rounded-full hover:bg-sky-800 text-sky-800 hover:text-white transition"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/codeit_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-100 rounded-full hover:bg-sky-800 text-sky-800 hover:text-white transition"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-sky-400 pt-6 text-center text-sm text-sky-600">
          © 2025 <span className="text-sky-800 font-semibold">CodeIt</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
