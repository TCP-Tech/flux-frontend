/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import { api, COOKIE_NAMES } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import { Cookies } from 'react-cookie'
import type { LoginRequest, SignupRequest, AuthResponse, User, ApiResponse } from '../types/api.types'

const cookies = new Cookies()
const AUTH_KEY = 'flux_is_authenticated'

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Login user
   * Backend sets JWT token in HTTP-only cookie
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    localStorage.setItem(AUTH_KEY, 'true')
    // Token is automatically set by backend in HTTP-only cookie
    // Just return the user data
    return response
  },

  /**
   * Signup new user
   * Backend requires verification token from email
   */
  signup: async (userData: SignupRequest): Promise<{ user_name: string; roll_no: string }> => {
    const response = await api.post<{ user_name: string; roll_no: string }>(
      API_ENDPOINTS.AUTH.SIGNUP,
      userData
    )
    return response
  },

  /**
   * Send signup verification email
   */
  sendSignupEmail: async (email: string): Promise<ApiResponse> => {
    return await api.get(API_ENDPOINTS.AUTH.SIGNUP_SEND_MAIL, {
      params: { email },
    })
  },

  /**
   * Logout user
   * Clear the JWT cookie
   */
  logout: async (): Promise<void> => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Clear frontend cookie reference
      localStorage.removeItem(AUTH_KEY)
      cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' })
      // Reload to clear application state
      window.location.href = '/login'
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.AUTH.ME)
    return response
  },

  /**
   * Send password reset email
   */
  sendResetPasswordEmail: async (identifier: { user_name?: string; roll_no?: string }): Promise<ApiResponse> => {
    return await api.get(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      params: identifier,
    })
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: {
    user_name?: string
    roll_no?: string
    password: string
    token: string
  }): Promise<ApiResponse> => {
    return await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
  },

  /**
   * Check if user is authenticated
   * Note: Backend uses HTTP-only cookie, so we check if cookie exists
   */
  isAuthenticated: (): boolean => {
    // Check if the JWT cookie exists
    // In production with HTTP-only cookies, we can't read the cookie from JS
    // So this is a best-effort check
   // return !!cookies.get(COOKIE_NAMES.ACCESS_TOKEN) || document.cookie.includes(COOKIE_NAMES.ACCESS_TOKEN)
    return localStorage.getItem(AUTH_KEY) === 'true'
  },

  /**
   * Get access token (if available)
   * Note: Backend uses HTTP-only cookie, so this may return undefined
   */
  getAccessToken: (): string | undefined => {
    return cookies.get(COOKIE_NAMES.ACCESS_TOKEN)
  },
}

export default authService

