import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  FaPlus, FaSearch, FaCopy, FaCheck, FaPen, FaEye, FaTrash, 
  FaFilter, FaSortDown, FaHome, FaChevronRight 
} from 'react-icons/fa'

import { LockStatusBadge } from '@/components/locks/LockStatusBadge'
import CreateLockModal from '@/components/locks/CreateLockModal'
import EditLockModal from '@/components/locks/EditLockModal'
import { authService } from '@/services/auth.service'
import { lockService } from '@/services/lock.service'
import { useApi } from '@/hooks/useApi'

import { cn, formatDateTime, truncate } from '@/lib/utils'
import { Lock, LockType } from '@/types/lock.types'
import { User } from '@/types/api.types'

const PAGE_SIZE = 10
const DEV_BYPASS_PERMISSIONS = true 

export default function LocksPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'id'>('name')
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<'all' | 'manual' | 'active_timer'>('all')
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedLock, setSelectedLock] = useState<Lock | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    authService.getCurrentUser()
      .then(u => { if (mounted) setUser(u) })
      .catch(() => { if (mounted) navigate('/login') })
    return () => { mounted = false }
  }, [navigate])

  const searchLocksApi = useCallback(async () => {
    if (!user) return []

    if (searchType === 'id' && search.trim()) {
        try {
            const id = search.trim()
            if (id.length < 10) return [] 
            const lock = await lockService.getLockById(id)
            return lock ? [lock] : []
        } catch (e) { return [] }
    }
    
    return lockService.searchLocks({ 
      page_number: page, 
      page_size: PAGE_SIZE, 
      lock_name: search || undefined 
    })
  }, [page, search, searchType, user])

  const { data: rawLocks, loading, error, refetch } = useApi(searchLocksApi, [searchLocksApi])

  const locks = rawLocks || []
  
  const isManager = useMemo(() => {
    if (DEV_BYPASS_PERMISSIONS) return true
    if (!user) return false
    const roleStr = String(user.role || '')
    return roleStr.includes('manager') || roleStr.includes('admin')
  }, [user])

  const filteredLocks = useMemo(() => {
    return locks.filter(lock => {
      if (activeTab === 'manual') return lock.lock_type === LockType.Manual
      if (activeTab === 'active_timer') {
        return lock.lock_type === LockType.Timer && lock.timeout && new Date(lock.timeout) > new Date()
      }
      return true
    })
  }, [locks, activeTab])

  const hasMore = locks.length === PAGE_SIZE

  const getDurationString = (dateStr: string) => {
    const target = new Date(dateStr)
    const now = new Date()
    const diffMs = target.getTime() - now.getTime()
    const isExpired = diffMs < 0
    
    const absMs = Math.abs(diffMs)
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60))

    if (isExpired) return `Expired ${days > 0 ? days + 'd ' : ''}${hours}h ago`
    return `Ends in ${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m`
  }

  const handleCopy = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will immediately unlock any entity using this lock.")) return
    try {
      await lockService.deleteLock(id)
      refetch()
    } catch (e) {
      alert("Failed to delete lock. Ensure you are the creator.")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-primary-900 selection:text-white">
      
      <nav className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Flux" className="w-8 h-8 opacity-90" />
            <span className="font-bold text-neutral-200 tracking-tight">Home</span>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-neutral-800">
            <FaHome size={14} />
            <span>Home</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        <div className="relative mb-8">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-900/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">
                <span>Admin</span>
                <FaChevronRight size={8} />
                <span className="text-primary-500">Access Control</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                Manage Locks
              </h1>
              <p className="text-lg text-neutral-400 font-normal max-w-2xl">
                Create and manage security locks for Contests and Problems.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {!isManager && (
                <span className="text-xs font-mono text-amber-500 bg-amber-950/30 px-3 py-1.5 rounded-full border border-amber-900/50">
                  READ ONLY
                </span>
              )}
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                disabled={!isManager}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-primary-900/20 active:scale-95",
                  isManager 
                    ? "bg-primary-600 hover:bg-primary-500 text-white" 
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed opacity-50"
                )}
              >
                <FaPlus size={14} />
                <span>Create Lock</span>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800 mb-8" />

        <div className="flex flex-col gap-4 mb-8">
          
          <div className="relative flex items-center w-full bg-neutral-900 border border-neutral-800 rounded-xl focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/50 transition-all shadow-sm">
            <div className="pl-4 text-neutral-500"><FaSearch /></div>
            
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && refetch()}
              placeholder={searchType === 'name' ? "Search locks by name..." : "Paste Lock ID (UUID)..."}
              className="w-full px-4 py-3.5 bg-transparent border-none text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-0"
            />

            <div className="h-6 w-px bg-neutral-800 mx-2" />

            <div className="relative pr-2">
              <select
                value={searchType}
                onChange={(e) => {
                  setSearchType(e.target.value as 'name' | 'id')
                  setSearch('')
                }}
                className="bg-transparent text-sm font-medium text-neutral-400 hover:text-neutral-200 py-2 pl-2 pr-8 rounded-lg cursor-pointer focus:outline-none appearance-none"
              >
                <option value="name">Name</option>
                <option value="id">ID</option>
              </select>
              <FaSortDown className="absolute right-3 top-1/2 -translate-y-3/4 text-neutral-500 pointer-events-none" size={14} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <FaFilter size={10} /> Filters:
            </div>
            <div className="flex bg-neutral-900/50 p-1 rounded-lg border border-neutral-800">
              {(['all', 'manual', 'active_timer'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                    activeTab === tab 
                      ? "bg-neutral-800 text-white shadow-sm border border-neutral-700" 
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
                  )}
                >
                  {tab === 'active_timer' ? 'Active Timers' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl min-h-[400px]">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-6 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm">Synchronizing locks...</p>
            </div>
          ) : error ? (
            <div className="h-80 flex flex-col items-center justify-center text-center">
              <p className="text-red-400 font-medium mb-2">Unable to retrieve data</p>
              <p className="text-neutral-500 text-sm mb-4 max-w-md">{error}</p>
              <button onClick={() => refetch()} className="text-primary-400 hover:text-primary-300 underline text-sm">
                Retry Connection
              </button>
            </div>
          ) : filteredLocks.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center text-center">
              <div className="bg-neutral-800/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800/50">
                <FaSearch className="text-neutral-600 text-xl" />
              </div>
              <p className="text-lg font-medium text-neutral-300">No locks found</p>
              <p className="text-sm text-neutral-500 mt-1">
                {search ? `No results for "${search}"` : "Try creating a new lock."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    <th className="px-6 py-4 pl-8 w-1/4">Lock Entity</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 w-1/4">Duration / Status</th>
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4 pr-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredLocks.map((lock) => {
                    const isCreator = user?.id === lock.created_by
                    const isTimer = lock.lock_type === LockType.Timer
                    const canDelete = isCreator 

                    return (
                      <tr key={lock.lock_id} className="hover:bg-neutral-800/20 transition-colors group">
                        <td className="px-6 py-4 pl-8">
                          <div className="font-medium text-neutral-200 text-base">{lock.name}</div>
                          {lock.description && (
                            <div className="text-xs text-neutral-500 mt-1 truncate max-w-[200px]">
                              {lock.description}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4">
                          <LockStatusBadge lock={lock} />
                        </td>

                        <td className="px-6 py-4">
                          {isTimer && lock.timeout ? (
                            <div className="flex flex-col">
                              <span className={cn(
                                "text-sm font-medium",
                                new Date(lock.timeout) < new Date() ? "text-neutral-500" : "text-amber-400"
                              )}>
                                {formatDateTime(lock.timeout)}
                              </span>
                              <span className="text-[11px] text-neutral-500 mt-0.5 font-mono opacity-80">
                                {getDurationString(lock.timeout)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-neutral-500 text-center ml-[10%]">Indefinite</span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group/copy cursor-pointer w-fit" onClick={(e) => handleCopy(lock.lock_id, e)}>
                            <code className="bg-neutral-950 px-2 py-1.5 rounded text-xs font-mono text-neutral-400 border border-neutral-800 group-hover/copy:border-primary-900 group-hover/copy:text-primary-200 transition-colors">
                              {truncate(lock.lock_id, 12)}
                            </code>
                            <span className="text-neutral-600 group-hover/copy:text-primary-400 transition-colors">
                              {copiedId === lock.lock_id ? <FaCheck size={12} className="text-green-500" /> : <FaCopy size={12} />}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setSelectedLock(lock)
                                setIsEditModalOpen(true)
                              }} 
                              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                              title={isTimer ? "View Details" : "Edit Lock"}
                            >
                              {isTimer ? <FaEye size={14} /> : <FaPen size={14} />}
                            </button>
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(lock.lock_id)}
                                className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-all"
                                title="Delete Lock"
                              >
                                <FaTrash size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 px-1">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 bg-neutral-900/50 border border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>
          <span className="text-sm text-neutral-600 font-mono">Page {page}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore || loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-400 bg-neutral-900/50 border border-neutral-800 rounded-md hover:bg-neutral-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      </main>
      
      <CreateLockModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          refetch()
        }}
      />

      <EditLockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => refetch()}
        lock={selectedLock}
        currentUser={user}
      />
    </div>
  )
}
