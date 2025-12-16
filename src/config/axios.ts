/**
 * Axios Client Configuration
 * Centralized HTTP client with interceptors for auth and error handling
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Cookies } from 'react-cookie'
import { config, isDevelopment } from './env'
import type { ApiError, ApiResponse } from '../types/api.types'

// Cookie instance for token management
const cookies = new Cookies()

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'jwt_session',  // Must match backend: KeyJwtSessionCookieName
  REFRESH_TOKEN: 'flux_refresh_token',
} as const

/**
 * Create axios instance with default configuration
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.apiBaseUrl,
    timeout: config.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    withCredentials: true, // Enable sending cookies
  })

  return instance
}

// Create the main API client
export const apiClient: AxiosInstance = createAxiosInstance()

/**
 * Request Interceptor
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    // Backend uses HTTP-only cookies for authentication, not Authorization header
    // Cookie is automatically sent by browser

    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId()

    // Log request in development
    if (isDevelopment()) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    if (isDevelopment()) {
      console.error('[API Request Error]', error)
    }
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * Handles responses and errors globally
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (isDevelopment()) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Log error in development
    if (isDevelopment()) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data,
      })
    }

    // Handle 401 Unauthorized - Session expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      localStorage.removeItem('flux_is_authenticated')
      cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' })

      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Access Denied')
      // You can show a toast notification here
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('[API] Resource not found')
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('[API] Server error')
      // You can show a toast notification here
    }

    // Handle Network Error
    if (error.message === 'Network Error') {
      console.error('[API] Network error - Check your internet connection')
      // You can show a toast notification here
    }

    // Handle Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('[API] Request timeout')
      // You can show a toast notification here
    }

    return Promise.reject(error)
  }
)

/**
 * Helper Functions
 */

// Generate unique request ID
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * API Error Handler
 * Extracts error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError
    return apiError?.error?.message || error.message || 'An unexpected error occurred'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}

/**
 * Generic API Request Wrapper
 * Provides type-safe API calls with error handling
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>(config)
    return response.data
  } catch (error) {
    throw error
  }
}
/**
 * Export a clean API interface
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
}

export default apiClient

