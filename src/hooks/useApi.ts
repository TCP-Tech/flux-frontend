/**
 * Custom React Hooks for API Calls
 * Provides reusable hooks with loading and error states
 */

import { useState, useEffect, useCallback } from 'react'
import { getErrorMessage } from '../config/axios'

/**
 * Generic API Hook State
 */
interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * useApi Hook
 * Generic hook for making API calls with loading and error states
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: unknown[] = []
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: getErrorMessage(error),
      })
    }
  }, [apiFunction])

  useEffect(() => {
    fetchData()
  }, [...dependencies, fetchData])

  return { ...state, refetch: fetchData }
}

/**
 * useMutation Hook
 * Hook for API mutations (POST, PUT, DELETE) with loading and error states
 */
export function useMutation<TData, TVariables = void>() {
  const [state, setState] = useState<{
    data: TData | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (apiFunction: (variables: TVariables) => Promise<TData>, variables: TVariables) => {
      setState({ data: null, loading: true, error: null })

      try {
        const result = await apiFunction(variables)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        setState({ data: null, loading: false, error: errorMessage })
        throw error
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return { ...state, mutate, reset }
}

/**
 * usePagination Hook
 * Hook for handling paginated API calls
 */
export function usePagination<T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialPage: number = 1,
  initialLimit: number = 10
) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [state, setState] = useState<{
    data: T[]
    total: number
    loading: boolean
    error: string | null
  }>({
    data: [],
    total: 0,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await apiFunction(page, limit)
      setState({
        data: result.data,
        total: result.total,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({
        data: [],
        total: 0,
        loading: false,
        error: getErrorMessage(error),
      })
    }
  }, [apiFunction, page, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    ...state,
    page,
    limit,
    setPage,
    setLimit,
    refetch: fetchData,
    totalPages: Math.ceil(state.total / limit),
    hasNext: page * limit < state.total,
    hasPrev: page > 1,
    nextPage: () => setPage((p) => p + 1),
    prevPage: () => setPage((p) => Math.max(1, p - 1)),
    goToPage: (newPage: number) => setPage(newPage),
  }
}

/**
 * usePolling Hook
 * Hook for polling API endpoints at regular intervals
 */
export function usePolling<T>(
  apiFunction: () => Promise<T>,
  interval: number = 5000,
  enabled: boolean = true
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetchData = useCallback(async () => {
    try {
      const result = await apiFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: getErrorMessage(error),
      })
    }
  }, [apiFunction])

  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchData()

    // Set up polling
    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [fetchData, interval, enabled])

  return { ...state, refetch: fetchData }
}

/**
 * useDebounce Hook
 * Debounces a value for delayed API calls (useful for search)
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * useInfiniteScroll Hook
 * Hook for infinite scroll/load more functionality
 */
export function useInfiniteScroll<T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; hasMore: boolean }>,
  initialLimit: number = 20
) {
  const [page, setPage] = useState(1)
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    setError(null)

    try {
      const result = await apiFunction(page, initialLimit)
      setData((prev) => [...prev, ...result.data])
      setHasMore(result.hasMore)
      setPage((p) => p + 1)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [apiFunction, page, initialLimit, loading, hasMore])

  const reset = useCallback(() => {
    setPage(1)
    setData([])
    setHasMore(true)
    setError(null)
  }, [])

  useEffect(() => {
    loadMore()
  }, []) // Only load on mount

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  }
}

