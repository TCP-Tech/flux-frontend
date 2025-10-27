/**
 * Contest API Service
 * Handles all contest-related API calls
 */

import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type { Contest, ContestRegistration, PaginatedResponse, QueryParams } from '../types/api.types'

export const contestService = {
  /**
   * Get all contests with pagination and filters
   */
  getContests: async (params?: QueryParams): Promise<PaginatedResponse<Contest>> => {
    return await api.get<PaginatedResponse<Contest>>(API_ENDPOINTS.CONTESTS.BASE, {
      params,
    })
  },

  /**
   * Get contest by ID
   */
  getContestById: async (id: string): Promise<Contest> => {
    const response = await api.get<Contest>(API_ENDPOINTS.CONTESTS.DETAIL(id))
    return response.data
  },

  /**
   * Register for a contest
   */
  registerForContest: async (contestId: string): Promise<ContestRegistration> => {
    const response = await api.post<ContestRegistration>(
      API_ENDPOINTS.CONTESTS.REGISTER(contestId)
    )
    return response.data
  },

  /**
   * Unregister from a contest
   */
  unregisterFromContest: async (contestId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.CONTESTS.UNREGISTER(contestId))
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
    return await api.get(API_ENDPOINTS.CONTESTS.PROBLEMS(contestId))
  },
}

export default contestService

