/**
 * Application Configuration
 * 
 * Toggle between mock and real API here
 */

export const appConfig = {
  // Set to true to use mock data, false to use real API
  useMockApi: true,
  
  // API base URL (used when useMockApi is false)
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  
  // Other app-wide settings
  appName: 'StudyCafe',
  version: '1.0.0',
};

// Helper to check if we should use mock
export const shouldUseMock = (): boolean => {
  return appConfig.useMockApi;
};

