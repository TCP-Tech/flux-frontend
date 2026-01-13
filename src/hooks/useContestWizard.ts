import { useReducer } from 'react'
import { SelectedProblem, CreateContestRequest } from '@/types/contest.types'
import { Lock } from '@/types/lock.types'
import { contestService } from '@/services/contest.service'
import { problemService } from '@/services/problem.service'
import { lockService } from '@/services/lock.service'
import { getErrorMessage } from '@/config/axios'
import { toLocalISOString, sleep } from '@/lib/utils'

// --- 1. States ---
type Step = 'CONFIG' | 'PROBLEMS' | 'USERS' | 'REVIEW' | 'SUCCESS';

interface WizardState {
  step: Step
  isSubmitting: boolean
  statusMessage: string | null
  error: string | null
  
  config: {
    title: string
    startTime: string // YYYY-MM-DDThh:mm
    endTime: string   // YYYY-MM-DDThh:mm
    lockId: string
    lockType?: 'timer' | 'manual'
    isPublished: boolean
    isTimerBased: boolean
  }
  selectedProblems: SelectedProblem[]
  userNames: string[]
}

// --- 2. Actions ---
type Action = 
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_CONFIG'; field: string; value: any }
  | { type: 'SELECT_LOCK'; lock: Lock | null }
  | { type: 'TOGGLE_TIMER_MODE' }
  | { type: 'ADD_PROBLEM'; problem: any }
  | { type: 'REMOVE_PROBLEM'; problemId: number }
  | { type: 'UPDATE_SCORE'; problemId: number; score: number }
  | { type: 'SET_USERS'; users: string[] }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_UPDATE'; message: string }
  | { type: 'SUBMIT_FAIL'; error: string }
  | { type: 'SUBMIT_SUCCESS' }

// Smart Defaults
const now = new Date()
const nextHour = new Date(now)
nextHour.setHours(now.getHours() + 1, 0, 0, 0)
const plusThreeHours = new Date(nextHour)
plusThreeHours.setHours(plusThreeHours.getHours() + 3)

const INITIAL_STATE: WizardState = {
  step: 'CONFIG',
  isSubmitting: false,
  statusMessage: null,
  error: null,
  config: {
    title: '',
    startTime: toLocalISOString(nextHour),
    endTime: toLocalISOString(plusThreeHours),
    lockId: '',
    isPublished: false,
    isTimerBased: false,
  },
  selectedProblems: [],
  userNames: []
}

