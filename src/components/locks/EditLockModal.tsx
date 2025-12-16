import { useState, useEffect } from 'react'
import { FaTimes, FaCopy, FaCheck, FaLock, FaClock, FaUserCircle, FaFingerprint } from 'react-icons/fa'
import { lockService } from '@/services/lock.service'
import { Lock, LockType } from '@/types/lock.types'
import { User } from '@/types/api.types'
import { getErrorMessage } from '@/config/axios'
import { cn, formatDateTime, getRelativeTime, truncate } from '@/lib/utils'

interface EditLockModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  lock: Lock | null
  currentUser: User | null
}

export default function EditLockModal({ isOpen, onClose, onSuccess, lock, currentUser }: EditLockModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (lock) {
      setName(lock.name)
      setDescription(lock.description)
      setError(null)
      setLoading(false) 
      setCopied(false)
    }
  }, [lock, isOpen])

  if (!isOpen || !lock) return null

  const isTimer = lock.lock_type === LockType.Timer
  const isCreator = currentUser?.id === lock.created_by
  const canEdit = !isTimer && isCreator
  const canDelete = isCreator 

  const handleCopy = () => {
    navigator.clipboard.writeText(lock.lock_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    const warning = isTimer 
      ? "⚠️ DANGER: Deleting a Timer Lock while a contest is live will expose the problems immediately. Are you sure?"
      : "Are you sure? This will immediately unlock any problem or contest using this lock."

    if (!confirm(warning)) return
    
    setLoading(true)
    setError(null)
    try {
      await lockService.deleteLock(lock.lock_id)
      onSuccess()
      onClose()
    } catch (err) {
      setError("Failed to delete lock. " + getErrorMessage(err))
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canEdit) return

    setLoading(true)
    setError(null)
    try {
      await lockService.updateLock({
        lock_id: lock.lock_id,
        name,
        description,
        lock_type: lock.lock_type,
        timeout: null
      })
      onSuccess()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  if (isTimer) {
    const isExpired = lock.timeout && new Date(lock.timeout) < new Date()
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-neutral-950/90 border border-neutral-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative">
          
          <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", isExpired ? "from-neutral-700 to-neutral-800" : "from-amber-600 to-amber-400")} />

          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              {lock.name}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors">
              <FaTimes />
            </button>
          </div>

          <div className="px-6 pb-6">
             <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
               <FaUserCircle /> Created by: 
               <span className={cn(isCreator ? "text-primary-400" : "text-neutral-300")}>
                 {isCreator ? "You" : lock.created_by}
               </span>
             </div>
          </div>

          <div className="px-6 py-2">
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />
               
               <div className="flex justify-between items-start relative z-10">
                 <div>
                   <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Status</p>
                   <div className={cn("flex items-center gap-2 font-bold", isExpired ? "text-neutral-400" : "text-amber-400")}>
                      {isExpired ? <FaCheck size={14} /> : <FaClock size={14} className="animate-pulse" />}
                      <span>{isExpired ? "UNLOCKED" : "LOCKED"}</span>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">
                     {isExpired ? "Expired" : "Unlocks In"}
                   </p>
                   <p className={cn("text-lg font-mono font-medium", isExpired ? "text-neutral-400" : "text-white")}>
                     {lock.timeout ? getRelativeTime(lock.timeout).replace('in ', '') : 'Indefinite'}
                   </p>
                 </div>
               </div>
               
               {lock.timeout && (
                 <div className="mt-3 pt-3 border-t border-neutral-800/50 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                   <span>Exact:</span> {formatDateTime(lock.timeout)}
                 </div>
               )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="group relative">
               <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 block ml-1">Lock UUID</label>
               <div className="flex items-center justify-between bg-black/40 border border-neutral-800 rounded-lg px-3 py-2.5 group-hover:border-neutral-700 transition-colors cursor-pointer" onClick={handleCopy}>
                  <code className="text-xs text-neutral-300 font-mono tracking-wide">{lock.lock_id}</code>
                  <span className={cn("text-xs transition-colors", copied ? "text-green-400" : "text-neutral-600 group-hover:text-white")}>
                    {copied ? <FaCheck /> : <FaCopy />}
                  </span>
               </div>
            </div>

            <div>
               <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1.5 block ml-1">Notes</label>
               <p className="text-sm text-neutral-300 leading-relaxed bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/50">
                 {lock.description || <span className="text-neutral-600 italic">No description provided.</span>}
               </p>
            </div>
          </div>

          <div className="p-5 mt-auto bg-neutral-900/30 border-t border-neutral-800/50 flex justify-between gap-3">
             <div className="flex-1 flex items-center text-xs text-neutral-500 italic">
               <FaLock className="mr-1.5 opacity-50" /> Read-only Timer
             </div>
             
             {canDelete && (
              <button 
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 border border-red-900/20 text-red-400/80 hover:text-red-400 rounded-lg hover:bg-red-950/20 transition-all text-xs font-medium uppercase tracking-wide"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-400" />

        <div className="flex items-center justify-between p-6 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Edit Configuration
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <FaTimes />
          </button>
        </div>
        
        <div className="px-6 pb-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
            <FaFingerprint /> Managed by: 
            <span className={cn(isCreator ? "text-primary-400" : "text-neutral-300")}>
                {isCreator ? "You" : lock.created_by}
            </span>
            </div>
        </div>

        <form onSubmit={handleUpdate} className="p-6 pt-2 space-y-6">
          
          <div className="group relative" onClick={handleCopy}>
            <div className="absolute inset-0 bg-primary-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between border border-dashed border-neutral-700 group-hover:border-primary-500/50 rounded-lg px-3 py-2.5 cursor-pointer transition-colors">
            <code className="text-xs text-neutral-400 font-mono">{truncate(lock.lock_id, 35)}</code>
            <span className={cn("text-xs", copied ? "text-green-400" : "text-neutral-500")}>
                {copied ? "Copied" : "Copy ID"}
            </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Lock Name</label>
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-neutral-600"
                placeholder="Name this lock..."
                disabled={!canEdit}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder-neutral-600"
                placeholder="Add context (optional)..."
                disabled={!canEdit}
              />
            </div>
          </div>

          {error && <div className="text-red-400 text-xs p-3 bg-red-950/20 rounded-lg border border-red-900/30 flex gap-2 items-center"><FaExclamationTriangle /> {error}</div>}

          <div className="pt-4 flex items-center justify-between gap-4">
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={loading || !canDelete}
              className="px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition-all text-sm font-medium disabled:opacity-50"
            >
              Delete
            </button>

            {canEdit ? (
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-neutral-100 hover:bg-white text-black rounded-lg transition-all text-sm font-bold shadow-lg shadow-white/5 disabled:opacity-70"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <span className="text-xs text-neutral-500 ml-auto italic px-4">View Only Access</span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
