export type EvaluatorType = 'codeforces' | 'custom'

export interface Problem {
  id: number 
  title: string
  difficulty: number
  evaluator: EvaluatorType
  lock_id?: string | null 
  created_by: string 
  created_at: string
  updated_at: string
 //this we join from locks table 
  lock_access?: string 
  lock_timeout?: string
}


export interface TestCase {
  input: string
  output: string
  explanation?: string
}

export interface ExampleTestCasesWrapper {
  num_test_cases?: number
  examples: TestCase[]
}

export interface StandardProblemData {
  problem_id: number
  statement: string 
  input_format: string
  output_format: string
  notes?: string
  
  function_definitions?: Record<string, string>
  example_test_cases?: ExampleTestCasesWrapper
  
  memory_limit_kb: number
  time_limit_ms: number
  submission_link?: string 
}

export interface FullProblem {
  problem: Problem
  problem_data: StandardProblemData
}


export interface CreateProblemRequest {
  problem: {
    title: string
    difficulty: number
    evaluator: string
    lock_id?: string | null
  }
  problem_data: {
    statement: string
    input_format: string
    output_format: string
    notes?: string
    memory_limit_kb: number
    time_limit_ms: number
    submission_link?: string
    function_definitions?: Record<string, string>
    example_test_cases?: ExampleTestCasesWrapper
  }
}

export interface SearchProblemsRequest {
  title?: string
  problem_ids?: number[]
  lock_id?: string
  evaluator?: string
  creator_user_name?: string
  creator_roll_number?: string
  page_number: number
  page_size: number
}
