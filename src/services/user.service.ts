/**
 * User API Service
 * Handles all user-related API calls
 */

import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type { User, UpdateProfileRequest } from '../types/api.types'

export const userService = {
  /**
   * Get user profile by ID
   */
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get<User>(API_ENDPOINTS.USERS.PROFILE(userId))
    // Fix: api.get already returns the data payload, so we return response directly
    return response
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: UpdateProfileRequest): Promise<User> => {
    const response = await api.patch<User>(API_ENDPOINTS.USERS.UPDATE_PROFILE(userId), data)
    // Fix: api.patch already returns the data payload
    return response
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (userId: string, file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post<{ avatarUrl: string }>(
      API_ENDPOINTS.USERS.AVATAR(userId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response
  },

  /**
   * Get user's submissions
   */
  getUserSubmissions: async (userId: string, params?: { page?: number; limit?: number }) => {
    return await api.get(`${API_ENDPOINTS.USERS.PROFILE(userId)}/submissions`, { params })
  },

  /**
   * Get user's statistics
   */
  getUserStatistics: async (userId: string) => {
    return await api.get(`${API_ENDPOINTS.USERS.PROFILE(userId)}/statistics`)
  },
}

export default userService
