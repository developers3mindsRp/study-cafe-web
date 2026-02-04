import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import 'react-phone-number-input/style.css';

export default function ContactPage() {
  const [phone, setPhone] = useState<string | undefined>(undefined)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container px-4 mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[48px] md:text-[62px] font-bold text-[#09339B]">
            Get in Touch
          </h1>
          <p className="text-gray-600 mt-3 text-[18px] md:text-[26px]">
            Have questions? We'd love to hear from you. Send us a message and <br className="hidden md:block" />
            we'll respond as soon as possible.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#9FBBFF]">
            <h2 className="text-xl font-semibold mb-6">
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

                    <div className="flex-1">
                    <label className="text-sm font-medium">Mobile Number<span className="text-red-600">*</span></label>
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

          {/* Right Info Panel */}
          <div className="space-y-6">
            
            {/* Contact Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#9FBBFF] ">
              <h3 className="text-[26px] font-normal text-[#252525] mb-4">
                Contact Information
              </h3>

              <div className="space-y-12 text-sm text-gray-600">
              <div className="flex gap-2 items-center ">
                <div><img src="/images/email.png" alt="" className="w-12 h-12"/></div>
                <div>
                  <h2 className="text-[20px] text-[#252525]">Email</h2>
                  <p className="text-[16px]">contact@studycafe.in</p>
                </div>
              </div>
        
              <div className="flex gap-2 ">
                <div><img src="/images/phone1.png" alt="" width={45} height={45}/></div>
                <div>
                  <h2 className="text-[20px] text-[#252525]">Phone</h2>
                  <p className="text-[16px]">+91 9625080264</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <div><img src="/images/map.png" alt="" className="w-18 h-18"/></div>
                <div>
                  <h2 className="text-[20px] text-[#252525]">Office</h2>
                  <p className="text-[16px]">1003, 10th Floor, Madi Tower 98, Nehruplace,
                  Delhi, 110019 - India</p>
                </div>
              </div>
        
      
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#9FBBFF]">
              <h3 className="text-[26px] font-normal text-[#252525] mb-2">
                Help and Support
              </h3>
              <p className="text-[16px] text-[#454545]">
                Monday to Saturday
                10:00 AM to 06:00 PM
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#9FBBFF]">
              <h3 className="text-[26px] font-normal text-[#252525] mb-2">
                Follow Us
              </h3>
              <p className="text-[#454545] text-[16px] mb-4">Stay connected for the latest updates, tips, <br /> and educational content.</p>
              <div className="flex gap-8">
              <a href=""><img src="/images/in-b.png" alt="" /></a>
              <a href=""><img src="/images/x-b.png" alt="" /></a>
              <a href=""><img src="/images/insta-b.png" alt="" /></a>
              <a href=""><img src="/images/fb-b.png" alt="" /></a>
              <a href=""><img src="/images/telegram-b.png" alt="" /></a>
              <a href=""><img src="/images/yt-b.png" alt="" /></a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
