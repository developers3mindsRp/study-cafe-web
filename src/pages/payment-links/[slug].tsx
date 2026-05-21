import type { GetServerSideProps } from "next";
import Head from "next/head";
import axios from "axios";
import { PublicLayout } from "@/components/layout";
import PaymentLinkCheckout from "@/components/layout/payment-links/PaymentLinkCheckout";
import type { PublicPaymentLink } from "@/services/paymentLink.service";
import { getServerSideApiBaseUrl } from "@/lib/apiBase";
import { formatPaymentLinkExpiry } from "@/utils/paymentLinkExpiry";

type Props = {
  link: PublicPaymentLink;
  /** Computed on the server so SSR and hydration agree on expiry state */
  initialExpired: boolean;
  /** IST wall-clock string for expired UI, e.g. 2026-04-30 15:30:00 */
  expiryDisplayLabel: string | null;
};

export default function PaymentLinkPage({ link, initialExpired, expiryDisplayLabel }: Props) {
  const titleBase = String(link.title ?? "Payment").replace(/[\r\n]+/g, " ").trim();
  return (
    <>
      <Head>
        <title>{initialExpired ? `Expired — ${titleBase} | Studycafe` : `${titleBase} | Studycafe`}</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <PublicLayout>
        <PaymentLinkCheckout
          link={link}
          initialExpired={initialExpired}
          expiryDisplayLabel={expiryDisplayLabel}
        />
      </PublicLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug;
  if (!slug || typeof slug !== "string") return { notFound: true };

  const apiBase = getServerSideApiBaseUrl(ctx.req).replace(/\/$/, "");

  try {
    const res = await axios.get(`${apiBase}/platform/payment-links/${encodeURIComponent(slug)}`, {
      timeout: 15000,
      validateStatus: (s) => s === 200,
    });
    const link = (res.data?.data ?? res.data) as PublicPaymentLink | undefined;
    if (!link?.id) return { notFound: true };

    const expiryMs = link.expires_at ? new Date(link.expires_at).getTime() : NaN;
    const initialExpired = Number.isFinite(expiryMs) && expiryMs <= Date.now();
    const expiryDisplayLabel =
      link.expires_at && Number.isFinite(expiryMs) ? formatPaymentLinkExpiry(link.expires_at) : null;

    return {
      props: { link, initialExpired, expiryDisplayLabel },
    };
  } catch {
    return { notFound: true };
  }
};
