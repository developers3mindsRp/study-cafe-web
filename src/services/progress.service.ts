import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';
import { printCertificate, type CertificatePayload } from '@/utils/certificatePrint';

const api = axiosInstance;

export type ProgressSessionRow = {
  sessionId: number;
  dayNumber: number;
  sectionIndex: number;
  /** Section heading (when set); else UI derives from day + section index */
  sectionTitle?: string | null;
  /** Batch-level day title from session row */
  dayTitle?: string | null;
  title: string | null;
  status: string;
  watchSeconds: number;
  durationSeconds: number | null;
  recordings: Array<{
    id: number;
    url: string;
    source: string | null;
    is_visible: boolean;
  }>;
};

export type CourseProgressPayload = {
  courseId: string;
  batchId?: number;
  completedSessions: number;
  totalSessions: number;
  percent: number;
  status: string;
  lastSessionId: string | null;
  sessions: ProgressSessionRow[];
};

export type CompleteSessionResponse = {
  progress: Record<string, unknown>;
  courseCompleted: boolean;
};

export const getCourseProgress = async (courseId: string): Promise<CourseProgressPayload> => {
  if (shouldUseMock()) {
    return {
      courseId,
      completedSessions: 0,
      totalSessions: 0,
      percent: 0,
      status: 'not_started',
      lastSessionId: null,
      sessions: [],
    };
  }
  const response = await api.get<ApiResponse<CourseProgressPayload>>(
    `/progress/course/${encodeURIComponent(courseId)}`
  );
  return response.data.data;
};

export const heartbeatSession = async (
  sessionId: string | number,
  body: { watchSeconds: number; durationSeconds?: number }
) => {
  if (shouldUseMock()) return {};
  const response = await api.post<ApiResponse<Record<string, unknown>>>(
    `/progress/session/${encodeURIComponent(String(sessionId))}/heartbeat`,
    body
  );
  return response.data.data;
};

export const completeSession = async (sessionId: string | number): Promise<CompleteSessionResponse> => {
  if (shouldUseMock()) {
    return { progress: {}, courseCompleted: false };
  }
  const response = await api.post<ApiResponse<CompleteSessionResponse>>(
    `/progress/session/${encodeURIComponent(String(sessionId))}/complete`
  );
  return response.data.data;
};

export type OverallProgressRow = {
  courseId: string;
  percent: number;
  status: string;
  completedSessions: number;
  totalSessions: number;
};

export const getOverallProgress = async (): Promise<OverallProgressRow[]> => {
  if (shouldUseMock()) return [];
  const response = await api.get<ApiResponse<OverallProgressRow[]>>('/progress/overall');
  return response.data.data;
};

/** Server data for building a certificate on the client (no PDF from backend). */
export const fetchCertificatePayload = async (courseId: string): Promise<CertificatePayload> => {
  if (shouldUseMock()) {
    return {
      courseTitle: 'Sample course',
      studentName: 'Learner',
      completionDate: new Date().toISOString().slice(0, 10),
    };
  }
  const response = await api.get<ApiResponse<CertificatePayload>>(
    `/certificates/course/${encodeURIComponent(courseId)}`
  );
  return response.data.data;
};

/**
 * Fetches certificate fields and opens the browser print dialog (Save as PDF).
 * @deprecated Renamed behavior: use fetchCertificatePayload + your own UI, or call printCertificate after fetch.
 */
export const downloadCertificate = async (courseId: string): Promise<void> => {
  const payload = await fetchCertificatePayload(courseId);
  printCertificate(payload);
};

export { printCertificate, type CertificatePayload };
