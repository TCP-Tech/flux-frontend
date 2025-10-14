/**
 * API Types and Interfaces
 * Type definitions for API requests and responses
 */

// Base Response Structure
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  timestamp: string
}

// Authentication Types
export interface LoginRequest {
  user_name?: string
  roll_no?: string
  password: string
  remember_for_month?: boolean
}

export interface SignupRequest {
  first_name: string
  last_name: string
  roll_no: string  // 8 digit numeric
  password: string
  email: string
  verification_token?: string
}

export interface AuthResponse {
  user: User
  // Token is set in cookie by backend
}

export interface User {
  id: string
  user_name: string
  roll_no: string
  first_name: string
  last_name: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  rating?: number
  rank?: number
  created_at: string
  updated_at: string
}

// Contest Types
export interface Contest {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  duration: number
  type: 'individual' | 'team'
  status: 'upcoming' | 'ongoing' | 'completed'
  maxParticipants?: number
  currentParticipants: number
  problems: Problem[]
  isRegistered: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ContestRegistration {
  contestId: string
  userId: string
  registeredAt: string
}

// Problem Types
export interface Problem {
  id: string
  title: string
  slug: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  timeLimit: number
  memoryLimit: number
  inputFormat: string
  outputFormat: string
  constraints: string
  sampleTestCases: TestCase[]
  totalSubmissions: number
  successfulSubmissions: number
  acceptanceRate: number
  createdAt: string
  updatedAt: string
}

export interface TestCase {
  input: string
  output: string
  explanation?: string
}

export interface SubmitProblemRequest {
  problemId: string
  language: string
  code: string
  contestId?: string
}

// Submission Types
export interface Submission {
  id: string
  problemId: string
  userId: string
  contestId?: string
  language: string
  code: string
  status: SubmissionStatus
  verdict?: SubmissionVerdict
  executionTime?: number
  memoryUsed?: number
  testCasesPassed: number
  totalTestCases: number
  score?: number
  submittedAt: string
  evaluatedAt?: string
}

export type SubmissionStatus = 'pending' | 'running' | 'completed' | 'error'

export type SubmissionVerdict =
  | 'accepted'
  | 'wrong_answer'
  | 'time_limit_exceeded'
  | 'memory_limit_exceeded'
  | 'runtime_error'
  | 'compilation_error'

// Leaderboard Types
export interface LeaderboardEntry {
  rank: number
  user: {
    id: string
    username: string
    avatar?: string
  }
  score: number
  solvedProblems: number
  lastSubmission: string
  penaltyTime?: number
}

// Profile Types
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  bio?: string
  country?: string
  institution?: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
  }
}

// Filter and Sort Options
export interface QueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  [key: string]: string | number | boolean | undefined
}

// WebSocket Types (for real-time updates)
export interface WebSocketMessage {
  type: 'submission_update' | 'contest_update' | 'notification'
  payload: unknown
  timestamp: string
}

