import { useReducer, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { problemService } from '@/services/problem.service'
import { FullProblem, TestCase } from '@/types/problem.types'
import { getErrorMessage } from '@/config/axios'


type EditorStatus = 'BOOT' | 'FETCHING' | 'IDLE' | 'DIRTY' | 'SAVING' | 'ERROR';

interface EditorState {
  status: EditorStatus
  originalData: FullProblem | null
  form: {
    title: string 
    statement: string
    submissionLink: string
    testCases: TestCase[]
    notes?: string
  }
  lastSavedAt: Date | null
  errorMessage: string | null
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: FullProblem }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'UPDATE_META'; field: 'title'; value: string }
  | { type: 'UPDATE_CONTENT'; field: 'statement' | 'submissionLink' | 'notes'; value: string }
  | { type: 'TC_ADD' }
  | { type: 'TC_REMOVE'; index: number }
  | { type: 'TC_UPDATE'; index: number; field: 'input' | 'output'; value: string }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS'; payload: FullProblem }
  | { type: 'SAVE_ERROR'; payload: string }


const initialState: EditorState = {
  status: 'BOOT',
  originalData: null,
  form: { title: '', statement: '', submissionLink: '', testCases: [] },
  lastSavedAt: null,
  errorMessage: null
}

function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'FETCHING', errorMessage: null }

    case 'FETCH_SUCCESS': {
      const p = action.payload
      return {
        ...state,
        status: 'IDLE',
        originalData: p,
        form: {
          title: p.problem.title,
          statement: p.problem_data.statement || '',
          submissionLink: p.problem_data.submission_link || '',
          testCases: p.problem_data.example_test_cases?.examples || [],
          notes: p.problem_data.notes || ''
        }
      }
    }

    case 'FETCH_ERROR':
      return { ...state, status: 'ERROR', errorMessage: action.payload }

    case 'UPDATE_META':
    case 'UPDATE_CONTENT':
      return {
        ...state,
        status: 'DIRTY', 
        form: { ...state.form, [action.field]: action.value }
      }

    case 'TC_ADD':
      return {
        ...state,
        status: 'DIRTY',
        form: { ...state.form, testCases: [...state.form.testCases, { input: '', output: '' }] }
      }

    case 'TC_REMOVE':
      return {
        ...state,
        status: 'DIRTY',
        form: { ...state.form, testCases: state.form.testCases.filter((_, i) => i !== action.index) }
      }

    case 'TC_UPDATE': {
      const newCases = [...state.form.testCases]
      newCases[action.index] = { ...newCases[action.index], [action.field]: action.value }
      return {
        ...state,
        status: 'DIRTY',
        form: { ...state.form, testCases: newCases }
      }
    }

    case 'SAVE_START':
      return { ...state, status: 'SAVING', errorMessage: null }

    case 'SAVE_SUCCESS':
      return {
        ...state,
        status: 'IDLE',
        originalData: action.payload,
        lastSavedAt: new Date()
      }

    case 'SAVE_ERROR':
      return { ...state, status: 'DIRTY', errorMessage: action.payload } // Remain dirty if save fails

    default:
      return state
  }
}


export function useProblemEditorMachine(problemId?: string) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()

  useEffect(() => {
    if (!problemId) return
    const id = Number(problemId)
    
    let active = true
    const init = async () => {
      dispatch({ type: 'FETCH_START' })
      try {
        const data = await problemService.getProblemById(id)
        if (active) dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (err) {
        if (active) dispatch({ type: 'FETCH_ERROR', payload: getErrorMessage(err) })
      }
    }
    init()
    return () => { active = false }
  }, [problemId])

  const save = useCallback(async () => {
    if (!state.originalData) return

    dispatch({ type: 'SAVE_START' })
    try {
      const contentPayload = {
        ...state.originalData.problem_data,
        statement: state.form.statement,
        submission_link: state.form.submissionLink || null, 
        example_test_cases: {
          num_test_cases: state.form.testCases.length,
          examples: state.form.testCases
        },
        notes: state.form.notes
      }

      if (state.form.title !== state.originalData.problem.title) {
        await problemService.updateMetadata(state.originalData.problem.id, { title: state.form.title })
      }

      const updatedContent = await problemService.updateContent(contentPayload)
      
      const newData: FullProblem = {
        problem: { ...state.originalData.problem, title: state.form.title },
        problem_data: updatedContent
      }
      
      dispatch({ type: 'SAVE_SUCCESS', payload: newData })
    } catch (err) {
      dispatch({ type: 'SAVE_ERROR', payload: getErrorMessage(err) })
    }
  }, [state.originalData, state.form])

  return {
    state,
    isLoading: state.status === 'BOOT' || state.status === 'FETCHING',
    isSaving: state.status === 'SAVING',
    canSave: state.status === 'DIRTY' || state.status === 'ERROR', 
    actions: {
      save,
      updateTitle: (v: string) => dispatch({ type: 'UPDATE_META', field: 'title', value: v }),
      updateStatement: (v: string) => dispatch({ type: 'UPDATE_CONTENT', field: 'statement', value: v }),
      updateLink: (v: string) => dispatch({ type: 'UPDATE_CONTENT', field: 'submissionLink', value: v }),
      addCase: () => dispatch({ type: 'TC_ADD' }),
      removeCase: (i: number) => dispatch({ type: 'TC_REMOVE', index: i }),
      updateCase: (i: number, f: 'input'|'output', v: string) => dispatch({ type: 'TC_UPDATE', index: i, field: f, value: v }),
      goBack: () => navigate('/problems')
    }
  }
}
