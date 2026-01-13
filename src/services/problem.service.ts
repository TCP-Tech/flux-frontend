import { api } from '@/config/axios'
import { API_ENDPOINTS } from '@/config/env'
import type { 
  Problem, 
  FullProblem, 
  CreateProblemRequest, 
  SearchProblemsRequest,
  StandardProblemData
} from '@/types/problem.types'

const sanitizeData = (data: any) => {
  const clean = { ...data }
  if (clean.submission_link === '') {
    clean.submission_link = null
  }
  return clean
}

export const problemService = {
  searchProblems: async (filters: SearchProblemsRequest): Promise<Problem[]> => {
    const response = await api.post<Record<string, Problem> | Problem[]>(
      API_ENDPOINTS.PROBLEMS.SEARCH, 
      filters
    )

    if (response && typeof response === 'object' && !Array.isArray(response)) {
      return Object.values(response)
    }

    if (Array.isArray(response)) {
      return response
    }

    return []
  },

  getProblemById: async (id: number): Promise<FullProblem> => {
    const response = await api.get<{
      problem: Problem,
      problem_data: StandardProblemData
    }>(API_ENDPOINTS.PROBLEMS.STANDARD, {
      params: { problem_id: id }
    })

    return {
      problem: response.problem,
      problem_data: response.problem_data
    }
  },

  createProblemDraft: async (meta: { 
    title: string, 
    difficulty: number, 
    evaluator: string,
    lock_id?: string | null 
  }): Promise<FullProblem> => {
    
    const payload: CreateProblemRequest = {
      problem: meta,
      problem_data: {
        statement: "Draft problem statement...",
        input_format: "Input format...",
        output_format: "Output format...",
        memory_limit_kb: 256000,
        time_limit_ms: 1000,
        example_test_cases: { examples: [] },
        submission_link: null
      }
    }

    return await api.post(API_ENDPOINTS.PROBLEMS.STANDARD, payload)
  },

  updateContent: async (data: StandardProblemData): Promise<StandardProblemData> => {
    const cleanData = sanitizeData(data)
    return await api.put('/problems/standard', cleanData)
  },

  updateMetadata: async (id: number, data: Partial<Problem>): Promise<Problem> => {
    console.log(`[ProblemService] Updating metadata for ${id}. Payload:`, { id, ...data });
    return await api.put(API_ENDPOINTS.PROBLEMS.BASE, {
      id,
      ...data
    })
  }
}
