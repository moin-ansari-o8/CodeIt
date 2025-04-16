import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Startup Founder",
      quote:
        "Nourex delivered an amazing e-commerce platform that boosted our sales by 40%!",
      image: "https://via.placeholder.com/100",
    },
    {
      name: "Jane Smith",
      role: "Designer",
      quote:
        "The team at Nourex transformed my portfolio into a stunning website. Highly recommend!",
      image: "https://via.placeholder.com/100",
    },
    {
      name: "Alex Brown",
      role: "App Developer",
      quote:
        "Their mobile app development expertise made our project a success. Fantastic collaboration!",
      image: "https://via.placeholder.com/100",
    },
  ];

  return (
    <section
      id="testimonials"
      className="bg-primary text-text pt-navbar pb-12"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto px-6">
        <h2
          id="testimonials-heading"
          className="text-4xl font-bold text-center mb-8"
        >
          What Our Clients Say
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mySwiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-secondary p-6 rounded-lg shadow-md text-center animate-fadeIn">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} avatar`}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                  loading="lazy"
                />
                <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-accent">{testimonial.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;