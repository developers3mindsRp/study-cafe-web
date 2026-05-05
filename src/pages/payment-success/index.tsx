import { PublicLayout } from '@/components/layout';
import PaymentSuccess from '@/components/layout/course/payment/PaymentSuccess';
import RequireAuth from '@/components/auth/RequireAuth';
import RequireVerifiedEmail from '@/components/auth/RequireVerifiedEmail';

export default function PaymentSuccessPage() {
  return (
    <PublicLayout>
      <RequireAuth>
        <RequireVerifiedEmail>
          <PaymentSuccess />
        </RequireVerifiedEmail>
      </RequireAuth>
    </PublicLayout>
  );
}
