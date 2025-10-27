/**
 * Contest API Service
 * Handles all contest-related API calls
 */

import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type { Contest, ContestRegistration, PaginatedResponse, QueryParams, ApiResponse } from '../types/api.types'

export const contestService = {
  /**
   * Get all contests with pagination and filters
   */
  getContests: async (params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Contest>>> => {
    return await api.get<PaginatedResponse<Contest>>(API_ENDPOINTS.CONTESTS.BASE, {
      params,
    })
  },

  /**
   * Get contest by ID
   */
  getContestById: async (id: string): Promise<ApiResponse<Contest>> => {
    return await api.get<Contest>(`${API_ENDPOINTS.CONTESTS.DETAIL}/${id}`)
  },

  /**
   * Register for a contest
   */
  registerForContest: async (contestId: string): Promise<ApiResponse<ContestRegistration>> => {
    return await api.post<ContestRegistration>(
      API_ENDPOINTS.CONTESTS.REGISTER,
      { contest_id: contestId }
    )
  },

  /**
   * Unregister from a contest
   */
  unregisterFromContest: async (contestId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.CONTESTS.UNREGISTER, {
      params: { contest_id: contestId }
    })
  },

  /**
   * Get contest leaderboard
   */
  getContestLeaderboard: async (contestId: string, params?: QueryParams) => {
    return await api.get(API_ENDPOINTS.CONTESTS.LEADERBOARD(contestId), { params })
  },

  /**
   * Get contest problems
   */
  getContestProblems: async (contestId: string) => {
    return await api.get(API_ENDPOINTS.CONTESTS.PROBLEMS, {
      params: { contest_id: contestId }
    })
  },
}

export default contestService

