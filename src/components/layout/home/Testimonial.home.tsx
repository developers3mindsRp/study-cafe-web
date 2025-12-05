"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Verma",
    role: "Software Developer",
    image: "/images/r1.png",
    rating: 5,
    text: "StudyCafe transformed my career! The courses are practical, well-structured, and the instructors are incredibly knowledgeable."
  },
  {
    name: "Priya Sharma",
    role: "Data Analyst",
    image: "/images/r2.png",
    rating: 5,
    text: "I gained so much confidence after taking the courses. Highly recommended!"
  },
  {
    name: "Ankit Jain",
    role: "Frontend Developer",
    image: "/images/r3.png",
    rating: 5,
    text: "The hands-on projects made learning fun and effective."
  },
  {
    name: "Sneha Gupta",
    role: "UX Designer",
    image: "/images/r4.png",
    rating: 5,
    text: "Amazing instructors and course content. I landed my dream job!"
  },
  {
    name: "Vikram Singh",
    role: "Backend Developer",
    image: "/images/r5.png",
    rating: 5,
    text: "The courses are concise, practical, and career-focused."
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const current = testimonials[currentIndex];

  return (
<section className="w-full bg-[url('/images/testimonial_bg.svg')] bg-no-repeat bg-cover bg-center py-20 flex flex-col items-center text-center px-4">
  <h2 className="text-[40px] font-semibold text-[#1A1A1A]">
    What Our Students Say
  </h2>
  <p className="text-[24px] text-gray-600 mt-2">
    Don't just take our word for it – hear from thousands of <br className="hidden sm:block" />
    satisfied students
  </p>

  {/* Avatar Row */}
  <div className="flex items-center gap-6 mt-10">

    {/* Left Button */}
    <button
      onClick={prevTestimonial}
      className="rounded-full shadow bg-white w-10 h-10 flex items-center justify-center"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    {/* FIXED center avatars box */}
    <div className="relative w-[260px] h-20 flex items-center justify-center">

      {testimonials.map((t, i) => {
        // circular wrapping
        const leftIndex =
          (currentIndex - 1 + testimonials.length) % testimonials.length;
        const rightIndex =
          (currentIndex + 1) % testimonials.length;

        let positionClass = "opacity-0 pointer-events-none"; // default hidden

        if (i === currentIndex) {
          // Center avatar
          positionClass =
            "w-20 h-20 scale-110 z-20 left-1/2 -translate-x-1/2 opacity-100";
        } else if (i === leftIndex) {
          // Left avatar
          positionClass =
            "w-16 h-16 scale-90 opacity-70 z-10 absolute left-0";
        } else if (i === rightIndex) {
          // Right avatar
          positionClass =
            "w-16 h-16 scale-90 opacity-70 z-10 absolute right-0";
        }

        return (
          <img
            key={i}
            src={t.image}
            alt={t.name}
            onClick={() => setCurrentIndex(i)}
            className={`absolute rounded-full object-cover border-2 border-white shadow-md cursor-pointer  ${positionClass}`}
          />
        );
      })}
    </div>

    {/* Right Button */}
    <button
      onClick={nextTestimonial}
      className="rounded-full shadow bg-white w-10 h-10 flex items-center justify-center"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>

  {/* Name + Role */}
  <div className="mt-6">
    <h3 className="text-[26px] font-semibold text-[#1A1A1A]">{current.name}</h3>
    <p className="text-[16px] text-gray-500 -mt-1 mb-4">{current.role}</p>

    <div className="flex justify-center gap-1 mt-2">
      {Array.from({ length: current.rating }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">★</span>
      ))}
    </div>
  </div>

  {/* Text */}
  <div className="mt-6 max-w-2xl">
    <p className="text-[#696969] italic text-[20px]">
      "{current.text}"
    </p>
  </div>
</section>


  );
}
