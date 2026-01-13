import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaSave, FaArrowLeft, FaEye, FaCode, FaPlus, FaTrash, FaCheck } from 'react-icons/fa'
import { cn } from '@/lib/utils'
import MarkdownRenderer from '@/components/problems/MarkdownRenderer'
import { useProblemEditorMachine } from '@/hooks/useProblemEditorMachine'

export default function ProblemEditor() {
  const { id } = useParams()
  const { state, isLoading, isSaving, canSave, actions } = useProblemEditorMachine(id)
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  // --- Render Functions (Keeping JSX clean) ---

  if (state.status === 'BOOT' || isLoading) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-neutral-500 text-sm font-mono">Initializing Problem Studio...</span>
      </div>
    )
  }

  if (state.status === 'ERROR' && !state.originalData) {
    return (
      <div className="h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-8">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl border border-red-500/20 max-w-md">
          <h2 className="text-lg font-bold mb-2">Failed to Load</h2>
          <p className="text-sm opacity-80 mb-6">{state.errorMessage}</p>
          <button onClick={actions.goBack} className="bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded text-sm text-white transition">
            Back to Archive
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-neutral-950 text-neutral-50 flex flex-col overflow-hidden">
      
      {/* 1. TOP BAR */}
      <header className="h-14 shrink-0 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={actions.goBack} className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
            <FaArrowLeft size={14} />
          </button>
          
          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
          
          {/* Metadata Inputs in Header for space efficiency */}
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <input 
              value={state.form.title}
              onChange={e => actions.updateTitle(e.target.value)}
              className="bg-transparent border border-transparent hover:border-neutral-800 focus:border-primary-500/50 rounded px-2 py-1 font-bold text-lg focus:outline-none focus:bg-neutral-900 w-full transition-all"
            />
            <span className="text-[10px] font-mono text-neutral-500 shrink-0 border border-neutral-800 px-1.5 py-0.5 rounded">
              ID: {state.originalData?.problem.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
             <button 
               onClick={() => setActiveTab('write')}
               className={cn(
                 "px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all",
                 activeTab === 'write' ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
               )}
             >
               <FaCode /> Code
             </button>
             <button 
               onClick={() => setActiveTab('preview')}
               className={cn(
                "px-3 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all",
                activeTab === 'preview' ? "bg-primary-900/30 text-primary-200 shadow-sm" : "text-neutral-500 hover:text-neutral-300"
              )}
             >
               <FaEye /> Preview
             </button>
          </div>
          
          <button 
            onClick={actions.save}
            disabled={!canSave && !isSaving} 
            className={cn(
              "px-5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all",
              isSaving 
                ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
                : canSave
                    ? "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20 active:scale-95"
                    : "bg-transparent text-neutral-500 border border-neutral-800 hover:border-neutral-700"
            )}
          >
            {isSaving ? (
              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
            ) : canSave ? (
              <><FaSave size={12} /> Save Changes</>
            ) : (
              <><FaCheck size={12} /> Saved</>
            )}
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANE: Content Editor */}
        <div className={cn(
          "flex-1 flex flex-col bg-[#141414]",
          activeTab === 'preview' && "hidden md:flex"
        )}>
          <textarea 
             value={state.form.statement}
             onChange={e => actions.updateStatement(e.target.value)}
             className="flex-1 w-full bg-transparent p-6 md:p-8 resize-none focus:outline-none font-mono text-sm leading-7 text-neutral-300 placeholder-neutral-700 selection:bg-primary-900 selection:text-white"
             placeholder="# Problem Statement&#10;&#10;Write your description here using Markdown..."
             spellCheck={false}
           />
        </div>

        {/* RIGHT PANE: Configuration & Preview */}
        <div className={cn(
          "w-full md:w-[500px] border-l border-neutral-800 bg-neutral-950 flex flex-col",
          activeTab === 'write' ? "hidden md:flex" : "flex"
        )}>
          {activeTab === 'preview' ? (
             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="prose prose-invert prose-neutral max-w-none">
                  <h1>{state.form.title}</h1>
                  <MarkdownRenderer content={state.form.statement} />
                </div>
             </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Bot Config */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">
                   Bot & Judge Configuration
                </label>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Codeforces URL</label>
                    <input 
                      value={state.form.submissionLink}
                      onChange={e => actions.updateLink(e.target.value)}
                      placeholder="https://codeforces.com/contest/..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-700 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Test Case Manager */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">
                      Example Test Cases ({state.form.testCases.length})
                    </label>
                    <button onClick={actions.addCase} className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                      <FaPlus size={10} /> Add
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    {state.form.testCases.map((tc, idx) => (
                      <div key={idx} className="group relative bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all hover:border-neutral-700">
                         <div className="absolute top-0 right-0 p-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => actions.removeCase(idx)} className="p-1.5 bg-neutral-800 text-red-400 rounded-md hover:bg-red-950/50 hover:text-red-300">
                              <FaTrash size={10} />
                            </button>
                         </div>
                         <div className="grid grid-rows-2 divide-y divide-neutral-800">
                           <textarea 
                              value={tc.input} 
                              onChange={e => actions.updateCase(idx, 'input', e.target.value)}
                              placeholder={`Input #${idx+1}`}
                              className="bg-transparent p-3 h-20 text-xs font-mono resize-none focus:outline-none focus:bg-neutral-800/30"
                           />
                           <textarea 
                              value={tc.output}
                              onChange={e => actions.updateCase(idx, 'output', e.target.value)}
                              placeholder={`Output #${idx+1}`}
                              className="bg-transparent p-3 h-20 text-xs font-mono resize-none focus:outline-none focus:bg-neutral-800/30"
                           />
                         </div>
                      </div>
                    ))}

                    {state.form.testCases.length === 0 && (
                      <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-600 text-sm">
                        No test cases added.
                      </div>
                    )}
                 </div>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* 3. FOOTER (Status) */}
      <footer className="h-8 border-t border-neutral-800 bg-neutral-950 flex items-center px-4 justify-between">
        <div className="text-[10px] text-neutral-600 flex items-center gap-2">
           <div className={cn("w-2 h-2 rounded-full", state.status === 'DIRTY' ? "bg-amber-500" : "bg-neutral-800")} />
           STATUS: <span className="font-mono text-neutral-400">{state.status}</span>
        </div>
        {state.errorMessage && (
           <div className="text-[10px] text-red-400 bg-red-950/20 px-2 rounded">
             {state.errorMessage}
           </div>
        )}
      </footer>

    </div>
  )
}
