import { Link } from "react-scroll";
import { useEffect, useState } from "react";
import {
  RocketLaunchIcon,
  UsersIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const About = () => {
  const [projects, setProjects] = useState(0);
  const [clients, setClients] = useState(0);
  const [years, setYears] = useState(0);

  // Animate counters when section is in view
  useEffect(() => {
    const animateCounter = (setter, target, duration) => {
      let start = 0;
      const increment = target / (duration / 50);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        setter(Math.floor(start));
      }, 50);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounter(setProjects, 150, 2000);
          animateCounter(setClients, 80, 2000);
          animateCounter(setYears, 2, 2000);
        }
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById("stats");
    if (statsSection) observer.observe(statsSection);

    return () => {
      if (statsSection) observer.unobserve(statsSection);
    };
  }, []);

  return (
    <section
      id="about"
      className="relative text-text pt-navbar pb-12 overflow-hidden"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none"></div>
      <div className="container mx-auto px-6">
        {/* Introduction */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] to-[#0a192f]">
            Who We Are at CodeIT
          </h2>
          <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            CodeIT is your gateway to innovation, connecting you with elite
            freelancers who breathe life into your digital dreams. From bespoke
            websites to groundbreaking apps, we deliver solutions that inspire,
            engage, and succeed.
          </p>
        </div>
        {/* Mission Statement */}
        <div className="mb-20 animate-slideInRight">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-secondary rounded-lg shadow-md">
              <RocketLaunchIcon className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-2xl font-semibold text-text mb-2">
                Our Mission
              </h3>
              <p className="text-base">
                To empower businesses and creators by providing seamless access
                to top-tier talent, crafting software solutions that push
                boundaries and drive growth.
              </p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-md">
              <UsersIcon className="w-10 h-10 text-accent mb-4" />
              <h3 className="text-2xl font-semibold text-text mb-2">
                Our Team
              </h3>
              <p className="text-base">
                A global network of expert freelancers specializing in web
                development, mobile apps, UI/UX design, and more, united by a
                passion for excellence.
              </p>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        {/* <div id="stats" className="mb-20">
          <h3 className="text-3xl font-semibold text-center text-text mb-12 animate-fadeIn">
            Our Impact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-secondary rounded-lg shadow-md flex flex-col items-center">
              <StarIcon className="w-8 h-8 text-accent mb-2" />
              <h4 className="text-4xl font-bold text-accent">{projects}+</h4>
              <p className="mt-2 text-lg">Projects Delivered</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-md flex flex-col items-center">
              <StarIcon className="w-8 h-8 text-accent mb-2" />
              <h4 className="text-4xl font-bold text-accent">{clients}+</h4>
              <p className="mt-2 text-lg">Satisfied Clients</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-md flex flex-col items-center">
              <StarIcon className="w-8 h-8 text-accent mb-2" />
              <h4 className="text-4xl font-bold text-accent">{years}</h4>
              <p className="mt-2 text-lg">Years of Expertise</p>
            </div>
          </div>
        </div> */}
        {/* Call to Action */}
        <div className="text-center animate-fadeIn">
          <h3 className="text-2xl font-semibold text-text mb-6">
            Ready to Transform Your Ideas?
          </h3>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            offset={-82}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 bg-accent text-primary rounded-full hover:bg-opacity-90 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Collaborate with Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
