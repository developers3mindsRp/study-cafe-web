import { PublicLayout } from '@/components/layout';
import PaymentDetail from '@/components/PaymentDetail';
import Breadcrumbs from '@/components/Breadcrumb';
import CompleteProfileCard from '@/components/account/CompleteProfileCard';
import RequireAuth from '@/components/auth/RequireAuth';
import RequireVerifiedEmail from '@/components/auth/RequireVerifiedEmail';

export default function PaymentDetailPage() {
  return (
    <PublicLayout>
      <RequireAuth>
        <RequireVerifiedEmail>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>
      {/* Checkout signups skip profession/state/city — ask for them here, after the purchase. */}
      <CompleteProfileCard />
      <PaymentDetail />
        </RequireVerifiedEmail>
      </RequireAuth>
    </PublicLayout>
  );
}
