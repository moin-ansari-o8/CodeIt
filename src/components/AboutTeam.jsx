import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from "swiper";
import zoro from "../assets/team/zoro.png";
import sanji from "../assets/team/sanji.png";
import nami from "../assets/team/nami.png";
import luffy from "../assets/team/luffy.png";
import chopper from "../assets/team/chopper.png";
const AboutTeam = () => {
  const swiperRef = useRef(null);

  const team = [
    {
      name: "Roronoa Zoro",
      role: "Full Stack Developer",
      intro:
        "Brings ideas to life through React magic and Django sorcery. Always shipping innovation.",
      image: zoro,
    },
    {
      name: "Monkey D. Luffy",
      role: "UI/UX Designer",
      intro:
        "Designs intuitive experiences that spark emotion and create connection. Lover of clean grids and dreamy palettes.",
      image: luffy,
    },
    {
      name: "Nami",
      role: "Cloud Architect",
      intro:
        "Builds resilient, scalable infrastructures. Keeps our apps running even during a thunderstorm (literally).",
      image: nami,
    },
    {
      name: "Vinsmoke Sanji",
      role: "AI Engineer",
      intro:
        "Crafts intelligent systems with heart. Merges data, ethics, and creativity into smart tech.",
      image: sanji,
    },
    {
      name: "Tony Tony Chopper",
      role: "Marketing Head",
      intro:
        "Crafts campaigns that resonate. Turns ideas into trends and audiences into loyal fans.",
      image: chopper,
    },
  ];

  const handleHover = (index) => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;
    if (index === 0) swiper.slidePrev();
    if (index === 2) swiper.slideNext();
  };

  return (
    <div className="w-full py-10 px-4">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="w-full"
      >
        {team.map((member, index) => (
          <SwiperSlide key={index}>
            {({ isActive, isNext, isPrev }) => (
              <motion.div
                onMouseEnter={() => {
                  if (isPrev) handleHover(0);
                  if (isNext) handleHover(2);
                }}
                className={`transition-all duration-500 ease-in-out transform flex flex-col items-center justify-between p-6 rounded-2xl shadow-xl bg-white mx-auto mb-10 ${
                  isActive ? "scale-100" : "scale-75 opacity-70"
                }`}
                style={{ width: 460, height: 500 }}
              >
                <div className="h-[40%] flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 object-cover rounded-full mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="h-[10%] text-xl font-semibold text-center mb-0">
                  {member.name}
                </div>
                <div className="h-[10%] text-base text-gray-600 text-center">
                  {member.role}
                </div>
                <div className="h-[10%] w-full">
                  <hr className="border-t border-gray-300 w-2/3 mx-auto" />
                </div>
                <div className="h-[30%] text-base text-center px-6 text-gray-700 overflow-hidden">
                  {member.intro}
                </div>
              </motion.div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AboutTeam;
