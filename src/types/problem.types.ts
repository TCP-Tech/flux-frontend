// src/types/problem.types.ts

// Enum for Evaluator
export type EvaluatorType = 'codeforces' | 'custom'

// --- 1. Problem Metadata ---
export interface Problem {
  id: number
  title: string
  difficulty: number
  evaluator: EvaluatorType
  lock_id?: string | null
  created_by: string
  created_at: string
  updated_at: string
  lock_access?: string 
  lock_timeout?: string
}

// --- 2. Problem Content ---
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
  // FIX: Allow null specifically for backend compatibility
  submission_link?: string | null 
}

// --- 3. Unified View ---
export interface FullProblem {
  problem: Problem
  problem_data: StandardProblemData
}

// --- 4. API Request DTOs ---
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
    // FIX: Allow null
    submission_link?: string | null
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
