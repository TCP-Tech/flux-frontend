import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { FaPlay, FaCircleNotch, FaTerminal, FaChevronUp, FaChevronDown, FaArrowLeft } from 'react-icons/fa'
import { useProblemArena } from '@/hooks/useProblemArena'
import MarkdownRenderer from '@/components/problems/MarkdownRenderer'
import { cn } from '@/lib/utils'

export default function ProblemView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, submit } = useProblemArena(id)
  
  const [code, setCode] = useState('// Write your solution...')
  const [termOpen, setTermOpen] = useState(false)

  if (state.status === 'BOOT') return <div className="text-white p-8">Initializing Arena...</div>

  if (!state.problem) return null

  if ((state.status === 'SUBMITTING' || state.status === 'POLLING') && !termOpen) {
    setTermOpen(true)
  }

  return (
    <div className="h-screen bg-neutral-950 text-white flex flex-col overflow-hidden">
       {/* 1. Header */}
       <header className="h-12 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/problems')} className="hover:text-primary-400"><FaArrowLeft size={12}/></button>
             <h1 className="font-semibold text-sm truncate max-w-xs">{state.problem.problem.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-neutral-800 text-xs px-2 py-1 rounded border border-neutral-700 outline-none">
                <option>C++ 17</option>
                <option>Python 3</option>
            </select>
            <button 
                onClick={() => submit(code, 'cpp')}
                disabled={state.status !== 'READY' && state.status !== 'FINISHED'}
                className="bg-green-700 hover:bg-green-600 text-white px-4 py-1 rounded text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
                {state.status === 'SUBMITTING' || state.status === 'POLLING' ? <FaCircleNotch className="animate-spin"/> : <FaPlay size={10} />}
                Run
            </button>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          <div className="w-[40%] bg-neutral-900 border-r border-neutral-800 flex flex-col">
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                <div className="prose-invert">
                    <MarkdownRenderer content={state.problem.problem_data.statement} />
                    
                    <div className="mt-8 space-y-6">
                        {state.problem.problem_data.example_test_cases?.examples.map((ex, i) => (
                           <div key={i}>
                               <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Sample {i+1}</div>
                               <div className="bg-black/30 border border-neutral-800 rounded grid gap-2 p-3 font-mono text-xs text-neutral-300">
                                   <div><span className="text-neutral-500 block mb-1">Input:</span>{ex.input}</div>
                                   <div><span className="text-neutral-500 block mb-1">Output:</span>{ex.output}</div>
                               </div>
                           </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
              <Editor 
                 height={termOpen ? "60%" : "96%"}
                 defaultLanguage="cpp"
                 theme="vs-dark"
                 value={code}
                 onChange={val => setCode(val||'')}
                 options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
              />

              <div 
                className={cn(
                    "absolute bottom-0 left-0 right-0 bg-[#161616] border-t border-[#333] transition-all duration-300 flex flex-col",
                    termOpen ? "h-[40%]" : "h-8"
                )}
              >
                  <div className="h-8 flex items-center justify-between px-4 cursor-pointer hover:bg-neutral-800/50" onClick={() => setTermOpen(!termOpen)}>
                     <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                        <FaTerminal /> Console 
                        {state.status === 'POLLING' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"/>}
                     </div>
                     {termOpen ? <FaChevronDown size={10} className="text-neutral-500" /> : <FaChevronUp size={10} className="text-neutral-500" />}
                  </div>

                  <div className="flex-1 p-4 font-mono text-xs overflow-y-auto">
                      {state.verdict ? (
                         <div className="space-y-2">
                            <div className={cn("text-lg font-bold", state.verdict.status === 'COMPLETED' ? "text-green-500" : "text-red-500")}>
                                {state.verdict.result || "Processing..."}
                            </div>
                            {state.verdict.logs.map((log, i) => (
                                <div key={i} className="text-neutral-400">{'>'} {log}</div>
                            ))}
                         </div>
                      ) : (
                         <div className="text-neutral-500 italic">Ready to execute.</div>
                      )}
                  </div>
              </div>
          </div>
       </div>
    </div>
  )
}
