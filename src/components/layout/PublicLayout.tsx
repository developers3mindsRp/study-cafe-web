import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { setReferralCode } from '@/utils/auth.utils';

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const ref = router.query.ref;
    if (typeof ref === 'string' && ref.trim()) {
      setReferralCode(ref.trim());
    }
  }, [router.query.ref]);

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

