// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error Response structure
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  /** Field-level errors from API validation (e.g. auth-service Joi) */
  details?: { field: string; message: string }[];
  statusCode?: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types for courses
export interface CourseFilters extends PaginationParams {
  category?: string;
  level?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  featured?: boolean;
}

// Query parameter types
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}




export interface CertificateDetail  {
  certificate_url: string;
  // add more fields if API returns more
}

/** Keys match course-service `CoursePageSetting` entries exposed at GET /courses/page-settings */
export interface PublicTrackingSettings {
  tracking_meta_pixel: string | null;
  tracking_google_analytics: string | null;
  tracking_linkedin_pixel: string | null;
}
