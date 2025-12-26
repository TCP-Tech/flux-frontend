import { useState, useEffect } from 'react'
import { FaTimes, FaLock, FaClock, FaInfoCircle, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa'
import { lockService } from '@/services/lock.service'
import { LockType } from '@/types/lock.types'
import { getErrorMessage } from '@/config/axios'
import { cn } from '@/lib/utils'

interface CreateLockModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateLockModal({ isOpen, onClose, onSuccess }: CreateLockModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<LockType>(LockType.Manual)
  const [timeout, setTimeoutVal] = useState('')
  const [minDate, setMinDate] = useState('')

  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      const localIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
      setMinDate(localIso)
    }
  }, [isOpen])

  if (!isOpen) return null

  const setTimePreset = (hours: number) => {
    const date = new Date()
    date.setHours(date.getHours() + hours)
    const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    setTimeoutVal(localIso)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (type === LockType.Timer) {
        if (!timeout) throw new Error("Please select an unlock time.")
        if (new Date(timeout) <= new Date()) throw new Error("Time must be in the future.")
      }

      await lockService.createLock({
        name,
        description,
        lock_type: type,
        timeout: type === LockType.Timer ? new Date(timeout).toISOString() : null
      })

      setName('')
      setDescription('')
      setType(LockType.Manual)
      setTimeoutVal('')
      onSuccess()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const isTimer = type === LockType.Timer

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative max-h-[90vh]">
        
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-colors duration-500", 
          isTimer ? "from-amber-600 to-amber-400" : "from-blue-600 to-blue-400"
        )} />

        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 ml-[13%]">
              Create Lock
            </h2>
            <p className="text-xs text-neutral-400 mt-1 ml-7">Configure security & access rules.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setType(LockType.Manual)}
              className={cn(
                "relative group flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                !isTimer
                  ? "bg-blue-950/10 border-blue-600/40 shadow-[0_0_15px_rgba(37,99,235,0.1)]"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              )}
            >
              <div className={cn(
                "mb-3 p-2 rounded-lg transition-colors",
                !isTimer ? "bg-blue-500 text-white" : "bg-neutral-800 text-neutral-400 group-hover:text-neutral-300"
              )}>
                <FaLock className="text-sm" />
              </div>
              <span className={cn("font-bold text-sm block", !isTimer ? "text-blue-400" : "text-neutral-300")}>
                Manual Lock
              </span>
              <p className="text-[10px] mt-1 text-neutral-500 leading-tight">
                Stays locked indefinitely until you remove it.
              </p>
              
              <div className={cn(
                "absolute top-3 right-3 w-3 h-3 rounded-full border-2",
                !isTimer ? "border-blue-500 bg-blue-500" : "border-neutral-700"
              )} />
            </button>

            <button
              type="button"
              onClick={() => setType(LockType.Timer)}
              className={cn(
                "relative group flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left",
                isTimer
                  ? "bg-amber-950/10 border-amber-600/40 shadow-[0_0_15px_rgba(217,119,6,0.1)]"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              )}
            >
              <div className={cn(
                "mb-3 p-2 rounded-lg transition-colors",
                isTimer ? "bg-amber-500 text-white" : "bg-neutral-800 text-neutral-400 group-hover:text-neutral-300"
              )}>
                <FaClock className="text-sm" />
              </div>
              <span className={cn("font-bold text-sm block", isTimer ? "text-amber-400" : "text-neutral-300")}>
                Timer Lock
              </span>
              <p className="text-[10px] mt-1 text-neutral-500 leading-tight">
                Automatically opens at a specific time.
              </p>

              <div className={cn(
                "absolute top-3 right-3 w-3 h-3 rounded-full border-2",
                isTimer ? "border-amber-500 bg-amber-500" : "border-neutral-700"
              )} />
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
                Identifier Name
              </label>
              <input
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekly Contest 45"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-neutral-600"
              />
            </div>

            {isTimer && (
              <div className="animate-in slide-in-from-top-2 duration-300 fade-in">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-xs font-bold text-amber-500 uppercase tracking-wider">
                    <FaCalendarAlt className="inline mr-1 mb-0.5" /> Unlock Date
                  </label>
                </div>
                
                <div className="relative group">
                  <input
                    required
                    type="datetime-local"
                    value={timeout}
                    min={minDate}
                    onChange={(e) => setTimeoutVal(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all [color-scheme:dark] cursor-pointer"
                  />
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 self-center mr-1">Quick Add:</span>
                  {[
                    { label: '+1h', val: 1 },
                    { label: '+3h', val: 3 },
                    { label: '+24h', val: 24 },
                    { label: '+7d', val: 168 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setTimePreset(preset.val)}
                      className="px-2.5 py-1 text-xs font-medium bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-md hover:text-amber-400 hover:border-amber-500/30 hover:bg-amber-950/20 transition-all active:scale-95"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5 ml-1">
                Description <span className="text-neutral-700 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add context for other admins..."
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none placeholder-neutral-600"
              />
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4 flex gap-3 items-start">
            <FaInfoCircle className={cn("shrink-0 mt-0.5 text-sm", isTimer ? "text-amber-500" : "text-blue-500")} />
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isTimer 
                ? <span className="text-amber-200/80">Timer locks <b className="text-amber-100">cannot be deleted</b> or paused once created to ensure integrity. The content will auto-unlock at the specified time.</span>
                : <span className="text-blue-200/80">Manual locks are flexible. You can update the description or delete them at any time to unlock the content manually.</span>
              }
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-xs font-medium flex items-center gap-2">
              <FaShieldAlt className="shrink-0" /> {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-neutral-800 text-neutral-400 font-medium rounded-xl hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex-1 px-6 py-2.5 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95",
                isTimer 
                  ? "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20"
                  : "bg-primary-600 hover:bg-primary-500 shadow-primary-900/20",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Create Lock'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
