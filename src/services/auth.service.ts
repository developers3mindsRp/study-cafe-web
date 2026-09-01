import axiosInstance from '@/lib/axios';
import axios from 'axios';
import {
  LoginCredentials,
  LoginOtpCredentials,
  RegisterData,
  QuickRegisterData,
  AuthResponse,
  User,
  ChangePasswordData,
} from '@/types/models.types';
import { ApiResponse } from '@/types/api.types';
import {
  setToken,
  setRefreshToken,
  setUserData,
  clearAuthData,
  getRefreshToken,
  getReferralCode,
} from '@/utils/auth.utils';
import { shouldUseMock } from '@/config/app.config';
import { mockAuthApi } from '@/mocks/api.mock';

/** Map API `email_verified` — only explicit `false` blocks the app; omit/`true`/`undefined` = verified for stale cachess. */
export function mapEmailVerifiedFromApi(v: boolean | undefined): boolean | undefined {
  if (v === false) return false;
  if (v === true) return true;
  return undefined;
}

/** Raw auth payload from auth-service (login / register / verify-email / login-otp) */
type AuthPayload = {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: {
    id: string | number;
    email: string;
    name: string;
    bio?: string | null;
    avatar?: string | null;
    phone?: string | null;
    role: string;
    permissions?: string[];
    has_active_membership?: boolean;
    email_verified?: boolean;
    referral_code?: string | null;
    profession?: string | null;
    company?: string | null;
    designation?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    gst?: string | null;
  };
  expiresIn?: number;
};

function toUser(u: AuthPayload['user']): User {
  const ev = mapEmailVerifiedFromApi(u.email_verified);
  return {
    id: String(u.id),
    email: u.email,
    name: u.name || '',
    bio: u.bio != null && String(u.bio).trim() !== '' ? String(u.bio) : undefined,
    avatar: u.avatar || undefined,
    phone: u.phone || null,
    profession: u.profession || null,
    company: u.company || null,
    designation: u.designation || null,
    city: u.city || null,
    state: u.state || null,
    country: u.country || null,
    gst: u.gst || null,
    role: u.role || 'user',
    permissions: u.permissions ?? [],
    hasActiveMembership: !!u.has_active_membership,
    referralCode: u.referral_code || null,
    ...(ev !== undefined ? { emailVerified: ev } : {}),
  };
}

export async function persistAuth(payload: AuthPayload): Promise<AuthResponse> {
  const access = payload.accessToken ?? payload.token;
  if (!access) throw new Error('No access token in auth response');

  setToken(access);
  if (payload.refreshToken) setRefreshToken(payload.refreshToken);

  let user: User;
  try {
    user = await getCurrentUser();
  } catch {
    user = toUser(payload.user);
    setUserData(user);
  }

  return {
    user,
    token: access,
    refreshToken: payload.refreshToken,
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.login(credentials);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const response = await axiosInstance.post<ApiResponse<AuthPayload>>(
    '/auth/login',
    credentials
  );
  return await persistAuth(response.data.data);
};

export const loginWithEmailOtp = async (credentials: LoginOtpCredentials): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.loginWithEmailOtp(credentials);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const response = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/login/otp', {
    email: credentials.email.trim(),
    otp: credentials.otp.trim(),
  });
  return await persistAuth(response.data.data);
};

export const requestLoginOtp = async (email: string): Promise<void> => {
  if (shouldUseMock()) {
    await mockAuthApi.requestLoginOtp(email);
    return;
  }
  await axiosInstance.post('/auth/login/otp/request', { email: email.trim() });
};

/**
 * Whether this email already has an account.
 *
 * Lets checkout ask for a password instead of guessing: an existing buyer is sent to
 * sign-in, a new one straight to "pick a password", neither is shown a 409 after
 * filling in a form. Falls back to "no account" so a lookup failure degrades into the
 * signup path, which surfaces a proper duplicate-email error of its own.
 */
export const accountExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ exists: boolean }>>(
      '/auth/account-exists',
      { email: email.trim() },
    );
    return !!response.data.data?.exists;
  } catch {
    return false;
  }
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.register(userData);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const {
    email,
    password,
    name,
    phone,
    profession,
    company,
    designation,
    city,
    state,
    country,
  } = userData;
  const referralCode = getReferralCode() || undefined;
  const response = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/register', {
    email: email.trim(),
    password,
    name: name.trim(),
    phone,
    profession,
    company: company?.trim() || undefined,
    designation: designation?.trim() || undefined,
    city: city.trim(),
    state,
    country,
    referralCode,
  });
  return await persistAuth(response.data.data);
};

