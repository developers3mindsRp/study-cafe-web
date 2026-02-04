import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

import FeaturedCourses from './home/Feature.home';
import MembershipPricing from './home/Member.home';
import StatsSection from './home/StaticSection.home';
import Breadcrumb from '@/Breadcrumb';

/**
 * Public Layout (CMS Layout)
 * Used for public-facing pages: home, courses, about, etc.
 */

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
    

      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}

