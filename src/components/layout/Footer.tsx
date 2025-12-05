import Link from 'next/link';

/**
 * Footer Component
 * Used in public pages (CMS layout)
 */

export default function Footer() {
  return (
    <footer className="bg-[#252525] text-gray-300">
      <div className="container mx-auto px-4 py-10 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1">
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
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
           <img src="/images/twitter.png" alt="" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
           <img src="/images/insta.png" alt="" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
           <img src="/images/in.png" alt="" />
              </a>
              <a 
                href="https://fb.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
           <img src="/images/fb.png" alt="" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
           <img src="/images/youtube.png" alt="" />
              </a>
              <a 
                href="https://telegram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
           <img src="/images/telegram.png" alt="" />
              </a>
            </div>
          <div className='mt-6'>
              <img src="/images/google_play.png" alt="" width="159px" height="90px"/>
          </div>
          </div>

          {/* Courses Column */}
          <div>
            <h3 className="text-white font-normal mb-4 text-[24px] ml-0 md:ml-24">Useful Links</h3>
            <ul className="space-y-4 ml-0 md:ml-24">
              <li>
                <Link href="/?category=web-development" className="text-[16px] text-white transition-colors">
                 About US
                </Link>
              </li>
              <li>
                <Link href="/?category=data-science" className="text-[16px] text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/?category=design" className="text-[16px] text-white transition-colors">
                  Ethics Policy
                </Link>
              </li>
              <li>
                <Link href="/?category=business" className="text-[16px] text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/?category=marketing" className="text-[16px] text-white transition-colors">
                 Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/?category=marketing" className="text-[16px] text-white transition-colors">
                 Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-normal mb-4 text-[24px]">Important Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-[16px] text-white transition-colors">
                 All Courses
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-[16px] text-white transition-colors">
                 GST Courses
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[16px] text-white transition-colors">
                  Income Tax Courses
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[16px] text-white transition-colors">
                  ChatGPT & AI
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[16px] text-white transition-colors">
                  Excel Courses
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[16px] text-white transition-colors">
                 Downloads
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-white font-normal mb-4 text-[24px]">Newsletter</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-[16px] text-white transition-colors">
                  Subscribe to get updates on new courses and offers.
                </Link>
              </li>
              <li>
                <label htmlFor="">Email</label> <br />
                <input type="text" className='p-3 w-full rounded-[10px] bg-white mt-2 mb-3' placeholder='Email'/>
              </li>
              <button className='p-2 rounded-[10px] w-1/2 bg-[#09339B] hover:bg-white text-white hover:text-[#09339B] text-[20px]'>Subcribe Now</button>
              
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white mt-8 pt-8 text-center ">
          <p className="text-[18px] text-white">
           Copyright © 2025  Studycafe Private Limited. All Rights Reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}

