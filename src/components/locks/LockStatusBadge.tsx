import { FaFingerprint, FaHistory } from 'react-icons/fa'
import { Lock, LockType } from '@/types/lock.types'
// import { cn } from '@/lib/utils'

interface LockStatusBadgeProps {
  lock: Lock
}

export function LockStatusBadge({ lock }: LockStatusBadgeProps) {
  const isTimer = lock.lock_type === LockType.Timer
  const isExpired = isTimer && lock.timeout && new Date(lock.timeout) < new Date()

  if (!isTimer) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/30 transition-colors">
        <FaFingerprint className="text-[10px] opacity-80" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">Manual</span>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-800/40 border border-neutral-700 text-neutral-500">
        <FaHistory className="text-[10px]" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Expired</span>
      </div>
    )
  }

  return (
    <div className="relative inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:border-amber-500/40 transition-colors">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      
      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Timer</span>
    </div>
  )
}
