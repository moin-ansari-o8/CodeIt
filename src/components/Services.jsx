import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  CloudIcon,
  CogIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/solid";

const Services = () => {
  const services = [
    {
      title: "Web Development",
      desc: "Custom websites tailored to your needs.",
      icon: <CodeBracketIcon className="w-8 h-8 text-accent" />,
    },
    {
      title: "Mobile App Development",
      desc: "Native and cross-platform apps.",
      icon: <DevicePhoneMobileIcon className="w-8 h-8 text-accent" />,
    },
    {
      title: "UI/UX Design",
      desc: "User-friendly and stunning designs.",
      icon: <PaintBrushIcon className="w-8 h-8 text-accent" />,
    },
    {
      title: "Cloud Solutions",
      desc: "Scalable and secure cloud infrastructure.",
      icon: <CloudIcon className="w-8 h-8 text-accent" />,
    },
    {
      title: "DevOps Services",
      desc: "Streamlined development and deployment.",
      icon: <CogIcon className="w-8 h-8 text-accent" />,
    },
    {
      title: "Digital Marketing",
      desc: "Boost your online presence.",
      icon: <MegaphoneIcon className="w-8 h-8 text-accent" />,
    },
  ];

  return (
    <section
      id="services"
      className="min-h-screen bg-primary text-text pt-navbar pb-12"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {service.icon}
                <h3 className="text-xl font-semibold ml-3">{service.title}</h3>
              </div>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;