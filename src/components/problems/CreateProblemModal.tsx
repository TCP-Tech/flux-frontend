// src/pages/problems/CreateProblemModal.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTimes, FaCube } from 'react-icons/fa'
import { problemService } from '@/services/problem.service'
import { getErrorMessage } from '@/config/axios'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CreateProblemModal({ isOpen, onClose }: Props) {
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
      // 1. Create Draft
      const res = await problemService.createProblemDraft({
        title: formData.title,
        difficulty: Number(formData.difficulty),
        evaluator: 'codeforces', // hardcoded for now as per requirements
        lock_id: formData.lock_id || null
      })

      // 2. Redirect to Editor
      navigate(`/problems/${res.problem.id}/edit`)
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaCube className="text-primary-500" /> New Problem
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Title</label>
            <input 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:border-primary-500 focus:outline-none"
              placeholder="e.g. Two Sum"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Difficulty</label>
              <input 
                type="number"
                required
                min={800}
                max={3500}
                step={100}
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: Number(e.target.value)})}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Evaluator</label>
              <select 
                disabled
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-500 focus:outline-none cursor-not-allowed"
              >
                <option>Codeforces Bot</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Lock UUID (Optional)</label>
             <input 
               value={formData.lock_id}
               onChange={e => setFormData({...formData, lock_id: e.target.value})}
               className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 font-mono text-sm focus:border-primary-500 focus:outline-none"
               placeholder="Paste Lock ID..."
             />
          </div>

          {error && <div className="text-red-400 text-sm bg-red-950/20 p-3 rounded border border-red-900/20">{error}</div>}

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-400 hover:text-white">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Draft'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
