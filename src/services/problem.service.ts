/**
 * Problem API Service
 * Handles all problem-related API calls
 */

import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type {
  Problem,
  SubmitProblemRequest,
  Submission,
  PaginatedResponse,
  QueryParams,
  ApiResponse,
} from '../types/api.types'

export const problemService = {
  /**
   * Get all problems with pagination and filters
   */
  getProblems: async (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Problem>>> => {
    return await api.get<PaginatedResponse<Problem>>(API_ENDPOINTS.PROBLEMS.BASE, {
      params,
    })
  },

  /**
   * Get problem by ID
   */
  getProblemById: async (id: string): Promise<ApiResponse<Problem>> => {
    return await api.get<Problem>(API_ENDPOINTS.PROBLEMS.DETAIL(id))
  },

  /**
   * Submit solution for a problem
   */
  submitSolution: async (submission: SubmitProblemRequest): Promise<ApiResponse<Submission>> => {
    return await api.post<Submission>(
      API_ENDPOINTS.PROBLEMS.SUBMIT(submission.problemId),
      submission
    )
  },

  /**
   * Get submissions for a problem
   */
  getProblemSubmissions: async (problemId: string, params?: QueryParams) => {
    return await api.get(API_ENDPOINTS.PROBLEMS.SUBMISSIONS(problemId), { params })
  },

  /**
   * Get test cases for a problem (sample only)
   */
  getProblemTestCases: async (problemId: string) => {
    return await api.get(API_ENDPOINTS.PROBLEMS.TESTCASES(problemId))
  },
}

export default problemService

