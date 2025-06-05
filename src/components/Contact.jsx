import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import woman from "../assets/businesswoman.jpg"; // Adjust the path to your image"
const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    console.log("Form data:", data);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section
      id="contact"
      className="min-h-screen w-full bg-white text-gray-800 font-sans"
    >
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Panel */}
        <div className="bg-[#f7f9fc] p-8 rounded-xl shadow-md flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-[#1e90ff]">Connect</span> with Our Team of
              Experts
            </h2>
            <p className="text-sm mb-6">
              Contact our team of excellence-driven experts today to bring your
              project to life.
            </p>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-[#1e90ff]" />
                <span>718.253.5200</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-5 h-5 text-[#1e90ff]" />
                <span>job@j.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-[#1e90ff]" />
                <a href="#" className="text-[#1e90ff] hover:underline">
                  See Our Locations
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
              <h3 className="text-base font-semibold mb-2">
                Want to Join Our Talented Team?
              </h3>
              <button className="w-full bg-[#1e90ff] text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all">
                Visit our job board
              </button>
            </div>
          </div>
          <div className="mt-8">
            <img
              src={woman}
              alt="Smiling Businesswoman"
              width={500}
              height={400}
              className="rounded-xl object-cover w-full h-60"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-[#0a1f44] p-8 rounded-xl shadow-md text-white">
          {isSubmitted && (
            <p className="text-center text-green-400 mb-4 animate-fadeIn">
              Message sent successfully! We'll get back to you soon.
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="text"
              {...register("name", { required: "Full Name is required" })}
              placeholder="Full Name"
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}

            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email Address"
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}

            <input
              type="number"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Phone Number"
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone.message}</p>
            )}

            <input
              type="text"
              {...register("location")}
              placeholder="Location"
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <select
              {...register("expertise")}
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">What Expertise You’re Interested In</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Apps</option>
              <option value="uiux">UI/UX Design</option>
              <option value="cloud">Cloud Architecture</option>
              <option value="ai">AI & ML Solutions</option>
            </select>

            <textarea
              {...register("project", {
                required: "Tell us about your project",
              })}
              placeholder="Tell Us About Your Project"
              rows="5"
              className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            {errors.project && (
              <p className="text-red-400 text-sm">{errors.project.message}</p>
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-sky-500 text-white p-3 rounded-md font-semibold hover:bg-sky-600 transition-all"
            >
              Submit
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
