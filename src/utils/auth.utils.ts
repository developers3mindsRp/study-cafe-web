import Cookies from 'js-cookie';

// Token keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const cookieOpts = (days: number) => ({
  expires: days,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
});

// Token storage functions
export const getToken = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  return Cookies.get(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, cookieOpts(7));
};

export const removeToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, cookieOpts(30));
};

export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Logout cleanup helper
export const clearAuthData = (): void => {
  removeToken();
  removeRefreshToken();
  
  // Clear any other auth-related data from localStorage if needed
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Store user data in localStorage
export const setUserData = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUserData = (): any | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const removeUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

const REFERRAL_KEY = 'ref_code';
const REFERRAL_TS_KEY = 'ref_ts';
const REFERRAL_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export const setReferralCode = (code: string): void => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(REFERRAL_KEY);
  if (existing) return;
  localStorage.setItem(REFERRAL_KEY, code);
  localStorage.setItem(REFERRAL_TS_KEY, String(Date.now()));
};

export const getReferralCode = (): string | null => {
  if (typeof window === 'undefined') return null;
  const code = localStorage.getItem(REFERRAL_KEY);
  const ts = localStorage.getItem(REFERRAL_TS_KEY);
  if (!code || !ts) return null;
  if (Date.now() - Number(ts) > REFERRAL_WINDOW_MS) {
    localStorage.removeItem(REFERRAL_KEY);
    localStorage.removeItem(REFERRAL_TS_KEY);
    return null;
  }
  return code;
};

export const clearReferralCode = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFERRAL_KEY);
  localStorage.removeItem(REFERRAL_TS_KEY);
};

