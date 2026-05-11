import { ReactNode, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import { setReferralCode } from '@/utils/auth.utils';
import { getFooterContent } from "@/services/platform.service";
import FirstVisitSiteAd from "@/components/ads/FirstVisitSiteAd";

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  const router = useRouter();
  const [footerData, setFooterData] = useState<any>(null);

  useEffect(() => {
    const ref = router.query.ref;
    if (typeof ref === 'string' && ref.trim()) {
      setReferralCode(ref);
    }
  }, [router.query.ref]);

  // ✅ Fetch footer directly here
  useEffect(() => {
    const fetchFooter = async () => {
      const data = await getFooterContent();
      setFooterData(data);
    };

    fetchFooter();
  }, [footerData]);
    const memoFooterData = useMemo(() => footerData, [footerData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <FirstVisitSiteAd />

      {showFooter && <Footer footerData={memoFooterData} />}
    </div>
  );
}