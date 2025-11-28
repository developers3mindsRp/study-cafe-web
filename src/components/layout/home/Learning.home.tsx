import React from "react";

const Learning = () => {
  return (
    <section
      className="relative w-full h-[350px] md:h-[295px] flex items-center justify-center
                 bg-[url('/images/bg.svg')] bg-cover bg-center bg-no-repeat container mx-auto px-4 mt-8"
    >


      {/* Center Content */}
      <div className="relative z-10 text-center ">
        <h2 className="text-white text-4xl font-bold mb-4">
          Ready to Start Learning?
        </h2>

        <p className="text-white text-[24px] font-normal max-w-xl mx-auto mb-6">
        Join thousands of students already learning on StudyCafe
        </p>

        <button className="bg-white text-[#09339B] px-6 py-3 rounded-lg hover:bg-[#09339B] hover:text-white transition">
          Get Started Today
        </button>
      </div>
    </section>
  );
};

export default Learning;
