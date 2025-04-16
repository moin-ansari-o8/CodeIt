import { Link } from "react-scroll";
import { useEffect, useState } from "react";
import {
  CalendarIcon,
  TrophyIcon,
  UsersIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/solid";

const About = () => {
  // State for animated counters
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
          animateCounter(setProjects, 150, 2000); // 150 projects over 2 seconds
          animateCounter(setClients, 80, 2000); // 80 clients
          animateCounter(setYears, 2, 2000); // 2 years
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
      className="relative bg-primary text-text pt-navbar pb-12 overflow-hidden"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6">
        {/* Introduction */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl font-bold sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-accent to-teal-600">
            Our Journey at Nourex
          </h2>
          <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Nourex is more than a freelancing company—we’re your partners in
            innovation. Specializing in custom websites, mobile apps, and digital
            solutions, we turn your ideas into impactful realities with a
            client-first approach.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mb-20">
          <h3 className="text-3xl font-semibold text-center text-text mb-12 animate-fadeIn">
            Our Story
          </h3>
          {/* Vertical Line for Timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-accent h-full opacity-50"></div>

          <div className="space-y-12">
            {/* Timeline Item 1 */}
            <div className="relative flex items-center justify-between">
              <div className="w-5/12 text-right pr-8 animate-fadeIn">
                <h4 className="text-xl font-semibold text-text">2023</h4>
                <p className="text-base mt-2">
                  Nourex was founded with a vision to empower businesses through
                  technology and creativity.
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-3">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="w-5/12"></div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex items-center justify-between">
              <div className="w-5/12"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-3">
                <TrophyIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="w-5/12 pl-8 animate-fadeIn">
                <h4 className="text-xl font-semibold text-text">
                  First Major Project
                </h4>
                <p className="text-base mt-2">
                  Delivered our first large-scale project—a fully responsive
                  e-commerce platform for a growing startup.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex items-center justify-between">
              <div className="w-5/12 text-right pr-8 animate-fadeIn">
                <h4 className="text-xl font-semibold text-text">2024</h4>
                <p className="text-base mt-2">
                  Expanded our team with top freelancers, specializing in web,
                  mobile, and UI/UX design.
                </p>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-3">
                <UsersIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="w-5/12"></div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative flex items-center justify-between">
              <div className="w-5/12"></div>
              <div className="absolute left-1/2 transform -translate-x-1/2 bg-accent rounded-full p-3">
                <BriefcaseIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="w-5/12 pl-8 animate-fadeIn">
                <h4 className="text-xl font-semibold text-text">Today</h4>
                <p className="text-base mt-2">
                  Serving clients worldwide with a portfolio of 150+ successful
                  projects and counting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div id="stats" className="mb-20">
          <h3 className="text-3xl font-semibold text-center text-text mb-12 animate-fadeIn">
            Our Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-secondary rounded-lg shadow-md">
              <h4 className="text-4xl font-bold text-accent">{projects}+</h4>
              <p className="mt-2 text-lg">Projects Completed</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-md">
              <h4 className="text-4xl font-bold text-accent">{clients}+</h4>
              <p className="mt-2 text-lg">Happy Clients</p>
            </div>
            <div className="p-6 bg-secondary rounded-lg shadow-md">
              <h4 className="text-4xl font-bold text-accent">{years}</h4>
              <p className="mt-2 text-lg">Years of Excellence</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fadeIn">
          <h3 className="text-2xl font-semibold text-text mb-6">
            Ready to Start Your Project?
          </h3>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            offset={-82}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold uppercase transition-all duration-300 bg-accent text-primary rounded-full hover:bg-opacity-90 hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;