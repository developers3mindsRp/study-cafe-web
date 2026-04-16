import { PublicLayout } from '@/components/layout';
import PaymentDetail from '@/components/PaymentDetail';
import Breadcrumbs from '@/components/Breadcrumb';

export default function PaymentDetailPage() {
  return (
    <PublicLayout>
      <div className="text-sm text-[#696969] bg-[#DDDDDD] p-4 mx-auto">
        <Breadcrumbs />
      </div>
      <PaymentDetail />
    </PublicLayout>
  );
}
