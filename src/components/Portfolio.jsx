import { useState } from "react";
import img1 from "../assets/img1.jpg?format=webp&quality=80";
import img2 from "../assets/img2.jpg?format=webp&quality=80";

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A fully responsive online store with payment integration.",
      image: img1,
      category: "web",
      details: "Built with React, Node.js, and Stripe for payments.",
    },
    {
      title: "Portfolio Website",
      description: "A sleek portfolio for a freelance designer.",
      image: img2,
      category: "design",
      details: "Designed with Figma and developed with Vite.",
    },
    {
      title: "Task Management App",
      description: "A productivity app with real-time collaboration.",
      image: img1,
      category: "mobile",
      details: "Developed with React Native and Firebase.",
    },
  ];

  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section
      id="portfolio"
      className="min-h-screen bg-primary text-text pt-navbar pb-12"
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Our Portfolio</h2>
        <p className="text-lg text-center max-w-3xl mx-auto mb-8">
          Explore our recent projects showcasing expertise in web, mobile, and design.
        </p>
        {/* Filters */}
        <div className="flex justify-center space-x-4 mb-8">
          {["all", "web", "mobile", "design"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-md font-semibold capitalize ${
                filter === category
                  ? "bg-accent text-primary"
                  : "bg-secondary text-text hover:bg-accent hover:text-primary"
              } transition-all duration-300`}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-secondary p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 animate-fadeIn"
            >
              <img
                src={project.image}
                alt={project.title}
                className="h-48 w-full object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mb-4">{project.description}</p>
              <button
                onClick={() => alert(project.details)} // Replace with modal
                className="text-accent hover:underline"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;