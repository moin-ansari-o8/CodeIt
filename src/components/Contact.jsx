import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import emailjs from "emailjs-com";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const onSubmit = (data) => {
    // Must have at least email or phone
    if (!data.email && !data.phone) {
      alert("Please provide at least an email or phone number.");
      return;
    }

    setIsSending(true);

    // Double-check these IDs — paste exact strings from your EmailJS dashboard
    const serviceID = "service_j06ea5e"; // your service ID here
    const templateID = "template_xyellzh"; // your template ID here
    const userID = "Cud9Vve4zfANPMLTQ"; // your user/public key here

    // Debug print your data just before sending
    console.log("Sending email with data:", data);

    emailjs
      .send(
        serviceID,
        templateID,
        {
          name: data.name || "No Name",
          email: data.email || "No Email",
          phone: data.phone || "No Phone",
          message: data.message || "No message",
          to_email: "monstermoin716@gmail.com", // confirm if you need this, or remove if template doesn’t expect it
        },
        userID
      )
      .then(
        (result) => {
          console.log("EmailJS success:", result.text);
          setIsSending(false);
          setIsSubmitted(true);
          reset();
          setTimeout(() => setIsSubmitted(false), 10000);
        },
        (error) => {
          console.error("EmailJS error:", error);
          alert("Oops! Something went wrong. Please try again.");
          setIsSending(false);
        }
      );
  };

  const currentText = "Connect";

  return (
    <section id="contact" className="w-full text-gray-800 font-sans py-0 mb-0">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Left Panel */}
        <div className="p-8 flex flex-col justify-center">
          <div>
            <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4">
              <span className="inline-block min-h-[1.5em] w-fit bg-clip-text text-transparent bg-gradient-to-r from-[#38bdf8] to-[#0a192f] mr-2">
                {currentText}
                <span className="animate-blink">|</span>
              </span>
              <span className="text-gray-800">with Our Team of Experts</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Contact our team of excellence-driven experts today to bring your
              project to life.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2 text-lg font-medium text-[#0a192f]">
                <PhoneIcon className="w-6 h-6 text-[#1e90ff]" />
                <span>718.253.5200</span>
              </div>
              <div className="flex items-center gap-2 text-lg font-medium text-[#0a192f]">
                <EnvelopeIcon className="w-6 h-6 text-[#1e90ff]" />
                <span>job@j.com</span>
              </div>
            </div>

            {/* Global Offices */}
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border-l-4 border-sky-400">
              <h3 className="text-xl font-bold text-sky-600 uppercase tracking-wide">
                Global Offices
              </h3>
              <p className="text-base text-gray-800">
                <strong className="block">Afghanistan:</strong> Phase 4,
                Omid-e-Sabz Township, Kabul
              </p>
              <p className="text-base text-gray-800">
                <strong className="block">India:</strong> Anand, Gujarat, India
              </p>
              <p className="text-base text-gray-800">
                <strong className="block">Germany:</strong> Hansastraße 79a,
                Munich
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="p-8 text-white flex justify-center items-center">
          <div className="w-full max-w-lg bg-sky-600 ml-10 p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <input
                    type="text"
                    {...register("name", { required: "Full Name is required" })}
                    placeholder="Full Name"
                    className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    type="tel"
                    {...register("phone", {
                      pattern: {
                        value: /^[0-9+\-()\s]*$/,
                        message: "Phone number contains invalid characters",
                      },
                    })}
                    placeholder="Phone Number"
                    className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="email"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                placeholder="Email Address"
                className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}

              <textarea
                {...register("message", { required: "Message is required" })}
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
              ></textarea>
              {errors.message && (
                <p className="text-red-400 text-sm">{errors.message.message}</p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className={`flex items-center gap-2 bg-sky-900 text-white px-5 py-3 rounded-md font-semibold transform transition-transform duration-300 hover:scale-105 ${
                    isSending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSending ? "Sending..." : "Submit"}
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
            {isSubmitted && (
              <p
                className="text-center text-gray-400 mb-6 text-2xl font-bold
               opacity-100 transition-opacity duration-1000"
                style={{ animation: "fadeInOut 10s forwards" }}
              >
                Message sent successfully! We'll get back to you soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
