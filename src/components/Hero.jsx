import { Link } from "react-scroll";
import { useState, useEffect } from "react";
import img1 from "../assets/img2.jpg?format=webp&quality=80";

const Hero = () => {
  const words = ["Web Development", "Mobile Apps", "Software Solutions", "UI/UX Design"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [shouldSlide, setShouldSlide] = useState(false);

  // Handle image sliding based on text length and screen size
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      if (currentText.length > 13) {
        setShouldSlide(true);
      } else {
        setShouldSlide(false);
      }
    } else {
      setShouldSlide(false);
    }
  }, [currentText]);

  // Typing effect logic
  useEffect(() => {
    const handleTyping = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      }

      if (!isDeleting && currentText === fullWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 bg-primary text-text sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 xl:pt-36 xl:pb-28 overflow-hidden pt-navbar"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent pointer-events-none"></div>
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16 mx-2 sm:mx-4">
          {/* Left Side */}
          <div className="font-poppins animate-fadeIn">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Build Your Future with Expert
              <br />
              <span className="inline-block min-h-[1.5em] w-[16ch] text-left bg-clip-text text-transparent bg-gradient-to-r from-accent to-teal-600 mt-8 mb-[-1.7rem]">
                {currentText}
                <span className="animate-blink">|</span>
              </span>
            </h1>
            <p className="mt-6 text-lg font-normal leading-relaxed sm:mt-8 sm:text-xl max-w-lg">
              At Nourex, we connect you with world-class freelancers to craft stunning websites, innovative mobile apps, and cutting-edge software solutions. Turn your vision into reality with talent that delivers.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4">
              <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-82}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 bg-accent text-primary rounded-full hover:bg-opacity-90 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Start Your Project
              </Link>
              <Link
                to="portfolio"
                smooth={true}
                duration={500}
                offset={-82}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 border-2 border-accent text-accent rounded-full hover:bg-accent hover:text-primary hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                View Our Work
              </Link>
            </div>
            <div className="mt-8 sm:mt-10">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Fast Hiring", "Top Talent", "Custom Solutions", "Scalable Growth"].map((item) => (
                  <li key={item} className="flex items-center">
                    <svg className="w-6 h-6 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-lg font-medium text-text">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side */}
          <div className={`relative flex justify-center transition-all duration-500 ${shouldSlide ? "slide-right" : "slide-back"}`}>
          <div className="absolute inset-0 -m-3 bg-gradient-to-r from-accent/40 to-teal-500/70 rounded-3xl transform rotate-3 blur-md"></div>
          <div className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px]">
              <img
                className="w-full rounded-2xl dark:shadow-dark-2xl shadow-2xl transition-all duration-500 hover:dark:shadow-dark-3xl hover:shadow-3xl hover:scale-105 hover:-rotate-3"
                src={img1}
                alt="Nourex freelancing illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;