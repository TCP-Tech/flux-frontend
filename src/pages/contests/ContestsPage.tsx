import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FaPlus, FaSearch, FaCalendarAlt, 
  FaLock, FaUsers, FaGlobe, FaClock 
} from 'react-icons/fa'
import { contestService } from '@/services/contest.service'
import { useApi } from '@/hooks/useApi'
import { cn, formatDateTime } from '@/lib/utils'
import CreateContestModal from '@/components/contests/CreateContestModal'

type FilterType = 'all' | 'live' | 'upcoming' | 'past';

const getContestStatus = (start?: string | null, end?: string) => {
  const now = new Date()
  const endTime = end ? new Date(end) : new Date()
  const startTime = start ? new Date(start) : null 

  if (now > endTime) return { label: 'ENDED', color: 'text-neutral-500 bg-neutral-900 border-neutral-800' }
  
  if (!startTime) return { label: 'TIMER BASED', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
  
  if (now < startTime) return { label: 'UPCOMING', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' }
  
  return { label: 'LIVE', color: 'text-green-500 bg-green-500/10 border-green-500/20 animate-pulse' }
}

export default function ContestsPage() {
  const navigate = useNavigate()
  
  const [isManager] = useState(true) 
  
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const fetchContests = useCallback(async () => {
    return contestService.searchContests({
      page_number: page,
      page_size: 20,
      title: search || undefined
    })
  }, [page, search])

  const { data: rawContests, loading, refetch } = useApi(fetchContests, [fetchContests])

  const filteredContests = useMemo(() => {
    if (!rawContests) return []
    const now = new Date()

    return rawContests.filter(c => {
        const end = new Date(c.end_time)
        const start = c.start_time ? new Date(c.start_time) : null
        
        if (filterType === 'past') return now > end
        if (filterType === 'upcoming') return start && now < start
        if (filterType === 'live') return (start && now >= start && now <= end) || (!start && now <= end)
        return true
    })
  }, [rawContests, filterType])

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 sm:p-8">
      
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8">
         <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600">
                Contests & Events
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
                Participate in rated rounds or virtual contests.
            </p>
         </div>
         {isManager && (
            <button 
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg active:scale-95 transition-all"
            >
                <FaPlus size={12} /> Host Contest
            </button>
         )}
      </div>

      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
             {/* Search */}
             <div className="relative flex-1 group">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input 
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-amber-500/50 outline-none"
                    placeholder="Search by contest title..."
                />
             </div>

             <div className="bg-neutral-900 p-1 rounded-xl flex">
                 {['all', 'live', 'upcoming', 'past'].map(f => (
                     <button
                        key={f}
                        onClick={() => setFilterType(f as FilterType)}
                        className={cn(
                            "px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all",
                            filterType === f 
                                ? "bg-amber-600 text-white shadow-md" 
                                : "text-neutral-500 hover:text-white"
                        )}
                     >
                         {f}
                     </button>
                 ))}
             </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         {loading ? (
             [...Array(6)].map((_, i) => (
                 <div key={i} className="h-56 bg-neutral-900/40 rounded-xl border border-neutral-800 animate-pulse" />
             ))
         ) : filteredContests.length === 0 ? (
             <div className="col-span-full py-20 text-center border-2 border-dashed border-neutral-800 rounded-xl text-neutral-500">
                 No contests match your filters.
             </div>
         ) : (
            filteredContests.map(c => {
                const status = getContestStatus(c.start_time, c.end_time)
                return (
                    <div 
                        key={c.contest_id} 
                        className="group bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden hover:border-amber-500/40 hover:bg-neutral-900 cursor-pointer transition-all flex flex-col"
                        onClick={() => navigate(`/contests/${c.contest_id}`)}
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border", status.color)}>
                                    {status.label}
                                </span>
                                {c.lock_id && <FaLock className="text-amber-500/60" size={10} />}
                            </div>
                            
                            <h3 className="text-lg font-bold text-neutral-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                                {c.title}
                            </h3>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <FaCalendarAlt /> 
                                    <span>{c.start_time ? formatDateTime(c.start_time) : 'Timer Triggered'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <FaClock />
                                    <span>Ends: {formatDateTime(c.end_time)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/20 border-t border-neutral-800/50 px-6 py-3 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                             <div className="flex gap-3">
                                <span className="flex items-center gap-1"><FaUsers size={10}/> -</span>
                                <span className="flex items-center gap-1"><FaGlobe size={10}/> {c.is_published ? 'Pub' : 'Draft'}</span>
                             </div>
                        </div>
                    </div>
                )
            })
         )}
      </div>
      
      <div className="max-w-7xl mx-auto mt-6 flex justify-between items-center">
         <button onClick={() => setPage(p=>Math.max(1, p-1))} disabled={page===1} className="text-sm text-neutral-400 hover:text-white disabled:opacity-50">← Previous</button>
         <span className="text-xs font-mono text-neutral-600">Page {page}</span>
         <button onClick={() => setPage(p=>p+1)} className="text-sm text-neutral-400 hover:text-white">Next →</button>
      </div>

      <CreateContestModal 
         isOpen={isCreateOpen}
         onClose={() => setIsCreateOpen(false)}
         onSuccess={() => { refetch(); setIsCreateOpen(false); }}
      />
    </div>
  )
}
