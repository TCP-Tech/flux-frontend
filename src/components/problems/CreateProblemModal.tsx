import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimes, FaCube, FaExclamationCircle, FaSpinner } from 'react-icons/fa'
import { problemService } from '@/services/problem.service'
import { getErrorMessage } from '@/config/axios'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void 
}

export default function CreateProblemModal({ isOpen, onClose, onSuccess }: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 800,
    evaluator: 'codeforces',
    lock_id: ''
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await problemService.createProblemDraft({
        title: formData.title,
        difficulty: Number(formData.difficulty),
        evaluator: 'codeforces', 
        lock_id: formData.lock_id || null
      })

      onSuccess()

      navigate(`/problems/${res.problem.id}/edit`)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transform scale-100 transition-all">
        
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCube className="text-blue-500" /> New Problem
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-2 rounded-full hover:bg-neutral-800 transition-colors">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Problem Title</label>
            <input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder-neutral-700"
              placeholder="e.g. Dynamic Arrays II"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Difficulty</label>
              <input 
                type="number"
                required
                min={800}
                max={3500}
                step={100}
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: Number(e.target.value)})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">Evaluator</label>
              <div className="relative">
                <select 
                  disabled
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-500 focus:outline-none appearance-none cursor-not-allowed"
                >
                  <option>Codeforces Bot</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-neutral-600 pointer-events-none text-xs">▼</div>
              </div>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-neutral-500 uppercase mb-2 ml-1">
                Access Lock <span className="font-normal normal-case opacity-50 ml-1">(Optional)</span>
             </label>
             <input 
               value={formData.lock_id}
               onChange={e => setFormData({...formData, lock_id: e.target.value})}
               className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-300 font-mono text-sm focus:border-blue-500/50 outline-none transition-all placeholder-neutral-700"
               placeholder="Paste UUID..."
             />
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-red-400 text-sm">
                <FaExclamationCircle className="shrink-0" />
                {error}
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors"
            >
                Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2"><FaSpinner className="animate-spin" /> Creating...</span>
              ) : 'Create Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