// --- 3. Reducer ---
function reducer(state: WizardState, action: Action): WizardState {
  switch(action.type) {
    case 'UPDATE_CONFIG':
      return { 
        ...state, 
        error: null,
        config: { ...state.config, [action.field]: action.value } 
      }

    case 'SELECT_LOCK':
        const lock = action.lock
        if (!lock) {
            return { 
                ...state, 
                config: { ...state.config, lockId: '', lockType: undefined } 
            }
        }
        
        let newEndTime = state.config.endTime
        let isTimer = state.config.isTimerBased
        const lockType = lock.lock_type === 'timer' ? 'timer' : 'manual'

        // Smart Date Logic for Timer Locks
        if (lock.lock_type === 'timer' && lock.timeout) {
            isTimer = true
            const lockDate = new Date(lock.timeout)
            const paddedEnd = new Date(lockDate)
            paddedEnd.setHours(lockDate.getHours() + 2) // +2h buffer
            newEndTime = toLocalISOString(paddedEnd)
        }

        return {
            ...state,
            config: {
                ...state.config,
                lockId: lock.lock_id,
                lockType: lockType,
                isTimerBased: isTimer,
                endTime: newEndTime
            }
        }
    
    case 'TOGGLE_TIMER_MODE':
      return { ...state, config: { ...state.config, isTimerBased: !state.config.isTimerBased } }

    case 'ADD_PROBLEM':
      if (state.selectedProblems.find(p => p.meta.id === action.problem.id)) return state
      return {
        ...state,
        selectedProblems: [...state.selectedProblems, { meta: action.problem, customScore: action.problem.difficulty || 100 }]
      }

    case 'REMOVE_PROBLEM':
      return {
        ...state,
        selectedProblems: state.selectedProblems.filter(p => p.meta.id !== action.problemId)
      }

    case 'UPDATE_SCORE':
      return {
        ...state,
        selectedProblems: state.selectedProblems.map(p => 
            p.meta.id === action.problemId ? { ...p, customScore: action.score } : p
        )
      }

    case 'SET_USERS':
      return { ...state, userNames: action.users }

    case 'NEXT_STEP':
        if (state.step === 'CONFIG') {
            if (!state.config.title) return { ...state, error: "Title is required" }
            if (!state.config.endTime) return { ...state, error: "End time is required" }
            
            // Allow manual start/end even without Timer/Public
            if (state.config.isTimerBased && !state.config.lockId) return { ...state, error: "Timer based contests require a Lock" }
            
            if (!state.config.isTimerBased && !state.config.isPublished) {
                if (new Date(state.config.startTime) >= new Date(state.config.endTime)) {
                    return { ...state, error: "Start time must be before End time" }
                }
            }
        }
        
        const nextSteps: Record<string, Step> = { 'CONFIG': 'PROBLEMS', 'PROBLEMS': 'USERS', 'USERS': 'REVIEW' }
        if (nextSteps[state.step]) return { ...state, step: nextSteps[state.step], error: null }
        return state

    case 'PREV_STEP':
        const prevSteps: Record<string, Step> = { 'PROBLEMS': 'CONFIG', 'USERS': 'PROBLEMS', 'REVIEW': 'USERS' }
        if (prevSteps[state.step]) return { ...state, step: prevSteps[state.step] }
        return state

    case 'SUBMIT_START':
        return { ...state, isSubmitting: true, error: null, statusMessage: 'Initiating...' }
    
    case 'SUBMIT_UPDATE':
        return { ...state, statusMessage: action.message }
    
    case 'SUBMIT_SUCCESS':
        return { ...state, isSubmitting: false, step: 'SUCCESS', statusMessage: null }

    case 'SUBMIT_FAIL':
        return { ...state, isSubmitting: false, error: action.error, statusMessage: null }

    default: return state
  }
}