/** Checkout signup — see QuickRegisterData. Still returns an unverified session: the OTP step follows. */
export const registerQuick = async (userData: QuickRegisterData): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.registerQuick(userData);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }

  const referralCode = getReferralCode() || undefined;
  const response = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/register/quick', {
    name: userData.name.trim(),
    email: userData.email.trim(),
    phone: userData.phone,
    password: userData.password,
    ...(userData.confirmPassword ? { confirmPassword: userData.confirmPassword } : {}),
    referralCode,
    ...(userData.skipVerificationEmail ? { skipVerificationEmail: true } : {}),
  });
  return await persistAuth(response.data.data);
};

export const getCurrentUser = async (): Promise<User> => {
  if (shouldUseMock()) {
    const user = await mockAuthApi.getCurrentUser();
    setUserData(user);
    return user;
  }

  const response = await axiosInstance.get<
    ApiResponse<{
      id: string | number;
      email: string;
      name: string;
      bio?: string | null;
      phone?: string | null;
      role: string;
      permissions?: string[];
      has_active_membership?: boolean;
      email_verified?: boolean;
      referral_code?: string | null;
      avatar?: string | null;
      profession?: string | null;
      company?: string | null;
      designation?: string | null;
      city?: string | null;
      state?: string | null;
      country?: string | null;
      gst?: string | null;
      bank_account_holder_name: string | null;
      bank_account_number: string | null;
      bank_ifsc: string | null;
      bank_name:string | null;
      bank_branch: string | null;
    }>
  >('/auth/me', {
    headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    params: { _t: Date.now() },
  });

  const d = response.data.data;
  const ev = mapEmailVerifiedFromApi(d.email_verified);
  const user: User = {
    id: String(d.id),
    email: d.email,
    name: d.name || '',
    bio: d.bio != null && String(d.bio).trim() !== '' ? String(d.bio) : undefined,
    avatar: d.avatar || undefined,
    phone: d.phone || null,
    profession: d.profession || null,
    company: d.company || null,
    designation: d.designation || null,
    city: d.city || null,
    state: d.state || null,
    country: d.country || null,
    gst: d.gst || null,
    role: d.role || 'user',
    permissions: d.permissions ?? [],
    hasActiveMembership: !!d.has_active_membership,
    referralCode: d.referral_code || null,
    bank_account_holder_name: d.bank_account_holder_name || null,
    bank_account_number: d.bank_account_number || null,
    bank_ifsc: d.bank_ifsc || null,
    bank_name:d.bank_name || null,
    bank_branch: d.bank_branch || null,
    ...(ev !== undefined ? { emailVerified: ev } : {}),
  };
  setUserData(user);
  return user;
};

export const logout = async (): Promise<void> => {
  if (shouldUseMock()) {
    await mockAuthApi.logout();
    clearAuthData();
    return;
  }
  clearAuthData();
};

export const refreshAccessToken = async (): Promise<string> => {
  if (shouldUseMock()) {
    const token = await mockAuthApi.refreshToken();
    setToken(token);
    return token;
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${axiosInstance.defaults.baseURL}/auth/refresh`,
    { refreshToken },
    { headers: { 'Content-Type': 'application/json' } }
  );
  const access = data.data.accessToken;
  setToken(access);
  return access;
};

export const changePassword = async (data: ChangePasswordData): Promise<void> => {
  await axiosInstance.post('/auth/change-password', data);
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  await axiosInstance.post('/auth/forgot-password', { email });
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  await axiosInstance.post('/auth/reset-password', { token, password: newPassword });
};

/** Confirm signup / email with 6-digit OTP; returns fresh session. */
export const verifyEmailWithOtp = async (otp: string): Promise<AuthResponse> => {
  if (shouldUseMock()) {
    const authResponse = await mockAuthApi.verifyEmailWithOtp(otp);
    setToken(authResponse.token);
    if (authResponse.refreshToken) setRefreshToken(authResponse.refreshToken);
    setUserData(authResponse.user);
    return authResponse;
  }
  const response = await axiosInstance.post<ApiResponse<AuthPayload>>('/auth/verify-email', {
    otp: otp.trim(),
  });
  return await persistAuth(response.data.data);
};

export const resendVerificationEmail = async (): Promise<void> => {
  if (shouldUseMock()) {
    await mockAuthApi.resendVerificationEmail();
    return;
  }
  await axiosInstance.post('/auth/verify-email/resend');
};
