import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  CloudIcon,
  CogIcon,
  MegaphoneIcon,
  SparklesIcon,
  WrenchIcon,
  LightBulbIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const Services = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      id: "web",
      label: "Web Development",
      desc: [
        "We build responsive, blazing-fast websites tailored to your business.",
        "Our solutions are SEO-friendly and optimized for conversions.",
        "Get custom-built functionality to match your operations.",
        "We ensure smooth performance across all devices and platforms.",
        "Websites that grow and scale effortlessly as your brand evolves.",
      ],
      icon: CodeBracketIcon,
    },
    {
      id: "mobile",
      label: "Mobile App Development",
      desc: [
        "We create sleek, scalable apps for iOS and Android platforms.",
        "Native and cross-platform builds that perform flawlessly.",
        "Boost engagement with real-time connectivity and push features.",
        "Clean architecture for high performance and minimal bugs.",
        "Designed to delight users and drive mobile-first growth.",
      ],
      icon: DevicePhoneMobileIcon,
    },
    {
      id: "uiux",
      label: "UI/UX Design",
      desc: [
        "Designs crafted for simplicity, elegance, and emotional impact.",
        "Focus on user behavior to maximize retention and engagement.",
        "Clickable prototypes and high-fidelity mockups delivered.",
        "End-to-end experiences from wireframe to final delivery.",
        "We design digital journeys that users fall in love with.",
      ],
      icon: PaintBrushIcon,
    },
    {
      id: "cloud",
      label: "Cloud Solutions",
      desc: [
        "Migrate, scale, and run services seamlessly on the cloud.",
        "Reliable, secure, and cost-effective infrastructure planning.",
        "Auto-scaling systems with real-time performance tracking.",
        "Cloud-native apps built for speed and efficiency.",
        "We future-proof your business through resilient architectures.",
      ],
      icon: CloudIcon,
    },
    {
      id: "marketing",
      label: "Digital Marketing",
      desc: [
        "Complete digital strategy including SEO, SEM, and content.",
        "Ads, influencers, and email campaigns with measurable ROI.",
        "Turn casual visitors into loyal customers with funnels.",
        "Engaging social media posts that spark conversation.",
        "We help your brand speak louder in the digital crowd.",
      ],
      icon: MegaphoneIcon,
    },
    {
      id: "ai",
      label: "AI & Machine Learning",
      desc: [
        "Leverage data to build intelligent and predictive systems.",
        "AI that automates tasks and empowers decision-making.",
        "From chatbots to recommendation engines we’ve got you.",
        "Smart integrations that blend seamlessly into your workflow.",
        "Future-ready solutions driven by data science and ML.",
      ],
      icon: SparklesIcon,
    },
    {
      id: "support",
      label: "Maintenance & Support",
      desc: [
        "24/7 proactive monitoring and uptime assurance.",
        "Routine health checks, bug fixes, and updates.",
        "Security patching to keep your system bulletproof.",
        "Support tailored to scale with your operations.",
        "We’re your tech safety net always on standby.",
      ],
      icon: WrenchIcon,
    },
    {
      id: "consulting",
      label: "Tech Consulting",
      desc: [
        "Strategic insights for startups and enterprise-scale projects.",
        "Plan architecture, tech stack, and growth roadmap.",
        "Avoid costly tech mistakes with our expert advice.",
        "Workshops and audits to optimize your workflow.",
        "Build smarter, innovate faster, grow stronger.",
      ],
      icon: LightBulbIcon,
    },
  ];

  return (
    <section
      id="services"
      className="relative pt-navbar text-[#0a192f] overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Left: Dynamic Hover Content */}
          <div className="animate-fadeIn flex flex-col px-6 min-h-[180px]">
            <AnimatePresence mode="wait">
              {hoveredService === null ? (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="mt-[115px] space-y-6 pl-4 text-[#334155]"
                >
                  <div className="border-l-4 border-sky-700 pl-4 mb-6 rounded-lg">
                    <h3 className="text-4xl font-semibold text-sky-900">
                      Explore Our Services
                    </h3>
                  </div>
                  <p className="text-xl leading-relaxed">
                    Welcome to{" "}
                    <span className="text-sky-700 font-semibold">CodeIt</span>,
                    your comprehensive digital solutions partner.
                  </p>
                  <p className="text-xl leading-relaxed">
                    We specialize in building high-performance websites,
                    innovative mobile applications, and user-centric interface
                    designs.
                  </p>
                  <p className="text-xl leading-relaxed">
                    Our expertise spans across cloud infrastructure, artificial
                    intelligence, digital marketing, technical support, and
                    strategic consulting all tailored to meet your unique
                    business goals.
                  </p>
                  <p className="text-xl leading-relaxed">
                    Hover over any of the services on the right to explore what
                    we can deliver for your business.
                  </p>
                </motion.div>
              ) : (
                services
                  .filter((service) => service.id === hoveredService)
                  .map((service) => (
                    <motion.div
                      key={service.id}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-4 pl-4"
                    >
                      <div className="flex items-center border-l-4 mt-[115px] border-sky-700 pl-4 mb-9 rounded-lg">
                        <h3 className="text-4xl font-semibold text-sky-900">
                          {service.label}
                        </h3>
                        <service.icon className="w-9 h-9 text-white bg-sky-700 ml-4 p-2 rounded-sm" />
                      </div>
                      <div className="text-xl text-[#334155] space-y-4">
                        {service.desc.map((point, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.4 }}
                            className="flex items-start space-x-2"
                          >
                            <ChevronRightIcon className="w-5 h-5 mt-1 text-sky-600 flex-shrink-0" />
                            <p className="leading-relaxed">{point}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>

          {/* Right: Hoverable Tabs */}
          <div className="flex flex-col items-center text-center space-y-10">
            <div>
              <h2 className="text-4xl font-bold sm:text-5xl lg:text-5xl">
                <span className="inline-block bg-clip-text text-transparent bg-sky-900">
                  What we do at CodeIt?
                </span>
              </h2>
              <div className="h-1 bg-sky-900 rounded-full mt-2"></div>
              <div className="w-fit h-1 mt-2 bg-[#38bdf8] rounded-full mx-auto"></div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full px-7">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  onMouseEnter={() => setHoveredService(service.id)}
                  className={`relative flex items-center pl-12 px-6 py-6 h-24 text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none group ${
                    hoveredService === service.id
                      ? "bg-gradient-to-r from-[#0ea5e9] to-[#3b82f6] text-white"
                      : "bg-white text-[#0a192f] hover:bg-gradient-to-r hover:from-[#e0f2fe] hover:to-[#bae6fd]"
                  }`}
                >
                  <service.icon
                    className={`w-5 h-5 mr-3 transition-transform duration-300 ${
                      hoveredService === service.id
                        ? "text-white scale-110"
                        : "text-[#0a192f] group-hover:text-[#2563eb] group-hover:scale-100"
                    }`}
                  />
                  {service.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
