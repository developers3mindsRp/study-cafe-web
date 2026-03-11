import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

export default function ContactPage() {
  const [phone, setPhone] = useState<string | undefined>(undefined)
  return (
    <div className=" bg-gray-50 flex ">

      {/* Left branding panel */}
      <div className="hidden md:flex w-1/2 bg-[url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat text-white p-8 flex-col justify-center max-h-[650px] mt-4">

        <div className="relative border md:w-[548px] h-auto md:h-[280px] rounded-[35px] text-center mx-auto overflow-hidden">

          <div className="absolute inset-0 bg-white/30 blur-xxl"></div>

          <div className="relative z-10">
            <img
              src="/images/study-logo.svg"
              alt=""
              width="221"
              height="250"
              className="mx-auto mt-[11px]"
            />

            <h1 className="text-[30px] md:text-4xl font-bold mb-4 pt-[12px] md:pb-[18px]">
              Get in Touch
            </h1>

            <p className="text-[18px] md:text-[24px] pb-2">
              Have questions? We'd love to hear from you. <br />
              Send us a message and we'll respond as soon <br />
              as possible.
            </p>
          </div>

        </div>
      </div>


      {/* Right Contact Form */}
      <div className="w-full md:w-1/2 flex justify-center p-8">

        <div className="w-full  p-4 rounded-xl shadow-sm">

          <h2 className="text-[26px] font-normal mb-6">
            Send us a Message
          </h2>

          <form className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Mobile Number <span className="text-red-600">*</span>
              </label>

              <PhoneInput
                placeholder="+91 9876543210"
                value={phone}
                onChange={setPhone}
                defaultCountry="IN"
                international
                limitMaxLength={true}
                className="w-full border px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help you"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Tell us more about your inquiry..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#09339B] text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Send
            </button>

          </form>
        </div>

      </div>

    </div>

  );
}
