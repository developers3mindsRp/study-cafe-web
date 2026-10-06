import publicAxios from '@/lib/publicAxios';
import { ApiResponse } from '@/types/api.types';

/** Why the claim form is or is not shown. `full` and `expired` both mean "closed". */
export type CertificateLinkStatus = 'active' | 'expired' | 'full';

export interface PublicCertificateLink {
  token: string;
  title: string;
  description: string | null;
  courseTitle: string | null;
  status: CertificateLinkStatus;
  /** null means unlimited. */
  claimsRemaining: number | null;
  /** Server clock at render time; echoed back on submit so the API can spot instant posts. */
  rendered_at: number;
}

export interface CertificateClaimPayload {
  name: string;
  email: string;
  phone: string;
  /** Honeypot — must stay empty. Never shown to a real user. */
  company_website?: string;
  rendered_at?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/** Same shape the learner certificate endpoint returns, so one artwork component renders both. */
export interface ClaimedCertificate {
  courseTitle: string;
  studentName: string;
  completionDate: string;
  certificateNumber: string | null;
}

/**
 * All calls go through publicAxios: no auth header, and no 401 interceptor that would redirect a
 * signed-out visitor to /login.
 */
export const getCertificateLink = async (token: string): Promise<PublicCertificateLink> => {
  const { data } = await publicAxios.get<ApiResponse<PublicCertificateLink>>(
    `/certificate-links/${encodeURIComponent(token)}`,
  );
  return data.data;
};

export const claimCertificate = async (
  token: string,
  payload: CertificateClaimPayload,
): Promise<ClaimedCertificate> => {
  const { data } = await publicAxios.post<ApiResponse<ClaimedCertificate>>(
    `/certificate-links/${encodeURIComponent(token)}/claim`,
    payload,
  );
  return data.data;
};

/**
 * Re-show a certificate this email already holds. Works on expired / full links too (the claim
 * email's button lands here long after the link may have closed) and never issues a new one —
 * an email with no certificate gets a 404 with a message to show.
 */
export const retrieveCertificate = async (
  token: string,
  email: string,
): Promise<ClaimedCertificate> => {
  const { data } = await publicAxios.post<ApiResponse<ClaimedCertificate>>(
    `/certificate-links/${encodeURIComponent(token)}/retrieve`,
    { email },
  );
  return data.data;
};
