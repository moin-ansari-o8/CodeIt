import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AboutTeam from "./components/AboutTeam";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { animateScroll as scroll } from "react-scroll";
import Chatbot from "./components/Chatbot";

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    scroll.scrollToTop();
    // scroll.scrollTo(document.getElementById("about").offsetTop);
  };

  return (
    <div
      className="min-h-screen text-[#0a192f] bg-gradient-to-br from-[#f0f9ff] via-[#dbeafe] to-[#eff6ff] relative"
      style={{
        backgroundImage: `
      radial-gradient(circle at top right, rgba(255, 255, 255, 0.7), transparent 70%),
      linear-gradient(to bottom right, #f0f9ff, #dbeafe, #eff6ff)
    `,
      }}
    >
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        {/* <Portfolio /> */}
        <AboutTeam />
        {/* <Contact /> */}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
