import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Buyers who created their account mid-purchase come back with `?resume=1`.
 *
 * This brings the checkout panel back into view and flags it — deliberately
 * without reopening Razorpay for them: an automatic order would skip the coupon
 * box and record an order the buyer never confirmed.
 */
export function useResumeAfterSignup<T extends HTMLElement = HTMLDivElement>() {
  const router = useRouter();
  const ref = useRef<T>(null);
  const [resumed, setResumed] = useState(false);

  useEffect(() => {
    if (!router.isReady || router.query.resume !== '1') return;

    setResumed(true);
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Drop the flag so a refresh — or a shared URL — does not repeat the prompt.
    const { resume, ...restQuery } = router.query;
    void router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  return { ref, resumed };
}