export function useContestWizard() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const canProceed = () => {
        if (state.step === 'CONFIG') return !!state.config.title
        if (state.step === 'PROBLEMS') return state.selectedProblems.length > 0
        return true
    }

    const submit = async () => {
        dispatch({ type: 'SUBMIT_START' })
        
        // Preparation Vars
        let finalLockId = state.config.lockId
        let needsLockUpdatePostCreation = false
        const userStartTime = new Date(state.config.startTime)
        const isPublic = state.config.isPublished
        
        try {
            // --- 0. AUTO-LOCK GENERATION ---
            // If Public contest with manual start time (no lock selected), auto-create one.
            if (isPublic && !finalLockId) {
                dispatch({ type: 'SUBMIT_UPDATE', message: 'Generating Access Lock...' })
                
                // Backend rule workaround: Lock must allow time > now.
                // We create a temp "Timer" lock.
                const safeDate = new Date()
                safeDate.setHours(safeDate.getHours() + 26) // Safe margin for "1 Day" rule if still exists
                
                const newLock = await lockService.createLock({
                    name: `[Auto] ${state.config.title}`,
                    description: `Auto-generated for contest.`,
                    lock_type: 'timer' as any,
                    timeout: safeDate.toISOString()
                })
                
                finalLockId = newLock.lock_id
                needsLockUpdatePostCreation = true // We will fix the time later
            }

            // --- 1. PROBLEM LOCK SYNCHRONIZATION ---
            if (finalLockId) {
                dispatch({ type: 'SUBMIT_UPDATE', message: 'Securing problem set...' })
                
                const problemsToUpdate = state.selectedProblems.filter(p => p.meta.lock_id !== finalLockId)
                
                if (problemsToUpdate.length > 0) {
                     const targetIsTimer = isPublic || state.config.isTimerBased
                     
                     // BRIDGE STRATEGY:
                     // Backend rejects: Unlocked -> Timer
                     // We must do: Unlocked -> Manual -> Timer
                     if (targetIsTimer) {
                        const openProblems = problemsToUpdate.filter(p => !p.meta.lock_id)
                        
                        if (openProblems.length > 0) {
                            dispatch({ type: 'SUBMIT_UPDATE', message: 'Applying security bridge...' })
                            
                            // 1. Create temporary manual lock
                            const bridgeLock = await lockService.createLock({
                                name: `Bridge ${Date.now()}`,
                                description: 'Temp transaction lock',
                                lock_type: 'manual' as any, 
                                timeout: null
                            })
                            
                            // 2. Lock OPEN problems with Bridge Lock (Backend allows NULL -> MANUAL)
                            // IMPORTANT: Passing full metadata to avoid overwriting title with ""
                            await Promise.all(openProblems.map(p => 
                                problemService.updateMetadata(p.meta.id, {
                                     title: p.meta.title,
                                     difficulty: p.meta.difficulty,
                                     evaluator: p.meta.evaluator,
                                     lock_id: bridgeLock.lock_id 
                                })
                            ))
                            
                            await sleep(200) // DB consistency wait
                        }
                     }
                     
                     // Final Pass: Update ALL mismatching problems to Target Lock
                     dispatch({ type: 'SUBMIT_UPDATE', message: `Securing ${problemsToUpdate.length} problems...` })
                     
                     for (const p of problemsToUpdate) {
                         await problemService.updateMetadata(p.meta.id, {
                             title: p.meta.title, // Keep title!
                             difficulty: p.meta.difficulty, // Keep difficulty!
                             evaluator: p.meta.evaluator, // Keep evaluator!
                             lock_id: finalLockId
                        })
                     }
                }
            }

            // --- 2. CREATE CONTEST ---
            dispatch({ type: 'SUBMIT_UPDATE', message: 'Creating contest...' })

            // Backend rule: StartTime must be null if Lock is present? 
            // Previous fix: Only if Timer-Based/Public.
            // But we might want manual start + manual lock. 
            // Adjusted logic: If "Timer Based" selected, use Null. Else use Time.
            
            // Update: If you relax Backend logic as discussed, we can just send Start Time always unless strict timer mode.
            const sendStartTime = (state.config.isTimerBased && finalLockId) ? null : userStartTime.toISOString()

            const payload: CreateContestRequest = {
                contest_details: {
                    title: state.config.title,
                    is_published: state.config.isPublished,
                    lock_id: finalLockId || null,
                    end_time: new Date(state.config.endTime).toISOString(),
                    start_time: sendStartTime
                },
                user_names: state.userNames,
                problems: state.selectedProblems.map(p => ({
                    problem_id: p.meta.id,
                    score: p.customScore
                }))
            }

            await contestService.createContest(payload)
            
            // --- 3. POST-CREATION ADJUSTMENT ---
            // If we generated an auto-lock with fake time, reset it to real user start time
            if (needsLockUpdatePostCreation && finalLockId) {
                dispatch({ type: 'SUBMIT_UPDATE', message: 'Adjusting schedule...' })
                try {
                    await lockService.updateLock({
                        lock_id: finalLockId,
                        name: `[Auto] ${state.config.title}`,
                        description: `Timer for contest ${state.config.title}`,
                        lock_type: 'timer' as any,
                        timeout: userStartTime.toISOString() // Set to real requested start time
                    })
                } catch (updateErr) {
                    console.error("Warning: Failed to readjust start time", updateErr)
                }
            }

            dispatch({ type: 'SUBMIT_SUCCESS' })
            return true

        } catch (e) {
            const msg = getErrorMessage(e)
            console.error("Submission Error Details:", e)
            dispatch({ type: 'SUBMIT_FAIL', error: msg.replace('\n', '') })
            return false
        }
    }

    return {
        state,
        canProceed: canProceed(),
        actions: {
            updateConfig: (field: string, value: any) => dispatch({ type: 'UPDATE_CONFIG', field, value }),
            selectLock: (lock: Lock | null) => dispatch({ type: 'SELECT_LOCK', lock }), 
            toggleTimerMode: () => dispatch({ type: 'TOGGLE_TIMER_MODE' }),
            addProblem: (p: any) => dispatch({ type: 'ADD_PROBLEM', problem: p }),
            removeProblem: (id: number) => dispatch({ type: 'REMOVE_PROBLEM', problemId: id }),
            updateScore: (id: number, s: number) => dispatch({ type: 'UPDATE_SCORE', problemId: id, score: s }),
            setUsers: (users: string[]) => dispatch({ type: 'SET_USERS', users }),
            next: () => dispatch({ type: 'NEXT_STEP' }),
            back: () => dispatch({ type: 'PREV_STEP' }),
            submit
        }
    }
}
