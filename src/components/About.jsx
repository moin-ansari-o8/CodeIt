import { Link } from "react-scroll";
import { useState } from "react";
import {
  RocketLaunchIcon,
  StarIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import about_bg from "../assets/about_bg.png"; // Adjust the path to your background image
const About = () => {
  const [activeRightTab, setActiveRightTab] = useState("mission");

  const tabs = [
    { id: "mission", label: "Our Mission", icon: RocketLaunchIcon },
    { id: "glance", label: "At a Glance", icon: StarIcon },
    { id: "team", label: "Our Team", icon: UsersIcon },
  ];

  const content = {
    mission:
      "To empower businesses and developers through intelligent, scalable, and future-ready software solutions built with passion, precision, and purpose.",
    glance:
      "Codeit Technologies is where innovation meets execution. We specialize in building reliable, high-performance applications tailored to real-world needs. Whether it’s a startup idea or enterprise-grade architecture, we code it and deliver it without compromise.",
    team: "We’re a tight-knit team of developers, designers, and problem-solvers who believe in clean code and clear results. With diverse backgrounds in software engineering, DevOps, UI/UX, and AI-driven development, we combine technical excellence with creative thinking to deliver modern solutions that scale with your vision.",
  };

  return (
    <section
      id="about"
      className="relative pt-navbar pb-12 text-[#0a192f] overflow-hidden"
    >
      <div className="container mx-auto px-6 ">
        {/* Whole left+right container bg */}
        <div
          className="relative mb-20 p-10 shadow-lg rounded-xl bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${about_bg})` }}
        >
          {/* Overlay Blur - only for BG */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl z-0 pointer-events-none"></div>

          {/* Actual Content Layer */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="animate-fadeIn">
              <div className="flex flex-col items-center text-center">
                <div className="inline-block text-center">
                  <h2 className="text-4xl font-bold sm:text-5xl lg:text-5xl">
                    <span className="inline-block bg-clip-text text-transparent bg-sky-900">
                      Who We Are at CodeIT
                    </span>
                  </h2>

                  {/* Underline exactly as wide as the heading */}
                  <div className="h-1 bg-sky-900 rounded-full mt-2"></div>
                </div>

                <div className="w-fit h-1 mt-2 bg-[#38bdf8] rounded-full mx-auto"></div>
              </div>
              <div className="mt-14 relative px-10 py-6 rounded-lg border-l-[5px] border-sky-900 text-[#cbd5e1] max-w-3xl mx-auto">
                <p className="text-lg sm:text-xl max-w-lg mx-auto leading-relaxed text-[#0a192f]">
                  CodeIT Technologies bridges the gap between vision and
                  reality, delivering cutting-edge software solutions with a
                  team of elite innovators. Discover our story.
                </p>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col space-y-8">
              {/* Tabs */}
              <div className="flex flex-wrap justify-center gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveRightTab(tab.id)}
                    className={`relative flex items-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                      activeRightTab === tab.id
                        ? "bg-[#f1f5f9] text-[#0a192f] hover:bg-gradient-to-r hover:from-[#2563eb]/20 hover:to-[#93c5fd]/20 hover:scale-102"
                        : "bg-gradient-to-r from-[#2563eb]/30 to-[#93c5fd]/30 text-[#0a192f] shadow-md scale-105"
                    } group`}
                  >
                    <tab.icon
                      className={`w-5 h-5 mr-2 transition-transform duration-300 ${
                        activeRightTab === tab.id
                          ? "text-[#2563eb]"
                          : "text-[#0a192f] group-hover:text-[#2563eb] group-hover:scale-110"
                      }`}
                    />
                    {tab.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#2563eb] to-[#93c5fd] transform scale-x-0 transition-transform duration-300 origin-left ${
                        activeRightTab === tab.id
                          ? "scale-x-100"
                          : "group-hover:scale-x-100"
                      }`}
                    ></span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="px-10 py-6 bg-white rounded-lg shadow-md min-h-[220px] flex items-center justify-start text-left text-[#334155]">
                <p className="text-lg sm:text-xl leading-relaxed">
                  {content[activeRightTab]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
