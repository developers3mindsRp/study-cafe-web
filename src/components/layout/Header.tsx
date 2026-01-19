'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';

/**
 * Header Component - with Courses dropdown (desktop + mobile)
 */

export default function Header() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Dropdown state for desktop
  const [coursesMenuOpen, setCoursesMenuOpen] = useState(false);
  // Collapsible state for mobile
  const [coursesMobileOpen, setCoursesMobileOpen] = useState(false);

  const coursesRef = useRef<any>(null);
  const userRef = useRef<any>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (coursesRef.current && !coursesRef.current.contains(e.target)) {
        setCoursesMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
   <div className="flex items-center justify-between w-full">

  {/* Logo (left) */}
  <Link href="/" className="flex items-center gap-2">
    <div className="w-[221px] h-[62px] flex items-center justify-center">
      <img src="/images/studycafe_logo.svg" alt="StudyCafe" />
    </div>
  </Link>

  {/* Right Side - Navigation + Auth */}
  <div className="hidden md:flex items-center gap-8">

    {/* Navigation Links */}
    <Link
      href="/"
      className={` transition-colors text-[16px] ${
        router.pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
      }`}
    >
      Home
    </Link>

    {/* Courses dropdown */}
    <div
      ref={coursesRef}
      className="relative"
      onMouseEnter={() => setCoursesMenuOpen(true)}
      onMouseLeave={() => setCoursesMenuOpen(false)}
    >
      <button
        onClick={() => setCoursesMenuOpen((s) => !s)}
        aria-expanded={coursesMenuOpen}
        className={`flex items-center gap-1 text-[16px] transition-colors ${
          router.pathname.startsWith("/course")
            ? "text-blue-600 font-semibold"
            : "text-gray-700 hover:text-blue-600"
        }`}
      >
        Courses
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${coursesMenuOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {coursesMenuOpen && (
        <div className="absolute left-0 top-2 mt-2 pt-5">
          <div className="w-56 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-100">
            <Link href="/courses_list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Excel Courses</Link>
            <Link href="/courses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">AI Tools Courses</Link>
            <Link href="/courses/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">GST Courses</Link>
            <Link href="/memberships" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Income Tax Courses</Link>
          </div>
        </div>
      )}
    </div>

    <Link href="/membership"   className={`text-[16px] transition-colors ${
    router.pathname === "/membership"
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600"}`}> Memberships</Link>
{/* 
    <Link href="/download"   className={`text-[16px] transition-colors ${
    router.pathname === "/download"
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600"}`}> Downloads</Link> */}

    <Link href="/blogs"   className={`text-[16px] transition-colors ${
    router.pathname === "/blogs"
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600"}`}>Blogs</Link>

    <Link href="/contact-us"   className={`text-[16px] transition-colors ${
    router.pathname === "/contact-us"
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600"}`}>Contact Us</Link>

    {/* <Link href="/notify" className="text-gray-700 hover:text-blue-600 transition-colors"><img src="/images/notify.png" alt="" /></Link> */}

    {/* Auth Buttons / User Menu */}
    {user ? (
      <div className="relative" ref={userRef}>
        {/* …Your user dropdown code here */}
      </div>
    ) : (
      <Link
        href="/register"
        className="bg-[#09339B] text-white px-6 py-2 rounded-lg hover:bg-[#09339B] transition-colors font-medium"
      >
       Login
      </Link>
    )}
  </div>

  {/* Mobile Menu Button */}
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {mobileMenuOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  </button>
</div>


        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>

              {/* Courses - mobile collapsible */}
              <div>
                <button
                  onClick={() => setCoursesMobileOpen((s) => !s)}
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-blue-600 font-medium"
                  aria-expanded={coursesMobileOpen}
                >
                  <span>Courses</span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${coursesMobileOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {coursesMobileOpen && (
                  <div className="mt-2 pl-4 flex flex-col gap-1">
                    <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                      All Courses
                    </Link>
                    <Link href="/courses/featured" className="text-gray-700 hover:text-blue-600 font-medium">
                      Featured
                    </Link>
                    <Link href="/courses/categories" className="text-gray-700 hover:text-blue-600 font-medium">
                      Categories
                    </Link>
                    <Link href="/membership" className="text-gray-700 hover:text-blue-600 font-medium">
                      Memberships & Pricing
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/membership" className="text-gray-700 hover:text-blue-600 font-medium">
                Memberships
              </Link>
              <Link href="/blogs" className="text-gray-700 hover:text-blue-600 font-medium">
                Blogs
              </Link>
              <Link href="/contact-us" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact Us
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-2">
                {user ? (
                  <>
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/courses" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                      My Courses
                    </Link>
                    <Link href="/dashboard/profile" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-red-600 hover:text-red-700 font-medium w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/register"
                    className="block mt-2 bg-[#09339B] text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-center font-medium"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
