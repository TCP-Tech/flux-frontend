import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaSearch, FaLock, FaRobot, FaExclamationTriangle } from 'react-icons/fa'
import { problemService } from '@/services/problem.service'
import { useApi } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import CreateProblemModal from '@/components/problems/CreateProblemModal'

const getDifficultyColor = (diff: number) => {
  if (diff < 1200) return 'text-green-400 bg-green-400/10 border-green-400/20'
  if (diff < 1600) return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
  if (diff < 2000) return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  if (diff < 2400) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-red-500 bg-red-500/10 border-red-500/20'
}

export default function ProblemList() {
  const [page, setPage] = useState(1) // Used in Pagination
  const [search, setSearch] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const navigate = useNavigate()

  const fetchProblems = useCallback(async () => {
    return problemService.searchProblems({
      page_number: page,
      page_size: 20,
      title: search || undefined
    })
  }, [page, search])

  const { data: problems, loading, error, refetch } = useApi(fetchProblems, [fetchProblems])

  return (
    <div className="min-h-screen bg-neutral-950 p-6 md:p-8 text-neutral-50 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">Problem Archive</h1>
            <p className="text-neutral-400 mt-2 text-sm">Browse and manage competitive programming challenges.</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-900/20 active:scale-95"
          >
            <FaPlus size={12} /> New Problem
          </button>
        </div>

        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-white transition-colors" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} // Reset page on search
            placeholder="Search problems by title..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3.5 pl-12 pr-4 text-neutral-200 focus:outline-none focus:border-primary-500/50 transition-all placeholder-neutral-600"
          />
        </div>

        <div className="space-y-4">
          
          {error && (
            <div className="bg-red-950/20 border border-red-900/30 p-6 rounded-xl text-center">
              <FaExclamationTriangle className="mx-auto text-red-500 mb-2 text-xl" />
              <h3 className="text-red-400 font-bold">Failed to load problems</h3>
              <p className="text-red-400/60 text-sm mb-4">{error}</p>
              <button onClick={() => refetch()} className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg text-sm font-bold transition-colors">
                Retry Connection
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-4 animate-pulse">
                {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-neutral-900/40 rounded-xl border border-neutral-800" />)}
            </div>
          ) : !error && problems?.length === 0 ? (
            <div className="text-center py-24 bg-neutral-900/20 rounded-xl border border-dashed border-neutral-800 text-neutral-500">
              <div className="text-lg">No problems found.</div>
              <div className="text-xs opacity-50 mt-1">Try creating one or adjust your search.</div>
            </div>
          ) : (
            <div className="grid gap-3">
               {problems?.map((prob) => (
                  <div 
                    key={prob.id}
                    onClick={() => navigate(`/problems/${prob.id}`)}
                    className="group flex items-center justify-between p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl hover:border-primary-500/30 hover:bg-neutral-900/80 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-mono text-neutral-600 w-12 text-sm text-right">#{prob.id}</span>
                      
                      <div>
                        <h3 className="font-bold text-neutral-200 group-hover:text-primary-400 transition-colors text-lg">
                          {prob.title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider", getDifficultyColor(prob.difficulty))}>
                            {prob.difficulty}
                          </span>
                          
                          {prob.lock_id && (
                            <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">
                              <FaLock size={8} /> 
                              {prob.lock_timeout ? 'Timed' : 'Locked'}
                            </span>
                          )}
                          
                          {prob.evaluator === 'codeforces' && (
                            <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 bg-blue-950/30 px-2 py-0.5 rounded border border-blue-900/30">
                              <FaRobot size={9} /> Bot
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                       <button 
                          onClick={(e) => {
                             e.stopPropagation() // Prevent card click
                             navigate(`/problems/${prob.id}/edit`)
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors border border-transparent hover:border-neutral-700"
                        >
                          Edit Details
                       </button>
                    </div>
                  </div>
               ))}
            </div>
          )}
        </div>
        
        {!loading && !error && (
            <div className="flex items-center justify-between border-t border-neutral-800 pt-6">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="text-sm font-bold text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    ← Previous
                </button>
                <span className="text-xs font-mono text-neutral-600 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                    Page {page}
                </span>
                <button 
                    onClick={() => setPage(p => p + 1)}
                    disabled={!problems || problems.length < 20}
                    className="text-sm font-bold text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        )}
      </div>

      <CreateProblemModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()} // Refresh list on create
      />
    </div>
  )
}
