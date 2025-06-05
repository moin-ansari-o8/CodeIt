import { Link } from "react-scroll";
import { useState, useEffect } from "react";
import img1 from "../assets/some1.png";
import img2 from "../assets/some2.png";
import img3 from "../assets/some3.png";

const Hero = () => {
  const words = ["Smart Code.", "Scalable Solutions.", "Seamless Delivery."];
  const images = [img1, img2, img3]; // Array of images corresponding to words
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [shouldSlide, setShouldSlide] = useState(false);
  const [fadeImage, setFadeImage] = useState(false); // State for fade animation

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

  // Typing effect logic and image fade trigger
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
        setFadeImage(true); // Trigger fade animation before changing image
        setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setFadeImage(false); // Reset fade after image change
        }, 300); // Match fade-out duration
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed]);

  return (
    <section
      id="home"
      className="relative pt-24 pb-16 text-[#0a192f] sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-24 xl:pt-36 xl:pb-28 overflow-hidden pt-navbar"
    >
      {/* 🔥 Removed gradient background and overlay */}
      {/* <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl"></div> */}
      {/* 💎 Gorgeous Blue-Gradient Aura */}

      <div className="container mx-auto px-6">
        <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16 mx-2 sm:mx-4">
          {/* Left Side */}
          <div className="font-poppins animate-fadeIn">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
              Welcome to CodeIt Technologies
              <br />
              <span className="inline-block min-h-[1.5em] w-[16ch] text-left bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] to-[#0a192f] mt-8 mb-[-1.7rem]">
                {currentText}
                <span className="animate-blink">|</span>
              </span>
            </h1>
            <p className="mt-6 text-lg font-normal leading-relaxed sm:mt-8 sm:text-xl max-w-lg">
              At CodeIt, we guide your tech journey with clarity and purpose.
              From AI fueled innovation to rock solid maintenance.We build
              smarter, faster, and cleaner digital experiences that last.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4">
              {/* <Link
                to="contact"
                smooth={true}
                duration={500}
                offset={-82}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 bg-accent text-primary rounded-full hover:bg-opacity-90 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Start Your Project
              </Link> */}
              <Link
                to="portfolio"
                smooth={true}
                duration={500}
                offset={-82}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 border-2 border-blue-900 text-blue-900 rounded-full hover:bg-sky-900 hover:text-blue-200 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                View Our Work
              </Link>
            </div>
            <div className="mt-8 sm:mt-10">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Faster Development",
                  "AI-Powered Solutions",
                  "Top Talent",
                  "Exert Guidance",
                  "Future-Ready Tech",
                  "Scalable Growth",
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <svg
                      className="w-6 h-6 text-sky-500 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-lg font-medium text-secondary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side */}
          <div
            className={`relative flex justify-center transition-all duration-500 ${
              shouldSlide ? "slide-right" : "slide-back"
            }`}
          >
            {/* 💎 Gorgeous Blue-Gradient Aura */}
            {/* <div className="absolute inset-0 -m-3 bg-gradient-to-r from-[#38bdf8]/60 to-[#87CEEB]/60 rounded-3xl transform rotate-2 blur-xl opacity-70"></div> */}
            {/* <div className="absolute inset-0 -m-3 bg-gradient-to-r from-[#87CEEB]/60 to-[#38bdf8]/60 rounded-3xl transform rotate-2 blur-xl opacity-70"></div> */}
            <div className="absolute inset-0 -m-3  rounded-3xl transform rotate-2 blur-xl opacity-70"></div>

            {/* 🧊 Floating Image Only - Clean & Transparent */}
            <div className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[800px]">
              <div
                className={`relative transition-transform duration-500 hover:scale-105 hover:-rotate-2`}
              >
                <img
                  className={`w-full rounded-2xl transition-opacity duration-500 ${
                    fadeImage ? "animate-imageFade" : "opacity-100"
                  }`}
                  src={images[currentWordIndex]}
                  alt="CodeIt freelancing illustration"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
