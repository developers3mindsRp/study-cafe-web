import Head from 'next/head';
import QuickSignupPage from '@/components/layout/QuickSignup';

/**
 * Checkout signup — the short form used when a course or membership link sends
 * a new buyer to create an account. /register keeps the full profile form.
 */
export default function Signup() {
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <QuickSignupPage />
    </>
  );
}
