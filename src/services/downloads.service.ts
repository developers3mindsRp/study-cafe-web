import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';

export type DownloadCategory = {
  id: number;
  name: string;
  slug: string;
  file_count: number;
  wp_term_id?: number | null;
};

export type DownloadFile = {
  id: number;
  title: string;
  slug: string | null;
  views: number;
  created_at?: string;
  status?: string;
  meta_title?: string | null;
  meta_description?: string | null;
  author_id?: number | null;
  FileCats?: Array<{ id: number; name: string; slug: string }>;
};

export type DownloadsPaginatedMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export async function getDownloadCategories(): Promise<DownloadCategory[]> {
  const res = await axiosInstance.get<ApiResponse<DownloadCategory[]>>(
    '/downloads/categories'
  );
  return res.data.data;
}

export async function getCategoryFiles(
  categorySlug: string,
  params?: { page?: number; limit?: number; search?: string }
): Promise<{ data: DownloadFile[]; meta: DownloadsPaginatedMeta }> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: DownloadFile[];
    meta: DownloadsPaginatedMeta;
  }>(`/downloads/categories/${encodeURIComponent(categorySlug)}/files`, {
    params,
  });
  return { data: res.data.data, meta: res.data.meta };
}

export async function getDownloadFileBySlugOrId(
  idOrSlug: string
): Promise<DownloadFile> {
  const res = await axiosInstance.get<ApiResponse<DownloadFile>>(
    `/downloads/files/${encodeURIComponent(idOrSlug)}`
  );
  return res.data.data;
}

/** Record a page view (POST). Safe to call once after mount; does not run during SSR. */
export async function recordDownloadFileView(
  idOrSlug: string
): Promise<{ views: number }> {
  const enc = encodeURIComponent(idOrSlug);
  const res = await axiosInstance.post<ApiResponse<{ views: number }>>(
    `/downloads/files/${enc}/view`
  );
  return res.data.data;
}

export async function getDownloadFileUrl(idOrSlug: string): Promise<{
  url: string;
  id: number;
  slug: string | null;
  title: string;
}> {
  // Flat path avoids some proxies returning 404 on .../files/:slug/url
  const enc = encodeURIComponent(idOrSlug);
  const res = await axiosInstance.get<
    ApiResponse<{
      url: string;
      id: number;
      slug: string | null;
      title: string;
    }>
  >(`/downloads/download-url/${enc}`);
  return res.data.data;
}

export async function getRecentDownloadFiles(
  limit = 5
): Promise<{ data: DownloadFile[]; meta: DownloadsPaginatedMeta }> {
  const res = await axiosInstance.get<{
    success: boolean;
    data: DownloadFile[];
    meta: DownloadsPaginatedMeta;
  }>('/downloads/files', {
    params: { page: 1, limit, sort: 'latest' },
  });
  return { data: res.data.data, meta: res.data.meta };
}
