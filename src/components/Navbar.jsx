import { useState, useEffect, useRef } from "react";
import { Link, animateScroll as scroll } from "react-scroll";
import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/CodeITDark.png"; // Adjust the path to your logo image
const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [theme, setTheme] = useState(
    sessionStorage.getItem("theme") || "white"
  );
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const observerRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    scroll.scrollToTop();
    setActiveLink("home");
  }, []);

  // Handle theme and IntersectionObserver
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);

    const sections = [
      "home",
      "about",
      "services",
      // "portfolio",
      "team",
      "contact",
    ];
    const navbarHeight = 80;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let maxVisible = { id: activeLink, ratio: 0 };
        entries.forEach((entry) => {
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight - navbarHeight;
          const visibleHeight =
            Math.min(rect.bottom - navbarHeight, viewportHeight) -
            Math.max(rect.top - navbarHeight, 0);
          const sectionHeight = rect.height;
          const visibleRatio =
            sectionHeight > 0 ? visibleHeight / sectionHeight : 0;
          if (visibleRatio > maxVisible.ratio) {
            maxVisible = { id: entry.target.id, ratio: visibleRatio };
          }
        });
        if (maxVisible.ratio >= 0.6) {
          setActiveLink(maxVisible.id);
        }
      },
      {
        rootMargin: `-${navbarHeight}px 0px 0px 0px`,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observerRef.current.observe(element);
    });

    return () => {
      if (observerRef.current) {
        sections.forEach((id) => {
          const element = document.getElementById(id);
          if (element) observerRef.current.unobserve(element);
        });
        observerRef.current.disconnect();
      }
    };
  }, [theme, activeLink]);

  const handleLinkClick = (to) => {
    setActiveLink(to);
    setIsMenuOpen(false);
  };

  // const toggleTheme = () => {
  //   setTheme((prevTheme) => (prevTheme === "white" ? "black" : "white"));
  // };

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-blue-200 text-text shadow-lg z-50 transition-all duration-300 ${
        scrolled ? "h-16" : "h-20"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 h-full">
        {/* Logo */}
        {/* <div
          className="text-2xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-sky-200"
          onClick={() => {
            scroll.scrollToTop();
            setActiveLink("home");
            setIsMenuOpen(false);
          }}
        >
          CodeIT
        </div> */}
        <div
          className="cursor-pointer -ml-6"
          onClick={() => {
            scroll.scrollToTop();
            setActiveLink("home");
            setIsMenuOpen(false);
          }}
        >
          <img
            src={logo}
            alt="CodeIT Logo"
            className="h-35 lg:h-45 w-auto max-h-[190px] object-contain"
          />
        </div>
        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex space-x-8">
          {["home", "about", "services", "team", "contact"].map((item) => (
            <li key={item} className="relative">
              <Link
                to={item}
                smooth={true}
                duration={500}
                offset={-82}
                className={`uppercase cursor-pointer transition-all duration-300 text-base font-medium ${
                  activeLink === item
                    ? "text-sky-800"
                    : "text-sky-600 hover:text-sky-800"
                }`}
                onClick={() => handleLinkClick(item)}
              >
                {item}
                {activeLink === item && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-800 scale-x-100 transform origin-left transition-transform duration-300"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        {/* Theme Toggle (Desktop) */}
        {/* <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="bg-accent text-primary p-2 rounded-full hover:bg-opacity-80 transition flex items-center"
          >
            {theme === "white" ? (
              <MoonIcon className="w-6 h-6" />
            ) : (
              <SunIcon className="w-6 h-6" />
            )}
          </button>
        </div> */}
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-text hover:text-sky-500"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-secondary shadow-lg">
          <ul className="flex flex-col items-center py-4 space-y-4">
            {["home", "about", "services", "team", "contact"].map((item) => (
              <li key={item} className="relative">
                <Link
                  to={item}
                  smooth={true}
                  duration={500}
                  offset={-82}
                  className={`uppercase cursor-pointer transition-all duration-300 text-lg font-medium ${
                    activeLink === item
                      ? "text-sky-500"
                      : "text-text hover:text-sky-400"
                  }`}
                  onClick={() => handleLinkClick(item)}
                >
                  {item}
                  {activeLink === item && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-100 transform origin-left transition-transform duration-300"></span>
                  )}
                </Link>
              </li>
            ))}
            {/* Theme Toggle (Mobile) */}
            {/* <button
              onClick={toggleTheme}
              className="bg-accent text-primary p-2 rounded-full hover:bg-opacity-80 transition flex items-center"
            >
              {theme === "white" ? (
                <MoonIcon className="w-6 h-6" />
              ) : (
                <SunIcon className="w-6 h-6" />
              )}
            </button> */}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
