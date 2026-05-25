/**
 * Application Configuration
 *
 * Toggle between mock and real API here
 */

import { getPublicApiBaseUrl } from '@/config/env';

export const appConfig = {
  useMockApi: false,
  apiBaseUrl: getPublicApiBaseUrl(),
  appName: 'StudyCafe',
  version: '1.0.0',
};

export const shouldUseMock = (): boolean => appConfig.useMockApi;
