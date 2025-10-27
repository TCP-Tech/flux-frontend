/**
 * Submission API Service
 * Handles all submission-related API calls
 */

import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type { Submission, PaginatedResponse, QueryParams, ApiResponse } from '../types/api.types'

export const submissionService = {
  /**
   * Get all submissions with pagination and filters
   */
  getSubmissions: async (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Submission>>> => {
    return await api.get<PaginatedResponse<Submission>>(API_ENDPOINTS.SUBMISSIONS.BASE, {
      params,
    })
  },

  /**
   * Get submission by ID
   */
  getSubmissionById: async (id: string): Promise<ApiResponse<Submission>> => {
    return await api.get<Submission>(API_ENDPOINTS.SUBMISSIONS.DETAIL(id))
  },

  /**
   * Get submission status (for polling)
   */
  getSubmissionStatus: async (id: string): Promise<ApiResponse<Submission>> => {
    return await api.get<Submission>(API_ENDPOINTS.SUBMISSIONS.STATUS(id))
  },
}

export default submissionService

