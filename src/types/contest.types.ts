import { Problem } from './problem.types'

export interface Contest {
  contest_id: string 
  title: string
  created_by: string
  created_at: string
  updated_at: string
  start_time: string | null
  end_time: string
  is_published: boolean
  lock_id: string | null
  lock_access?: string 
  lock_timeout?: string
  user_count?: number
}

export interface ContestProblemWrapper {
  problem: Problem
  score: number
  order?: number 
}

export interface SelectedProblem {
  meta: Problem 
  customScore: number 
}

export interface ContestRegistration {
  user_id: string
  user_name: string
  roll_no: string
}

export interface CreateContestRequest {
  contest_details: {
    title: string
    start_time: string | null
    end_time: string
    is_published: boolean
    lock_id: string | null
  }
  user_names: string[]
  problems: {
    problem_id: number
    score: number
  }[]
}

export interface SearchContestRequest {
  contest_ids?: string[]
  is_published?: boolean
  lock_id?: string
  title?: string
  page_number: number
  page_size: number
}
