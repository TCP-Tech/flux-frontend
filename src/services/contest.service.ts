import { api } from '@/config/axios'
import { API_ENDPOINTS } from '@/config/env'
import { Contest, CreateContestRequest, SearchContestRequest, ContestProblemWrapper } from '@/types/contest.types'

export const contestService = {
  /**
   * Search Contests
   */
  searchContests: async (filters: SearchContestRequest): Promise<Contest[]> => {
    const response = await api.post<Contest[]>(API_ENDPOINTS.CONTESTS.SEARCH, filters)
    return response || []
  },

  /**
   * Get specific contest details
   */
  getContestById: async (id: string): Promise<Contest> => {
    return await api.get<Contest>(API_ENDPOINTS.CONTESTS.DETAIL, {
       params: { contest_id: id } 
    })
  },

  /**
   * Get problems associated with a contest
   */
  getContestProblems: async (contestId: string): Promise<ContestProblemWrapper[]> => {
    return await api.get<ContestProblemWrapper[]>(API_ENDPOINTS.CONTESTS.PROBLEMS, {
      params: { contest_id: contestId }
    })
  },

  /**
   * Create a new contest
   */
  createContest: async (payload: CreateContestRequest): Promise<Contest> => {
    return await api.post(API_ENDPOINTS.CONTESTS.BASE, payload)
  },

  /**
   * Get IDs of contests the user is registered for
   */
  getMyRegisteredContestIds: async (): Promise<string[]> => {
      // Return empty array if the endpoint returns null
      const res = await api.get<any[]>(API_ENDPOINTS.CONTESTS.USER_REGISTERED, {
        params: { page_number: 1, page_size: 1000 }
      });
      
      return res?.map((item: any) => typeof item === 'string' ? item : item.contest_id) || [];
  },

  /**
   * Register a specific user for a contest.
   */
  registerForContest: async (contestId: string, username: string): Promise<void> => {
     await api.put(API_ENDPOINTS.CONTESTS.REGISTER, { 
        contest_id: contestId,
        user_names: [username] 
     })
  },

  updateContest: async (payload: any): Promise<Contest> => {
    return await api.put(API_ENDPOINTS.CONTESTS.BASE, payload)
  },
  
  deleteContest: async (id: string): Promise<void> => {
    return await api.delete(API_ENDPOINTS.CONTESTS.BASE, {
        params: { contest_id: id }
    })
  }
}
