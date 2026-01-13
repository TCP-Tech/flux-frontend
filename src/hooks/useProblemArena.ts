import { useReducer, useEffect, useRef } from 'react'
import { problemService } from '@/services/problem.service'
import { submissionService } from '@/services/submission.service' 
import { FullProblem } from '@/types/problem.types'
import { getErrorMessage } from '@/config/axios'

type VerdictStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED'

interface ArenaState {
  status: 'BOOT' | 'READY' | 'SUBMITTING' | 'POLLING' | 'FINISHED'
  problem: FullProblem | null
  error: string | null
  
  submissionId: string | null
  verdict: {
    status: VerdictStatus
    logs: string[] 
    result?: string 
    time?: number
    memory?: number
  } | null
}

type Action =
  | { type: 'LOAD_SUCCESS'; payload: FullProblem }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_ACCEPTED'; payload: string } // sub_id
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'POLL_UPDATE'; status: VerdictStatus; result?: string; logs?: string[] }

const initialState: ArenaState = {
  status: 'BOOT',
  problem: null,
  error: null,
  submissionId: null,
  verdict: null
}

function reducer(state: ArenaState, action: Action): ArenaState {
  switch (action.type) {
    case 'LOAD_SUCCESS':
      return { ...state, status: 'READY', problem: action.payload, error: null }
    
    case 'LOAD_ERROR':
      return { ...state, status: 'BOOT', error: action.payload }
    
    case 'SUBMIT_START':
      return { ...state, status: 'SUBMITTING', error: null, verdict: null }
    
    case 'SUBMIT_ACCEPTED':
      return { ...state, status: 'POLLING', submissionId: action.payload }
      
    case 'SUBMIT_ERROR':
      return { ...state, status: 'READY', error: action.payload }
      
    case 'POLL_UPDATE':
      const isFinished = action.status === 'COMPLETED' || action.status === 'FAILED'
      return {
        ...state,
        status: isFinished ? 'FINISHED' : 'POLLING',
        verdict: {
          status: action.status,
          result: action.result,
          logs: action.logs || []
        }
      }
    default:
      return state
  }
}

export function useProblemArena(id?: string) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const pollTimer = useRef<number>()

  useEffect(() => {
    if(!id) return
    const load = async () => {
        try {
            const data = await problemService.getProblemById(Number(id))
            dispatch({ type: 'LOAD_SUCCESS', payload: data })
        } catch(e) {
            dispatch({ type: 'LOAD_ERROR', payload: getErrorMessage(e) })
        }
    }
    load()
    return () => clearInterval(pollTimer.current)
  }, [id])

  const submit = async (code: string, language: string) => {
    if (!state.problem) return
    
    dispatch({ type: 'SUBMIT_START' })
    try {
      // const res = await submissionService.submit({
      //    problem_id: state.problem.problem.id,
      //    language,
      //    code
      // })
      // dispatch({ type: 'SUBMIT_ACCEPTED', payload: res.submission_id })
      
      // MOCK BEHAVIOR:
      setTimeout(() => {
        dispatch({ type: 'SUBMIT_ACCEPTED', payload: 'mock-123' })
        mockPolling()
      }, 1000)

    } catch (e) {
      dispatch({ type: 'SUBMIT_ERROR', payload: getErrorMessage(e) })
    }
  }

  const mockPolling = () => {
    let steps = 0
    pollTimer.current = window.setInterval(() => {
        steps++
        if (steps === 1) {
            dispatch({ type: 'POLL_UPDATE', status: 'RUNNING', logs: ['Container initialized', 'Downloading Test Cases...'] })
        }
        if (steps === 3) {
             dispatch({ type: 'POLL_UPDATE', status: 'RUNNING', logs: ['Running Tests...'] })
        }
        if (steps === 5) {
             clearInterval(pollTimer.current)
             dispatch({ type: 'POLL_UPDATE', status: 'COMPLETED', result: 'Accepted (12ms)' })
        }
    }, 1000)
  }

  return { state, submit }
}
