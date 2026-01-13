import { useState, useEffect } from 'react'
import { lockService } from '@/services/lock.service'
import { Lock } from '@/types/lock.types'
import { FaSearch, FaLock, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { cn, formatDateTime } from '@/lib/utils'

interface Props {
  selectedId: string | null
  onSelect: (lock: Lock | null) => void 
}

export default function LockPicker({ selectedId, onSelect }: Props) {
  const [locks, setLocks] = useState<Lock[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchLocks(), 300)
    return () => clearTimeout(timeoutId)
  }, [search])

  const fetchLocks = async () => {
    setLoading(true)
    try {
        const res = await lockService.searchLocks({ 
            lock_name: search || undefined, 
            page_number: 1, 
            page_size: 20 
        })
        setLocks(res)
    } catch(e) {
        console.error("Failed to load locks")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-60">
        <div className="p-3 border-b border-neutral-800 flex items-center gap-2 bg-neutral-900/50">
            <FaSearch className="text-neutral-500 text-xs" />
            <input 
                className="bg-transparent border-none text-xs text-white placeholder-neutral-600 focus:outline-none flex-1"
                placeholder="Search locks by name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
            {loading && <FaSpinner className="animate-spin text-neutral-500 text-xs"/>}
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {locks.map(lock => {
                const isSelected = selectedId === lock.lock_id
                const isTimer = lock.lock_type === 'timer'
                return (
                    <button 
                        key={lock.lock_id}
                        type="button" 
                        // CHANGE: Pass lock object
                        onClick={() => onSelect(lock)}
                        className={cn(
                            "w-full text-left p-3 rounded-lg border flex justify-between items-center transition-all group",
                            isSelected 
                                ? "bg-amber-500/10 border-amber-500/50" 
                                : "bg-neutral-900 border-transparent hover:border-neutral-700"
                        )}
                    >
                        <div>
                            <div className={cn("text-xs font-bold", isSelected ? "text-amber-500" : "text-neutral-300")}>
                                {lock.name}
                            </div>
                            <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                                {isTimer ? <FaClock size={8}/> : <FaLock size={8}/>}
                                <span className="font-mono">{isTimer && lock.timeout ? `Until: ${formatDateTime(lock.timeout)}` : 'Manual'}</span>
                            </div>
                        </div>
                        {isSelected && <FaCheckCircle className="text-amber-500" />}
                    </button>
                )
            })}
        </div>
    </div>
  )
}
