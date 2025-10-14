/**
 * Environment Configuration
 * Centralizes all environment variables with type safety
 */

interface EnvConfig {
  apiBaseUrl: string
  apiTimeout: number
  env: 'development' | 'production' | 'test'
  enableMockApi: boolean
  enableDebugMode: boolean
  cookieDomain: string
  cookieSecure: boolean
  appName: string
  appVersion: string
}

/**
 * Validates and returns environment configuration
 * Throws error if required variables are missing
 */
const getEnvConfig = (): EnvConfig => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const apiTimeout = import.meta.env.VITE_API_TIMEOUT
  const env = import.meta.env.VITE_ENV || import.meta.env.MODE || 'development'

  // Validate required environment variables
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined in environment variables')
  }

  return {
    apiBaseUrl,
    apiTimeout: Number(apiTimeout) || 30000,
    env: env as 'development' | 'production' | 'test',
    enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === 'true',
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
    cookieDomain: import.meta.env.VITE_COOKIE_DOMAIN || 'localhost',
    cookieSecure: import.meta.env.VITE_COOKIE_SECURE === 'true',
    appName: import.meta.env.VITE_APP_NAME || 'Flux',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  }
}

export const config = getEnvConfig()

// Helper functions
export const isDevelopment = () => config.env === 'development'
export const isProduction = () => config.env === 'production'
export const isDebugMode = () => config.enableDebugMode

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/signup',
    SIGNUP_SEND_MAIL: '/auth/signup',  // GET
    REFRESH: '/auth/refresh',
    ME: '/me',
    VERIFY_EMAIL: '/auth/verify',
    FORGOT_PASSWORD: '/auth/reset-password',  // GET to send mail
    RESET_PASSWORD: '/auth/reset-password',   // POST to reset
  },

  // Users
  USERS: {
    BASE: '/users',
    PROFILE: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: (id: string) => `/users/${id}`,
    AVATAR: (id: string) => `/users/${id}/avatar`,
  },

  // Contests
  CONTESTS: {
    BASE: '/contests',
    DETAIL: '/contests',  // GET with query param id
    SEARCH: '/contests/search',  // POST with filters
    REGISTER: '/contests/users',  // PUT to register
    UNREGISTER: '/contests/users',  // DELETE with user_id
    LEADERBOARD: (id: string) => `/contests/${id}/leaderboard`,
    PROBLEMS: '/contests/problems',  // GET with query param contest_id
    USERS: '/contests/users',  // GET with query param contest_id
    USER_REGISTERED: '/contests/user-registered',  // GET user's contests
  },

  // Problems
  PROBLEMS: {
    BASE: '/problems',
    STANDARD: '/problems/standard',  // GET by id
    SEARCH: '/problems/search',  // POST with filters
    DETAIL: (id: string) => `/problems/${id}`,
    SUBMIT: (id: string) => `/problems/${id}/submit`,
    SUBMISSIONS: (id: string) => `/problems/${id}/submissions`,
    TESTCASES: (id: string) => `/problems/${id}/testcases`,
  },

  // Submissions
  SUBMISSIONS: {
    BASE: '/submissions',
    DETAIL: (id: string) => `/submissions/${id}`,
    STATUS: (id: string) => `/submissions/${id}/status`,
  },

  // Leaderboard
  LEADERBOARD: {
    GLOBAL: '/leaderboard/global',
    CONTEST: (id: string) => `/leaderboard/contest/${id}`,
  },

  // Locks (Admin)
  LOCKS: {
    BASE: '/locks',
    DETAIL: '/locks',  // GET with query param id
    SEARCH: '/locks/search',  // POST with filters
  },

  // Tournaments
  TOURNAMENTS: {
    BASE: '/tournaments',
    DETAIL: '/tournaments',  // GET with query param id
    SEARCH: '/tournaments/search',  // POST with filters
    ROUNDS: '/tournaments/rounds',  // GET with query param id
    CONTESTS: '/tournaments/contests',  // PUT to change tournament contest
  },
} as const

export default config

