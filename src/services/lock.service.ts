import { api } from '../config/axios'
import { API_ENDPOINTS } from '../config/env'
import type { Lock, CreateLockRequest, UpdateLockRequest, Lockfilters } from '../types/lock.types'

export const lockService = {
  


  createLock : async (lock : CreateLockRequest) : Promise<Lock> =>{
  const response = await api.post<Lock>(API_ENDPOINTS.LOCKS.BASE,lock);
  return response;

  },

  searchLocks : async (filters : Lockfilters): Promise<Lock[]> =>{
  const response = await api.post<Lock[]>(API_ENDPOINTS.LOCKS.SEARCH,filters);
  return response || [];
  },



  getLockById: async (lockId: string): Promise<Lock> => {
    const response = await api.get<Lock>(API_ENDPOINTS.LOCKS.DETAIL, {
      params: { lock_id: lockId },
    })
    return response
  },


  updateLock: async (data: UpdateLockRequest): Promise<Lock> => {
    const response = await api.put<Lock>(API_ENDPOINTS.LOCKS.BASE, data)
    return response
  },

  deleteLock: async (lockId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.LOCKS.BASE, {
      params: { lock_id: lockId },
    })
  },
}
