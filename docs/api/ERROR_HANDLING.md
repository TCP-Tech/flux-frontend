# Error Handling Guide

Comprehensive guide for handling errors in the Flux frontend application.

## 🎯 Error Handling Strategy

The application uses a centralized error handling approach:

1. **API Level**: Axios interceptors catch and format errors
2. **Service Level**: Services throw typed errors
3. **Component Level**: React hooks handle loading/error states
4. **UI Level**: User-friendly error messages

## 📊 Error Types

### 1. HTTP Status Errors

#### 401 Unauthorized
**Cause**: Token expired or invalid

**Handling**: Automatic token refresh attempted

```typescript
// Automatic handling in axios.ts
if (error.response?.status === 401) {
  // Try to refresh token
  // If refresh fails, redirect to login
}
```

#### 403 Forbidden
**Cause**: User doesn't have permission

**User Message**: "You don't have permission to perform this action"

```typescript
if (error.response?.status === 403) {
  toast.error("You don't have permission to perform this action")
}
```

#### 404 Not Found
**Cause**: Resource doesn't exist

**User Message**: "The requested resource was not found"

#### 422 Validation Error
**Cause**: Invalid input data

**Handling**: Show specific field errors

```typescript
// Example error response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: {
      email: ["Invalid email format"],
      password: ["Password must be at least 8 characters"]
    }
  }
}
```

#### 429 Too Many Requests
**Cause**: Rate limit exceeded

**User Message**: "Too many requests. Please try again later"

#### 500 Internal Server Error
**Cause**: Server-side error

**User Message**: "Something went wrong. Please try again"

### 2. Network Errors

#### No Internet Connection
```typescript
if (error.message === 'Network Error') {
  toast.error('No internet connection. Please check your network')
}
```

#### Request Timeout
```typescript
if (error.code === 'ECONNABORTED') {
  toast.error('Request timed out. Please try again')
}
```

## 🛠️ Using Error Handling

### With React Hooks

```typescript
import { useApi } from '@/hooks/useApi'
import { contestService } from '@/services'

function ContestsPage() {
  const { data, loading, error } = useApi(
    () => contestService.getContests(),
    []
  )

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Failed to load contests"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return <div>{/* Render contests */}</div>
}
```

### With Try-Catch

```typescript
import { getErrorMessage } from '@/config/axios'
import { authService } from '@/services'

async function handleLogin(credentials) {
  try {
    const response = await authService.login(credentials)
    // Success
    toast.success('Login successful')
    navigate('/dashboard')
  } catch (error) {
    // Error
    const message = getErrorMessage(error)
    toast.error(message)
  }
}
```

### With Mutations

```typescript
import { useMutation } from '@/hooks/useApi'

function RegisterButton({ contestId }) {
  const { mutate, loading, error } = useMutation()

  const handleRegister = async () => {
    try {
      await mutate(
        contestService.registerForContest,
        contestId
      )
      toast.success('Registration successful!')
    } catch (error) {
      // Error already in state
      toast.error(error)
    }
  }

  return (
    <>
      <button onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      {error && <ErrorText>{error}</ErrorText>}
    </>
  )
}
```

## 🎨 User-Friendly Error Messages

### Error Message Mapping

```typescript
const ERROR_MESSAGES = {
  // Authentication
  'INVALID_CREDENTIALS': 'Invalid email or password',
  'EMAIL_NOT_VERIFIED': 'Please verify your email first',
  'ACCOUNT_LOCKED': 'Your account has been locked',
  
  // Validation
  'VALIDATION_ERROR': 'Please check your input',
  'EMAIL_ALREADY_EXISTS': 'This email is already registered',
  'USERNAME_TAKEN': 'This username is already taken',
  
  // Contests
  'CONTEST_FULL': 'This contest is already full',
  'CONTEST_STARTED': 'Cannot register after contest has started',
  'ALREADY_REGISTERED': 'You are already registered',
  
  // Problems
  'COMPILATION_ERROR': 'Your code failed to compile',
  'RUNTIME_ERROR': 'Your code encountered a runtime error',
  'TIME_LIMIT_EXCEEDED': 'Your solution took too long to execute',
  
  // Generic
  'NETWORK_ERROR': 'Network error. Please check your connection',
  'TIMEOUT_ERROR': 'Request timed out. Please try again',
  'SERVER_ERROR': 'Server error. Our team has been notified',
}

function getUserFriendlyMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] || 'An unexpected error occurred'
}
```

## 🔍 Error Logging

### Development Environment

All errors are logged to console:

```typescript
// In axios.ts interceptor
if (isDevelopment()) {
  console.error('[API Error]', {
    url: error.config?.url,
    status: error.response?.status,
    message: error.response?.data,
    stack: error.stack,
  })
}
```

### Production Environment

Integrate with error tracking services:

```typescript
// Example with Sentry
import * as Sentry from '@sentry/react'

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isProduction()) {
      Sentry.captureException(error, {
        tags: {
          type: 'api_error',
          endpoint: error.config?.url,
          status: error.response?.status,
        },
        extra: {
          request: error.config,
          response: error.response?.data,
        },
      })
    }
    return Promise.reject(error)
  }
)
```

## 🎭 Error Boundaries

Create error boundaries for catching React errors:

```typescript
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to error tracking service
    if (isProduction()) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

Use in App.tsx:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 🧪 Testing Error Handling

### Mock API Errors

```typescript
// In tests
import { authService } from '@/services'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

test('handles login error', async () => {
  mockedAxios.post.mockRejectedValue({
    response: {
      status: 401,
      data: {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid credentials',
        },
      },
    },
  })

  await expect(
    authService.login({ email: 'test@example.com', password: 'wrong' })
  ).rejects.toThrow()
})
```

## 📋 Error Handling Checklist

### For Every API Call

- [ ] Loading state handled
- [ ] Error state handled
- [ ] User-friendly error message shown
- [ ] Retry mechanism (if applicable)
- [ ] Error logged in development
- [ ] Error tracked in production

### For Forms

- [ ] Field-level validation
- [ ] Form-level validation
- [ ] Server validation errors displayed
- [ ] Disabled submit during request
- [ ] Reset form on success

### For Authentication

- [ ] Token refresh attempted
- [ ] Redirect to login on auth failure
- [ ] Tokens cleared on logout
- [ ] Secure cookie handling

## 🚨 Common Pitfalls

### 1. Not Showing Loading State

❌ **BAD:**
```typescript
const { data, error } = useApi(() => fetchData(), [])
// No loading indicator
```

✅ **GOOD:**
```typescript
const { data, loading, error } = useApi(() => fetchData(), [])
if (loading) return <LoadingSpinner />
```

### 2. Generic Error Messages

❌ **BAD:**
```typescript
toast.error('Error occurred')
```

✅ **GOOD:**
```typescript
const message = getErrorMessage(error)
toast.error(message)  // "Invalid email or password"
```

### 3. Not Handling Network Errors

❌ **BAD:**
```typescript
catch (error) {
  // Only handles API errors
}
```

✅ **GOOD:**
```typescript
catch (error) {
  if (error.message === 'Network Error') {
    toast.error('No internet connection')
  } else {
    toast.error(getErrorMessage(error))
  }
}
```

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

