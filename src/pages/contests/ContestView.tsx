import { useNavigate } from 'react-router-dom'
import { useContestRoom } from '@/hooks/useContestRoom'
import { FaClock, FaTrophy, FaUserPlus, FaLock, FaExclamationTriangle } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export default function ContestView() {
    const { contest, phase, problems, isRegistered, register, loadingAction, timerDisplay } = useContestRoom()
    const navigate = useNavigate()

    if (!contest) return <div className="p-8 text-neutral-500 animate-pulse">Initializing Command Center...</div>

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 lg:p-12 font-sans selection:bg-amber-900 selection:text-white">
            
            <div className="max-w-6xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-neutral-800">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                phase === 'LIVE' ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" :
                                phase === 'ENDED' ? "bg-neutral-800 text-neutral-400" :
                                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            )}>
                                {phase === 'LOBBY' ? 'UPCOMING' : phase}
                            </span>
                            <span className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                                <FaClock size={10} /> 
                                {phase === 'LOBBY' ? 'Starts In' : phase === 'LIVE' ? 'Ends In' : 'Ended'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{contest.title}</h1>
                        <p className="text-neutral-400 mt-2 flex items-center gap-2 text-sm">
                            <span className="bg-neutral-900 px-2 py-1 rounded text-neutral-500 font-mono text-xs">ID: {contest.contest_id.slice(0,8)}</span>
                             Hosted by {contest.created_by.slice(0,8)}...
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="font-mono text-4xl md:text-6xl font-bold tracking-tighter tabular-nums bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                            {timerDisplay}
                        </div>
                    </div>
                </div>

                {phase === 'LOBBY' && (
                    <div className="mt-8 bg-neutral-900/50 border border-neutral-800 p-8 rounded-2xl flex flex-col items-center text-center">
                         <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                             <FaLock className="text-neutral-500 text-2xl" />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">Contest is Locked</h3>
                         <p className="text-neutral-400 max-w-md mb-6">
                             Problems will become visible automatically when the contest starts. 
                             {!isRegistered && " Please register to participate."}
                         </p>
                         {!isRegistered ? (
                             <button 
                                onClick={register} 
                                disabled={loadingAction}
                                className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-amber-900/20 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                             >
                                {loadingAction ? <span className="animate-spin">C</span> : <FaUserPlus />}
                                {loadingAction ? "Registering..." : "Register Now"}
                             </button>
                         ) : (
                             <div className="px-8 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg font-bold text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" /> You are Registered
                             </div>
                         )}
                    </div>
                )}
            </div>

            {(phase === 'LIVE' || phase === 'ENDED') && (
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1 h-6 bg-amber-500 rounded-full"/> Problems
                            </h2>
                            {/* Validation check visuals */}
                            {!isRegistered && phase !== 'ENDED' && (
                                <span className="text-xs text-amber-500 flex items-center gap-1 bg-amber-900/10 px-2 py-1 rounded">
                                    <FaExclamationTriangle /> Not Registered
                                </span>
                            )}
                        </div>

                        {(!isRegistered && phase !== 'ENDED') ? (
                             <div className="p-8 border border-dashed border-neutral-800 rounded-xl text-center bg-neutral-900/30">
                                 <p className="text-neutral-400 text-sm mb-4">Content is hidden until registration.</p>
                                 <button onClick={register} className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm hover:scale-105 transition-transform">Register</button>
                             </div>
                        ) : problems.length === 0 ? (
                            <div className="p-12 text-center text-neutral-600 bg-neutral-900/20 rounded-xl">
                                {loadingAction ? 'Syncing Problems...' : 'No problems found in this contest.'}
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {problems.map((wrapper, idx) => (
                                    <div 
                                        key={wrapper.problem.id}
                                        onClick={() => navigate(`/problems/${wrapper.problem.id}?contestId=${contest.contest_id}`)}
                                        className="group relative bg-neutral-900 border border-neutral-800 p-5 rounded-xl cursor-pointer hover:border-amber-500/50 hover:bg-neutral-800 transition-all flex justify-between items-center"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-center font-black text-lg text-neutral-500 group-hover:text-white transition-colors">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-neutral-200 group-hover:text-amber-400 transition-colors text-lg truncate">
                                                    {wrapper.problem.title}
                                                </h3>
                                                <div className="flex gap-3 text-xs text-neutral-500 mt-1 font-mono">
                                                    <span>Time: 1s</span> • <span>Memory: 256MB</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end pl-4">
                                            <span className="font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-1 rounded text-sm mb-2 border border-amber-500/20">
                                                {wrapper.score} pts
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-80 space-y-6">
                        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 text-xs text-neutral-400 leading-relaxed">
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><FaTrophy className="text-amber-500"/> Standings</h3>
                            <p>Leaderboard updates in real-time. Freeze time is not active.</p>
                            <div className="h-px bg-neutral-800 my-3" />
                            <div className="text-center italic opacity-50">Coming Soon</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
