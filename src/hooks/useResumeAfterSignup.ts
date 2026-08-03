import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Buyers who created their account mid-purchase come back with `?resume=1`.
 *
 * This brings the checkout panel back into view and flags it — deliberately
 * without reopening Razorpay for them: an automatic order would skip the coupon
 * box and record an order the buyer never confirmed.
 *
 * The panel usually mounts a beat after the page does, while its price data
 * loads, so the returned `ref` is a callback ref: the scroll runs when the node
 * actually attaches rather than at the moment the flag is read.
 */
export function useResumeAfterSignup<T extends HTMLElement = HTMLDivElement>() {
  const router = useRouter();
  const [node, setNode] = useState<T | null>(null);
  const [resumed, setResumed] = useState(false);

  const ref = useCallback((element: T | null) => setNode(element), []);

  useEffect(() => {
    if (!router.isReady || router.query.resume !== '1') return;

    setResumed(true);

    // Drop the flag so a refresh — or a shared URL — does not repeat the prompt.
    const { resume, ...restQuery } = router.query;
    void router.replace({ pathname: router.pathname, query: restQuery }, undefined, {
      shallow: true,
    });
  }, [router]);

  useEffect(() => {
    if (!resumed || !node) return;
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [resumed, node]);

  return { ref, resumed };
}
