import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { PublicLayout } from "@/components/layout";
import CertificateArtwork from "@/components/ui/CertificateArtwork";
import CertificateLayout from "@/components/ui/CertificateLayout";
import CertificateClaimForm from "@/components/certificate/CertificateClaimForm";
import CertificateRetrieveForm from "@/components/certificate/CertificateRetrieveForm";
import { useCertificateDownload } from "@/hooks/useCertificateDownload";
import { runWithServerApiBase } from "@/lib/serverApiContext";
import {
  claimCertificate,
  getCertificateLink,
  retrieveCertificate,
  type CertificateClaimPayload,
  type ClaimedCertificate,
  type PublicCertificateLink,
} from "@/services/certificateLink.service";
import { CERTIFICATE_HEIGHT, CERTIFICATE_WIDTH } from "@/lib/certificateImage";

interface Props {
  link: PublicCertificateLink;
}

/**
 * Public certificate claim page.
 *
 * No login, no purchase, no course progress — the token in the URL is the only thing gating it.
 * States: the claim form, the email-only "get it again" form, and the issued certificate. A closed
 * link (expired / limit reached) shows only the "get it again" form — the claim email's button
 * lands here, often after the link has closed, and people must still reach the certificate they hold.
 */
export default function CertificateClaimPage({ link }: Props) {
  const [certificate, setCertificate] = useState<ClaimedCertificate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** On an open link, a returning visitor can switch to the email-only form. */
  const [wantsRetrieve, setWantsRetrieve] = useState(false);
  const { captureRef, download, isDownloading, error: downloadError } = useCertificateDownload();

  const isOpen = link.status === "active";
  const showRetrieve = !isOpen || wantsRetrieve;

  const switchForm = (retrieve: boolean) => {
    setWantsRetrieve(retrieve);
    setError(null);
  };

  const handleClaim = async (payload: CertificateClaimPayload) => {
    setSubmitting(true);
    setError(null);
    try {
      const issued = await claimCertificate(link.token, payload);
      setCertificate(issued);
    } catch (err) {
      const apiError = err as { message?: string; statusCode?: number };
      setError(
        apiError?.message ||
          "Something went wrong while generating your certificate. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetrieve = async (email: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const issued = await retrieveCertificate(link.token, email);
      setCertificate(issued);
    } catch (err) {
      const apiError = err as { message?: string; statusCode?: number };
      setError(
        apiError?.message || "Something went wrong while finding your certificate. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fileName = certificate
    ? `certificate-${(certificate.certificateNumber || "studycafe").toLowerCase()}.png`
    : "certificate.png";

  return (
    <PublicLayout>
      <Head>
        <title>{`${link.title} | Study Cafe`}</title>
        <meta
          name="description"
          content={
            link.description ||
            `Download your certificate for ${link.courseTitle || "this course"} from Study Cafe.`
          }
        />
        {/* A claim link is shared, not indexed — and the token should never end up in search. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={`${link.title} | Study Cafe`} />
        <meta
          property="og:description"
          content={link.description || "Download your Study Cafe certificate."}
        />
      </Head>

      <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
        <h1 className="text-center text-2xl font-semibold text-gray-900 md:text-3xl">{link.title}</h1>
        {link.courseTitle && (
          <p className="mt-2 text-center text-sm text-gray-500">{link.courseTitle}</p>
        )}
        {link.description && (
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-gray-600">{link.description}</p>
        )}

        {!isOpen && !certificate && (
          <div className="mx-auto mt-10 max-w-lg rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
            <h2 className="text-lg font-medium text-gray-900">
              {link.status === "full" ? "All certificates have been claimed" : "This link has closed"}
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              {link.status === "full"
                ? "Every certificate available through this link has already been issued."
                : "New certificates are no longer being issued through this link."}{" "}
              Already received yours? You can still download it below.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              If you believe you should have received one, contact us at{" "}
              <a className="text-[#09339B] underline" href="mailto:contact@studycafe.in">
                contact@studycafe.in
              </a>
              .
            </p>
          </div>
        )}

        {!certificate && (
          <div
            className={`mx-auto max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${
              isOpen ? "mt-10" : "mt-6"
            }`}
          >
            {showRetrieve ? (
              <>
                <h2 className="mb-1 text-lg font-medium text-gray-900">Download your certificate again</h2>
                <p className="mb-5 text-sm text-gray-500">
                  Enter the email you used and we will show the same certificate again.
                </p>
                <CertificateRetrieveForm
                  submitting={submitting}
                  errorMessage={error}
                  onSubmit={handleRetrieve}
                />
                {isOpen && (
                  <button
                    type="button"
                    onClick={() => switchForm(false)}
                    className="mt-4 w-full text-center text-sm text-[#09339B] underline"
                  >
                    Don&apos;t have a certificate yet? Get yours
                  </button>
                )}
              </>
            ) : (
              <>
                <h2 className="mb-1 text-lg font-medium text-gray-900">Get your certificate</h2>
                <p className="mb-5 text-sm text-gray-500">
                  Enter your details and your certificate will be generated straight away.
                </p>
                <CertificateClaimForm
                  renderedAt={link.rendered_at}
                  submitting={submitting}
                  errorMessage={error}
                  onSubmit={handleClaim}
                />
                <button
                  type="button"
                  onClick={() => switchForm(true)}
                  className="mt-4 w-full text-center text-sm text-[#09339B] underline"
                >
                  Already received your certificate? Get it again with just your email
                </button>
              </>
            )}
          </div>
        )}

        {certificate && (
          <div className="mt-10">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <CertificateLayout
                name={certificate.studentName}
                course={certificate.courseTitle}
                date={certificate.completionDate}
                serial={certificate.certificateNumber}
              />
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => void download(fileName)}
                disabled={isDownloading}
                className="rounded-lg bg-[#09339B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#072a80] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? "Preparing download…" : "Download certificate"}
              </button>
              {downloadError && <p className="text-xs text-red-600">{downloadError}</p>}
              <p className="text-center text-xs text-gray-500">
                Keep this page bookmarked — entering the same email here again returns the same
                certificate, even after this link closes.
              </p>
            </div>
          </div>
        )}
      </div>

      {/*
        Off-screen capture host at true size. Never hide this with display:none or visibility:hidden
        — a hidden subtree has no layout and rasterizes blank. See useCertificateDownload.
      */}
      {certificate && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -10000,
            top: 0,
            width: CERTIFICATE_WIDTH,
            height: CERTIFICATE_HEIGHT,
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          {/* captureRef goes on this INNER, unpositioned div — see useCertificateDownload. */}
          <div ref={captureRef}>
          <CertificateArtwork
            name={certificate.studentName}
            course={certificate.courseTitle}
            date={certificate.completionDate}
            serial={certificate.certificateNumber}
          />
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return runWithServerApiBase(ctx.req, async () => {
    const token = ctx.params?.token as string | undefined;
    if (!token) return { notFound: true };

    try {
      const link = await getCertificateLink(token);
      return { props: { link } };
    } catch {
      // Unknown, draft or deleted token — a 404 page, not an error page.
      return { notFound: true };
    }
  });
};
