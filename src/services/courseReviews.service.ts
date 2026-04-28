import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api.types';
import { shouldUseMock } from '@/config/app.config';

const api = axiosInstance;

export type PublicCourseReview = {
  id: number;
  course_id: number;
  rating: number;
  body: string | null;
  reviewer_display: string;
  created_at: string;
  updated_at: string;
};

export type MyCourseReview = {
  id: number;
  user_id: number;
  course_id: number;
  rating: number;
  body: string | null;
  created_at: string;
  updated_at: string;
};

export async function listPublicCourseReviews(courseId: string): Promise<PublicCourseReview[]> {
  if (shouldUseMock()) return [];
  const response = await api.get<ApiResponse<PublicCourseReview[]>>(
    `/courses/${encodeURIComponent(courseId)}/reviews`
  );
  return response.data.data;
}

export async function getMyCourseReview(courseId: string): Promise<MyCourseReview | null> {
  if (shouldUseMock()) return null;
  const response = await api.get<ApiResponse<MyCourseReview | null>>(
    `/reviews/me/course/${encodeURIComponent(courseId)}`
  );
  return response.data.data;
}

export async function submitCourseReview(
  courseId: string,
  rating: number,
  bodyText: string
): Promise<MyCourseReview> {
  if (shouldUseMock()) {
    return {
      id: 0,
      user_id: 0,
      course_id: Number(courseId),
      rating,
      body: bodyText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  const response = await api.post<ApiResponse<MyCourseReview>>('/reviews', {
    courseId: Number(courseId),
    rating,
    body: bodyText.trim(),
  });
  return response.data.data;
}
