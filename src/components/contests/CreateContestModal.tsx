import { useState, useEffect } from 'react'
import { FaTimes, FaSearch, FaTrash, FaCheckCircle, FaExclamationCircle, FaPlus, FaSpinner, FaClock, FaLock } from 'react-icons/fa'
import { useContestWizard } from '@/hooks/useContestWizard'
import { problemService } from '@/services/problem.service'
import { Problem } from '@/types/problem.types'
import { cn, toLocalISOString } from '@/lib/utils'
import LockPicker from './LockPicker'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CreateContestModal({ isOpen, onClose, onSuccess }: Props) {
  // FIX: Added 'canProceed' to destructuring
  const { state, actions, canProceed } = useContestWizard()
  
  // Local Search state for problems
  const [problemSearch, setProblemSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Problem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Auto fetch logic for Step 2
  useEffect(() => {
    if (state.step === 'PROBLEMS') {
        const timeout = setTimeout(() => performSearch(), 100)
        return () => clearTimeout(timeout)
    }
  }, [state.step])

  const performSearch = async () => {
     setIsSearching(true)
     setSearchError(null)
     try {
         const res = await problemService.searchProblems({ 
             title: problemSearch || undefined, 
             page_number: 1, 
             page_size: 50 
         })
         
         if (Array.isArray(res)) setSearchResults(res)
         else setSearchResults(Object.values(res || {}))
     } catch (e) {
         setSearchError("Failed to load problems.")
     } finally {
         setIsSearching(false)
     }
  }

  const handleSubmit = async () => {
      const ok = await actions.submit()
      if(ok) setTimeout(() => { onSuccess(); onClose(); }, 1500)
  }

  if (!isOpen) return null

  // --- Success View ---
  if (state.step === 'SUCCESS') {
      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur p-4 animate-in fade-in">
              <div className="bg-neutral-900 border border-green-500/30 p-8 rounded-2xl text-center shadow-2xl scale-100 transform transition-all">
                  <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4 animate-bounce" />
                  <h2 className="text-xl font-bold text-white">Contest Created!</h2>
                  <p className="text-neutral-400 mt-2 text-sm">Redirecting to archive...</p>
              </div>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col h-[85vh] shadow-2xl">
        
        {/* Header Steps */}
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
            <div className="flex gap-4 items-center overflow-x-auto">
                {['CONFIG', 'PROBLEMS', 'USERS', 'REVIEW'].map((s, idx) => (
                    <div key={s} className="flex items-center gap-2 shrink-0">
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all",
                            state.step === s ? "bg-amber-500 text-black scale-110 shadow-lg" : 
                            (['CONFIG', 'PROBLEMS', 'USERS', 'REVIEW'].indexOf(state.step) > idx) ? "bg-green-600 text-white" : "bg-neutral-800 text-neutral-500"
                        )}>
                            {idx + 1}
                        </div>
                        <span className={cn("text-xs font-bold uppercase tracking-wider transition-colors", state.step === s ? "text-white" : "text-neutral-600 hidden md:block")}>
                            {s}
                        </span>
                        {idx < 3 && <div className="w-8 h-px bg-neutral-800 hidden md:block"/>}
                    </div>
                ))}
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-white p-2 hover:bg-neutral-800 rounded-full transition-all"><FaTimes /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative bg-[#0a0a0a]">
            
            {state.error && (
                <div className="sticky top-0 z-10 mb-6 bg-red-950/90 backdrop-blur border border-red-900/50 p-4 rounded-xl text-red-300 text-sm flex gap-3 items-center shadow-lg animate-in slide-in-from-top-2">
                    <FaExclamationCircle className="shrink-0 text-red-500" /> {state.error}
                </div>
            )}

            {/* STEP 1: CONFIG */}
            {state.step === 'CONFIG' && (
                <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Contest Title</label>
                        <input 
                            value={state.config.title} onChange={e => actions.updateConfig('title', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all font-bold text-lg placeholder-neutral-700"
                            placeholder="e.g. Winter Cup 2025" autoFocus
                        />
                    </div>
                    
                    {/* Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-900/30 p-6 rounded-2xl border border-neutral-800">
                         {/* Start Time */}
                         <div>
                             <div className="flex justify-between mb-3 items-center">
                                <label className="block text-xs font-bold text-neutral-500 uppercase">Start Time</label>
                                {!state.config.isPublished && (
                                    <button 
                                        type="button" 
                                        className="text-[10px] bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-amber-500 hover:text-amber-400 hover:border-amber-500/30 transition-all" 
                                        onClick={actions.toggleTimerMode}
                                    >
                                        {state.config.isTimerBased ? 'Switch to Manual' : 'Use Lock Timer'}
                                    </button>
                                )}
                             </div>
                             
                             {(state.config.isTimerBased || state.config.isPublished) ? (
                                 <div className="h-[46px] w-full bg-neutral-950 border border-dashed border-neutral-700 rounded-xl flex items-center justify-center text-neutral-500 text-xs gap-2 select-none cursor-not-allowed">
                                     <FaClock /> Controlled by Lock
                                 </div>
                             ) : (
                                <input 
                                    type="datetime-local" 
                                    value={state.config.startTime} 
                                    onChange={e => actions.updateConfig('startTime', e.target.value)}
                                    min={toLocalISOString(new Date())}
                                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none [color-scheme:dark]"
                                />
                             )}
                         </div>

                         {/* End Time */}
                         <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase mb-3">End Time</label>
                            <input 
                                type="datetime-local" 
                                value={state.config.endTime} 
                                onChange={e => actions.updateConfig('endTime', e.target.value)}
                                min={(!state.config.isTimerBased && state.config.startTime) ? state.config.startTime : toLocalISOString(new Date())}
                                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none [color-scheme:dark]"
                            />
                         </div>
                    </div>

                    {/* Integrated Lock Picker */}
                    <div>
                        <div className="flex justify-between items-center mb-2 px-1">
                             <label className="block text-xs font-bold text-neutral-500 uppercase">Access Control <span className="font-normal normal-case opacity-50 ml-1">(Required for Public/Timer)</span></label>
                             <div className={cn("text-[10px] font-mono uppercase font-bold", state.config.lockId ? "text-green-500" : "text-neutral-600")}>
                                 {state.config.lockId ? 'Selected' : 'None'}
                             </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            {state.config.lockId ? (
                                <div className="w-full md:w-[140px] shrink-0 h-[60px] bg-green-900/10 border border-green-500/30 rounded-xl flex flex-col justify-center items-center relative group transition-all">
                                     <FaLock className="text-green-500 mb-1" size={14}/>
                                     <span className="text-[10px] text-green-200/70 font-mono">Active</span>
                                     <button 
                                        onClick={() => actions.updateConfig('lockId', '')} 
                                        className="absolute inset-0 bg-red-950/90 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl text-xs font-bold cursor-pointer"
                                     >
                                         Remove
                                     </button>
                                </div>
                            ) : (
                                <div className="w-full md:w-[140px] shrink-0 h-[60px] bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl flex flex-col justify-center items-center text-neutral-600">
                                    <div className="text-xs">No Lock</div>
                                </div>
                            )}
                            
                            <div className="flex-1">
                                <LockPicker 
                                    selectedId={state.config.lockId}
                                    onSelect={(lock) => actions.selectLock(lock)}
                                />
                            </div>
                        </div>
                    </div>

                    <label className="flex items-center gap-4 bg-neutral-900 p-4 rounded-xl border border-neutral-800 cursor-pointer hover:bg-neutral-800 hover:border-neutral-700 transition-all group">
                        <div className="relative">
                            <input 
                                type="checkbox" checked={state.config.isPublished} 
                                onChange={e => {
                                    // FORCE Timer mode visually if published
                                    const isPub = e.target.checked
                                    actions.updateConfig('isPublished', isPub)
                                    // If becoming public and NOT timer based yet, force toggle
                                    if (isPub && !state.config.isTimerBased) {
                                        actions.toggleTimerMode()
                                    }
                                }}
                                className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 shadow-inner"></div>
                        </div>
                        <div>
                            <span className="text-sm font-bold text-white block group-hover:text-green-400 transition-colors">Publish immediately?</span>
                            <span className="text-xs text-neutral-500">
                                {state.config.isPublished 
                                    ? "Contest start time will be controlled by the Lock Expiry." 
                                    : "Contest will be saved as Draft and hidden."}
                            </span>
                        </div>
                    </label>
                </div>
            )}

            {/* STEP 2: PROBLEMS */}
            {state.step === 'PROBLEMS' && (
                <div className="flex h-full gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="w-1/2 flex flex-col border border-neutral-800 rounded-xl bg-neutral-900/20 overflow-hidden">
                        <div className="p-4 border-b border-neutral-800 flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    value={problemSearch} onChange={e => setProblemSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && performSearch()}
                                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-blue-500/50 outline-none"
                                    placeholder="Search DB by title..."
                                    autoFocus
                                />
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600" />
                            </div>
                            <button onClick={performSearch} className="bg-blue-600/90 hover:bg-blue-500 text-white px-5 rounded-lg font-bold text-xs">
                                {isSearching ? <FaSpinner className="animate-spin" /> : 'Find'}
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                             {isSearching ? <div className="py-12 text-center text-neutral-600 text-xs">Searching...</div> : 
                              searchError ? <div className="py-12 text-center text-red-400 text-xs">{searchError}</div> :
                             searchResults.map(p => (
                                 <div key={p.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex justify-between items-center group hover:border-blue-500/40 hover:bg-neutral-800 cursor-pointer" onClick={() => actions.addProblem(p)}>
                                     <div className="min-w-0">
                                         <div className="text-[10px] text-neutral-500 font-mono mb-0.5">#{p.id} • Diff: {p.difficulty}</div>
                                         <div className="text-sm font-bold text-neutral-300 truncate">{p.title}</div>
                                     </div>
                                     <FaPlus className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="w-1/2 flex flex-col border border-neutral-800 rounded-xl bg-neutral-900/50">
                        <div className="p-4 border-b border-neutral-800 bg-neutral-900 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Cart</h3>
                            <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{state.selectedProblems.length} Items</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                             {state.selectedProblems.map((p, i) => (
                                 <div key={p.meta.id} className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex gap-3 items-center animate-in slide-in-from-right-2">
                                     <div className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 flex items-center justify-center text-xs font-bold shrink-0">{String.fromCharCode(65 + i)}</div>
                                     <div className="flex-1 min-w-0">
                                         <div className="text-sm font-bold text-neutral-200 truncate">{p.meta.title}</div>
                                     </div>
                                     <div className="flex items-center gap-1 bg-black rounded border border-neutral-800">
                                         <span className="text-[10px] text-neutral-500 pl-2">pts</span>
                                         <input 
                                             type="number" value={p.customScore}
                                             onChange={(e) => actions.updateScore(p.meta.id, Number(e.target.value))}
                                             className="w-12 bg-transparent p-1.5 text-xs text-right font-mono focus:outline-none text-amber-500 font-bold"
                                         />
                                     </div>
                                     <button onClick={() => actions.removeProblem(p.meta.id)} className="text-neutral-600 hover:text-red-400 hover:bg-red-950/20 p-2 rounded transition-colors"><FaTrash size={12} /></button>
                                 </div>
                             ))}
                             {state.selectedProblems.length === 0 && (
                                 <div className="h-full flex flex-col items-center justify-center text-neutral-600 text-sm italic">
                                     <span>Your cart is empty.</span>
                                     <span className="text-xs opacity-50 mt-1">Select problems from the left list.</span>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 3: USERS */}
            {state.step === 'USERS' && (
                <div className="max-w-xl mx-auto h-full flex flex-col animate-in slide-in-from-right-4 fade-in">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-3 pl-1">Authorized Participants (CSV)</label>
                    <div className="relative flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden focus-within:border-amber-500/50 transition-colors">
                        <textarea 
                            className="w-full h-full bg-transparent p-5 font-mono text-sm leading-7 text-neutral-300 focus:outline-none resize-none placeholder-neutral-700"
                            placeholder="user1, user2, user3..."
                            onChange={e => actions.setUsers(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                            defaultValue={state.userNames.join(', ')}
                        />
                    </div>
                    <div className="mt-4 flex gap-2 items-start bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg text-blue-400/80">
                         <FaExclamationCircle className="shrink-0 mt-0.5 text-xs"/>
                         <p className="text-[10px]">Note: Public contests do not require manual user entry. Users can register themselves. Use this list for private exams only.</p>
                    </div>
                </div>
            )}

            {/* STEP 4: REVIEW */}
            {state.step === 'REVIEW' && (
                <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 fade-in duration-300">
                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl">
                         <div className="text-[10px] font-bold text-amber-600 uppercase mb-2 tracking-widest">Final Review</div>
                         <h1 className="text-3xl font-extrabold text-white mb-6">{state.config.title}</h1>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                             <div><span className="text-neutral-500 block text-xs font-bold uppercase mb-1">Starts</span>
                                 {(state.config.isTimerBased || state.config.isPublished) 
                                     ? <span className="text-amber-500 font-mono">Lock Trigger</span>
                                     : new Date(state.config.startTime).toLocaleString()}
                             </div>
                             <div><span className="text-neutral-500 block text-xs font-bold uppercase mb-1">Ends</span> {new Date(state.config.endTime).toLocaleString()}</div>
                             <div><span className="text-neutral-500 block text-xs font-bold uppercase mb-1">Status</span> {state.config.isPublished ? <span className="text-green-400 font-bold">Public</span> : <span className="text-yellow-500 font-bold">Draft</span>}</div>
                             <div><span className="text-neutral-500 block text-xs font-bold uppercase mb-1">Access</span> {state.config.lockId ? 'Locked' : 'Open'}</div>
                         </div>
                    </div>
                    
                    <div className="space-y-3">
                         <div className="flex justify-between items-end border-b border-neutral-800 pb-2">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase">Problem Set</h3>
                            <span className="text-xs font-mono text-neutral-400">Total Score: {state.selectedProblems.reduce((a,b) => a+b.customScore, 0)}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                             {state.selectedProblems.map((p, i) => (
                                 <div key={i} className="flex justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-lg items-center">
                                     <span className="text-sm font-medium text-neutral-300"><span className="text-neutral-600 mr-2">{String.fromCharCode(65 + i)}</span> {p.meta.title}</span>
                                     <span className="font-mono text-xs bg-neutral-950 border border-neutral-800 px-1.5 py-0.5 rounded text-amber-500">{p.customScore}</span>
                                 </div>
                             ))}
                             {state.selectedProblems.length === 0 && <div className="text-neutral-600 text-sm italic col-span-2">No problems selected.</div>}
                         </div>
                     </div>

                     <div className="space-y-3">
                         <div className="flex justify-between items-end border-b border-neutral-800 pb-2">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase">Registered Users</h3>
                            <span className="text-xs font-mono text-neutral-400">{state.userNames.length} Users</span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                             {state.userNames.slice(0, 10).map((u, i) => (
                                 <span key={i} className="text-xs bg-neutral-900 text-neutral-300 px-2 py-1 rounded border border-neutral-800">{u}</span>
                             ))}
                             {state.userNames.length > 10 && <span className="text-xs text-neutral-500 italic flex items-center">+{state.userNames.length - 10} more</span>}
                             {state.userNames.length === 0 && <span className="text-neutral-600 text-sm italic">Open registration / No private users.</span>}
                         </div>
                     </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/80 flex justify-between items-center">
            <button 
                onClick={state.step === 'CONFIG' ? onClose : actions.back}
                className="px-6 py-2.5 rounded-xl text-neutral-400 hover:text-white font-bold hover:bg-neutral-800 transition-colors"
            >
                {state.step === 'CONFIG' ? 'Cancel' : 'Back'}
            </button>

            <button 
                onClick={state.step === 'REVIEW' ? handleSubmit : actions.next}
                disabled={!canProceed || state.isSubmitting}
                className={cn(
                    "px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95",
                    (!canProceed || state.isSubmitting)
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
                        : "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20"
                )}
            >
                {state.isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin"/> 
                        {state.statusMessage || 'Processing...'}
                    </span>
                ) : (
                    state.step === 'REVIEW' ? 'Create Contest' : 'Next Step'
                )}
            </button>
        </div>

      </div>
    </div>
  )
}
