import { PublicLayout } from '@/components/layout';
import PaymentDetail from '@/components/PaymentDetail';
import Breadcrumbs from '@/components/Breadcrumb';
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
      <PaymentDetail />
        </RequireVerifiedEmail>
      </RequireAuth>
    </PublicLayout>
  );
}
