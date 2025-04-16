import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const Footer = () => {
  return (
    <footer className="bg-secondary text-text py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Nourex</h3>
            <p className="text-sm">
              Connecting you with top freelancers to bring your ideas to life.
            </p>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <form className="flex items-center">
              <div className="relative flex-1">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full pl-10 pr-4 py-2 rounded-l-md border border-secondary bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="bg-accent text-primary px-4 py-2 rounded-r-md hover:bg-opacity-80 transition"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-text hover:text-accent transition">
                Twitter
              </a>
              <a href="#" className="text-text hover:text-accent transition">
                LinkedIn
              </a>
              <a href="#" className="text-text hover:text-accent transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>© 2025 Nourex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;