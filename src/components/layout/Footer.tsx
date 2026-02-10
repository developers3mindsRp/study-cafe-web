// components/Footer.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [usefulOpen, setUsefulOpen] = useState(false);
  const [importantOpen, setImportantOpen] = useState(false);

  // Optional: refs if you want to manage dynamic height — simpler version uses a fixed max-height
  const usefulRef = useRef<HTMLUListElement>(null);
  const importantRef = useRef<HTMLUListElement>(null);

  // Example: update max-height based on content, to avoid clipping (if needed)
  useEffect(() => {
    if (usefulRef.current) {
      if (usefulOpen) {
        usefulRef.current.style.maxHeight = usefulRef.current.scrollHeight + 'px';
      } else {
        usefulRef.current.style.maxHeight = '0px';
      }
    }
  }, [usefulOpen]);

  useEffect(() => {
    if (importantRef.current) {
      if (importantOpen) {
        importantRef.current.style.maxHeight = importantRef.current.scrollHeight + 'px';
      } else {
        importantRef.current.style.maxHeight = '0px';
      }
    }
  }, [importantOpen]);

  return (
    <footer className="bg-[#252525] text-gray-300 " id='footer'>
      <div className="container mx-auto px-4 py-10 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">

          {/* Brand Column */}
          <div className="col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-[221px] h-[62px] flex items-center justify-center">
                  <img src="/images/footer_logo.svg" alt="StudyCafe" />
                </div>
              </Link>
            </div>
            <p className="text-[16px] text-white mb-4 font-normal">
              Empowering learners with quality education and professional courses.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center  transition-colors">
                <img src="/images/twitter.png" alt="Twitter" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center  transition-colors">
                <img src="/images/insta.png" alt="Instagram" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center  transition-colors">
                <img src="/images/in.png" alt="LinkedIn" />
              </a>
              <a href="https://fb.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center  transition-colors">
                <img src="/images/fb.png" alt="Facebook" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center transition-colors">
                <img src="/images/youtube.png" alt="YouTube" />
              </a>
              <a href="https://telegram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center  transition-colors">
                <img src="/images/telegram.png" alt="Telegram" />
              </a>
            </div>
            <div className="mt-6 hidden  md:flex gap-2">
              <img src="/images/google-play.png" alt="Download on Google Play" width="130" height="40" />
              <img src="/images/app-store.png" alt="Download on app store" width="130" height="40" />
            </div>
          </div>

          {/* Courses Column / Useful Links */}
          <div className="col-span-1">
            <h3 className="text-white font-normal mb-4 text-[24px] ml-0 md:ml-24 flex justify-between items-center md:block">
              Useful Links
              <button
                className="md:hidden text-white text-[24px] focus:outline-none"
                aria-expanded={usefulOpen}
                aria-controls="useful-links-list"
                onClick={() => setUsefulOpen(prev => !prev)}
              >
                {usefulOpen ? '−' : '+'}
              </button>
            </h3>
            <ul
              id="useful-links-list"
              ref={usefulRef}
              className="ml-0 md:ml-24 space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible"
              style={{ maxHeight: '0px' /* collapsed by default */ }}
            >
              <li><Link href="/?category=web-development" className="text-[16px] text-white transition-colors">About US</Link></li>
              <li><Link href="/?category=data-science" className="text-[16px] text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/?category=design" className="text-[16px] text-white transition-colors">Ethics Policy</Link></li>
              <li><Link href="/?category=business" className="text-[16px] text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/?category=marketing" className="text-[16px] text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/?category=marketing" className="text-[16px] text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Company Column / Important Links */}
          <div className="col-span-1 md:relative right-6">
            <h3 className="text-white font-normal mb-4 text-[24px] flex justify-between items-center md:block">
              Important Links
              <button
                className="md:hidden text-white text-[24px] focus:outline-none"
                aria-expanded={importantOpen}
                aria-controls="important-links-list"
                onClick={() => setImportantOpen(prev => !prev)}
              >
                {importantOpen ? '−' : '+'}
              </button>
            </h3>
            <div className='md:flex md:gap-12'>
              <div>
                <ul
                  id="important-links-list"
                  ref={importantRef}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible"
                  style={{ maxHeight: '0px' }}
                >

                  <li><Link href="/about" className="text-[16px] text-white transition-colors">All Courses</Link></li>
                  <li><Link href="/careers" className="text-[16px] text-white transition-colors">GST Courses</Link></li>
                  <li><Link href="/blog" className="text-[16px] text-white transition-colors">Income Tax Courses</Link></li>
                  <li><Link href="/contact" className="text-[16px] text-white transition-colors"> AI Courses</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Excel Courses</Link></li>
                </ul>
              </div>

              <div>
                <ul
                  id="important-links-list"
                  ref={importantRef}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible"
                  style={{ maxHeight: '0px' }}
                >
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Submit Article</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Finance</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">GST</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Income Tax</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Downloads</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </div>



          {/* Support / Newsletter Column */}
          <div className="col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start mb-8">
            <h3 className="text-white font-normal mb-4 text-[24px]">Newsletter</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-[16px] text-white transition-colors">
                  Subscribe to get updates on new courses and offers.
                </Link>
              </li>
            <li className="relative">
              <img
                src="/images/email1.png"
                alt="email"
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
              />

              <input
                id="footer-email"
                type="email"
                className="p-3 pl-12 w-full text-black rounded-[10px] bg-white mt-3 mb-3"
                placeholder="Email"
              />
            </li>

              <button className="
                    whitespace-nowrap
                    w-100%
                    text-[18px] sm:text-[20px]
                    px-4 py-2 sm:px-6 sm:py-3
                    bg-[#09339B] hover:bg-white text-white hover:text-[#09339B]
                    rounded-[10px] transition
                  ">
                Subscribe Now
              </button>

            </ul>
          </div>

        </div>

        <div className='border-b  mt-12 h-px '></div>

        {/* Bottom Bar */}
        <div className=" mt-6 text-center ">
          <p className="text-[18px] text-white">
            Copyright © 2026 StudyCafe Private Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
