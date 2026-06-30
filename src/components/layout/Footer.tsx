// components/Footer.jsx
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import Link from 'next/link';
import { subscribeNewsletter } from '@/services/platform.service';
import type { ApiError } from '@/types/api.types';

type FooterProps = {
  footerData: any;
};

export default function Footer({ footerData }: FooterProps) {

  // console.log(footerData,"footerData")

  const [usefulOpen, setUsefulOpen] = useState(false);
  const [importantOpen, setImportantOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null);
  const socialLinks = footerData?.social_links  ? JSON.parse(footerData.social_links) : {};  
  const appLinks = footerData?.app_links  ? JSON.parse(footerData.app_links) : {};
  const importantLinks = footerData?.important_links  ? JSON.parse(footerData.important_links) : [];
  const column1 = importantLinks.filter((item: any) => item.column === 1);
  const column2 = importantLinks.filter((item: any) => item.column === 2);

  // Optional: refs if you want to manage dynamic height — simpler version uses a fixed max-height
  const usefulRef = useRef<HTMLUListElement>(null);
  const importantRef1 = useRef<HTMLUListElement>(null);
  const importantRef2 = useRef<HTMLUListElement>(null);

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
    [importantRef1, importantRef2].forEach((ref) => {
      if (ref.current) {
        if (importantOpen) {
          ref.current.style.maxHeight = ref.current.scrollHeight + 'px';
        } else {
          ref.current.style.maxHeight = '0px';
        }
      }
    });
  }, [importantOpen]);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newsletterStatus === 'loading') return;
    setNewsletterMessage(null);
    if (!newsletterEmail.trim()) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter your email address.');
      return;
    }
    setNewsletterStatus('loading');
    try {
      const result = await subscribeNewsletter(newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterMessage(
        result.already_subscribed
          ? "You're already on the list. Thanks for your interest."
          : "Thanks! You're subscribed to our newsletter."
      );
      setNewsletterEmail('');
    } catch (err) {
      const apiErr = err as ApiError;
      setNewsletterStatus('error');
      setNewsletterMessage(
        typeof apiErr?.message === 'string' ? apiErr.message : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <footer className="bg-[#252525] text-gray-300 " id='footer'>
      <div className="container mx-auto px-4 py-10 md:mt-10">
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
            <p className="text-[16px] md:text-[16px] text-white mb-8 md:mb-4 font-normal px-12 md:px-0">
             {footerData?.tagline}
            </p>
            <div className="flex gap-4">
                {socialLinks?.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/x.svg" alt="Twitter" />
                  </a>
                )}

                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/insta.svg" alt="Instagram" />
                  </a>
                )}

                {socialLinks?.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/linkedin.svg" alt="LinkedIn" />
                  </a>
                )}

                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/fb.svg" alt="Facebook" />
                  </a>
                )}

                {socialLinks?.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/yt.svg" alt="YouTube" />
                  </a>
                )}

                {socialLinks?.telegram && (
                  <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <img src="/images/icons/telegram.svg" alt="Telegram" />
                  </a>
                )}
              </div>
            
            <div className="mt-6 hidden  md:flex gap-2">
              
                
                {appLinks?.googlePlay && (
                  <a href={appLinks.googlePlay} target="_blank" rel="noopener noreferrer" >
                    <img src="/images/google-play.svg" alt="Download on Google Play" width="130" height="40" />
                  </a>
                )}
              
               
                {appLinks?.appStore && (
                  <a href={appLinks.appStore} target="_blank" rel="noopener noreferrer" >
                       <img src="/images/app-store.svg" alt="Download on app store" width="130" height="40" />
                  </a>
                )}
              
             
           
            </div>
          </div>

          {/* Courses Column / Useful Links */}
          <div className="col-span-1">
            <h3 className="text-white font-normal mb-4 text-[24px] ml-0 md:ml-24 flex justify-between items-center md:block">
              Useful Links
              <button
                className="md:hidden text-white xl:text-[24px] focus:outline-none"
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
              <li><Link href="/about-us" className="text-[16px] text-white transition-colors">About US</Link></li>
              <li><Link href="/privacy-policy" className="text-[16px] text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/ethics-policy" className="text-[16px] text-white transition-colors">Ethics Policy</Link></li>
              <li><Link href="/terms-of-use" className="text-[16px] text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="text-[16px] text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/refund-policy" className="text-[16px] text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          <hr className='block md:hidden' />

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

              {/* Column 1 */}
              <div>
                <ul
                  ref={importantRef1}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible"
                  style={{ maxHeight: '0px' }}
                >
                  {column1.map((item: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={item.url}
                        className="text-[16px] text-white transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <ul
                  ref={importantRef2}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible mt-4 md:mt-0"
                  style={{ maxHeight: '0px' }}
                >
                  {column2.map((item: any, index: number) => (
                    <li key={index}>
                      <Link
                        href={item.url}
                        className="text-[16px] text-white transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
            {/* <div className='md:flex md:gap-12'>
              <div>
                <ul
                  id="important-links-list"
                  ref={importantRef1}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible"
                  style={{ maxHeight: '0px' }}
                >

                  <li><Link href="/courses" className="text-[16px] text-white transition-colors">All Courses</Link></li>
                  <li><Link href="/careers" className="text-[16px] text-white transition-colors">GST Courses</Link></li>
                  <li><Link href="/blog" className="text-[16px] text-white transition-colors">Income Tax Courses</Link></li>
                  <li><Link href="/contact" className="text-[16px] text-white transition-colors"> ChatGPT & AI</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Excel Courses</Link></li>
                </ul>
              </div>

              <div>
                <ul
                  id="important-links-list"
                  ref={importantRef2}
                  className="space-y-4 overflow-hidden transition-[max-height] duration-300 ease-in-out md:max-h-full md:overflow-visible mt-4 md:mt-0"
                  style={{ maxHeight: '0px' }}
                >
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Submit Article</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Finance</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">GST</Link></li>
                  <li><Link href="/faq" className="text-[16px] text-white transition-colors">Income Tax</Link></li>
                  <li><Link href="/downloads" className="text-[16px] text-white transition-colors">Downloads</Link></li>
                  <li><Link href="/contact" className="text-[16px] text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
            </div> */}
          </div>



          {/* Support / Newsletter Column */}
          <div className="col-span-1 text-center sm:text-left flex flex-col items-center sm:items-start mb-8">
            <h3 className="text-white font-normal mb-4 text-[24px]">Newsletter</h3>
            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-sm">
              <p className="text-[16px] text-white mb-2 px-16 md:px-0 text-center sm:text-left">
                Subscribe to get updates on new courses and offers.
              </p>
              <div className="relative">
                <img
                  src="/images/email1.png"
                  alt=""
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
                  aria-hidden
                />
                <label htmlFor="footer-email" className="sr-only">
                  Email for newsletter
                </label>
                <input
                  id="footer-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    if (newsletterStatus === 'error' || newsletterStatus === 'success') {
                      setNewsletterStatus('idle');
                      setNewsletterMessage(null);
                    }
                  }}
                  disabled={newsletterStatus === 'loading'}
                  className="p-3 pl-12 w-full text-black rounded-[10px] bg-white mt-1 mb-2 disabled:opacity-60"
                  placeholder="Email"
                />
              </div>
              {newsletterMessage && (
                <p
                  className={
                    newsletterStatus === 'error'
                      ? 'text-[red] text-sm mb-2 text-left'
                      : 'text-green-300 text-sm mb-2 text-left'
                  }
                  role="status"
                >
                  {newsletterMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="
                    whitespace-nowrap                  
                    text-[18px] sm:text-[18px] mt-2
                    px-4 py-2 sm:px-2 sm:py-3
                    bg-[#09339B] hover:bg-white text-white hover:text-[#09339B]
                    rounded-[10px] transition
                    disabled:opacity-60 disabled:cursor-not-allowed
                  "
              >
                {newsletterStatus === 'loading' ? 'Subscribing…' : 'Subscribe Now'}
              </button>
            </form>
          </div>

        </div>

        <div className='border-b md:mt-16  xl:mt-12 h-px '></div>

        {/* Bottom Bar */}
        <div className=" mt-6 text-center ">
          <p className="text-[12px] md:text-[18px] text-white">
           {footerData?.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
