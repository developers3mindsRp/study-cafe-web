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

