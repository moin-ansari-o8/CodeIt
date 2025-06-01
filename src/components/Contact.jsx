import { useForm } from "react-hook-form";
import { useState } from "react";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    // Simulate API call
    console.log("Form data:", data);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000); // Reset success message after 3s
  };

  return (
    <section id="contact" className="min-h-screen text-text pt-navbar pb-12">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-8">Contact Us</h2>
        {isSubmitted && (
          <p className="text-center text-accent mb-4 animate-fadeIn">
            Message sent successfully! We'll get back to you soon.
          </p>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-lg mx-auto bg-secondary p-8 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className={`w-full p-3 rounded-md border ${
                errors.name ? "border-red-500" : "border-secondary"
              } bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent`}
              placeholder="Your Name"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full p-3 rounded-md border ${
                errors.email ? "border-red-500" : "border-secondary"
              } bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent`}
              placeholder="Your Email"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              className={`w-full p-3 rounded-md border ${
                errors.message ? "border-red-500" : "border-secondary"
              } bg-primary text-text focus:outline-none focus:ring-2 focus:ring-accent`}
              rows="5"
              placeholder="Your Message"
              aria-invalid={errors.message ? "true" : "false"}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-primary p-3 rounded-md font-semibold hover:bg-opacity-80 transition disabled:bg-gray-400"
            disabled={isSubmitted}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
