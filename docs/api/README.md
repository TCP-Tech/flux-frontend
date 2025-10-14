# API Configuration & Backend Integration

Complete guide for connecting the Flux frontend to the backend API with production-ready configurations.

## 📁 Directory Structure

```
src/
├── config/
│   ├── env.ts              # Environment configuration
│   └── axios.ts            # Axios client with interceptors
├── services/
│   ├── auth.service.ts     # Authentication API calls
│   ├── contest.service.ts  # Contest API calls
│   ├── problem.service.ts  # Problem API calls
│   ├── user.service.ts     # User API calls
│   ├── submission.service.ts # Submission API calls
│   └── index.ts            # Service exports
├── hooks/
│   └── useApi.ts           # React hooks for API calls
└── types/
    └── api.types.ts        # TypeScript types for API
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios react-cookie
```

### 2. Set Up Environment Variables

The `.env.development` file is already configured:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENV=development
VITE_ENABLE_DEBUG_MODE=true
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false
```

For production, update `.env.production` with your production API URL.

### 3. Usage Examples

#### Authentication

```typescript
import { authService } from '@/services'

// Login
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123',
      rememberMe: true
    })
    console.log('Logged in:', response.user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Signup
const handleSignup = async () => {
  try {
    const response = await authService.signup({
      username: 'newuser',
      email: 'user@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    })
    console.log('Signed up:', response.user)
  } catch (error) {
    console.error('Signup failed:', error)
  }
}

// Logout
const handleLogout = async () => {
  await authService.logout()
  // Redirect to login page
}
```

#### Using React Hooks

```typescript
import { useApi, useMutation } from '@/hooks/useApi'
import { contestService } from '@/services'

function ContestsPage() {
  // Fetch contests
  const { data, loading, error, refetch } = useApi(
    () => contestService.getContests({ page: 1, limit: 10 }),
    []
  )

  // Register for contest mutation
  const { mutate, loading: registering } = useMutation()

  const handleRegister = async (contestId: string) => {
    try {
      await mutate(contestService.registerForContest, contestId)
      await refetch() // Refresh contests list
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data?.data.map((contest) => (
        <div key={contest.id}>
          <h3>{contest.title}</h3>
          <button 
            onClick={() => handleRegister(contest.id)}
            disabled={registering}
          >
            Register
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### Direct API Calls

```typescript
import { api } from '@/config/axios'
import { API_ENDPOINTS } from '@/config/env'

// GET request
const fetchContests = async () => {
  const response = await api.get('/contests', {
    params: { page: 1, limit: 10 }
  })
  return response.data
}

// POST request
const submitSolution = async (problemId: string, code: string) => {
  const response = await api.post(`/problems/${problemId}/submit`, {
    code,
    language: 'python'
  })
  return response.data
}
```

## 🔐 Authentication Flow

The authentication system uses JWT tokens stored in HTTP-only cookies:

1. **Login/Signup**: Tokens are stored in cookies automatically
2. **API Requests**: Access token is attached to all requests via interceptor
3. **Token Refresh**: Expired tokens are automatically refreshed
4. **Logout**: Tokens are cleared from cookies

### Cookie Configuration

- **Access Token**: 15-minute expiry
- **Refresh Token**: 7-day expiry (only if "Remember Me" is checked)
- **Secure**: HTTPS only in production
- **SameSite**: Lax for CSRF protection

## 📊 API Response Format

All API responses follow a consistent format:

```typescript
// Success Response
{
  success: true,
  data: { ... },
  message: "Operation successful",
  timestamp: "2025-10-12T10:30:00Z"
}

// Error Response
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid email format",
    details: { ... }
  },
  timestamp: "2025-10-12T10:30:00Z"
}

// Paginated Response
{
  success: true,
  data: [ ... ],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrev: false
  },
  timestamp: "2025-10-12T10:30:00Z"
}
```

## 🔧 Advanced Features

### Request Interceptors

Automatically adds:
- Authorization header with JWT token
- Request ID for tracking
- Request logging in development

### Response Interceptors

Handles:
- Automatic token refresh on 401
- Error logging and formatting
- Network error detection
- Timeout handling

### Custom Hooks

- **useApi**: Fetch data with loading/error states
- **useMutation**: Handle mutations (POST/PUT/DELETE)
- **usePagination**: Paginated data fetching
- **usePolling**: Poll API endpoints at intervals
- **useDebounce**: Debounce search inputs
- **useInfiniteScroll**: Infinite scroll functionality

## 📚 API Endpoints

All endpoints are defined in `src/config/env.ts`:

- **Authentication**: `/auth/*`
- **Users**: `/users/*`
- **Contests**: `/contests/*`
- **Problems**: `/problems/*`
- **Submissions**: `/submissions/*`
- **Leaderboard**: `/leaderboard/*`

## 🔄 Migration from Local to Remote

When deploying your backend:

1. Update `.env.production`:
```env
VITE_API_BASE_URL=https://api.flux.example.com
VITE_COOKIE_DOMAIN=.flux.example.com
VITE_COOKIE_SECURE=true
```

2. Update CORS on backend to include production URL
3. Deploy frontend and backend
4. No code changes required! ✨

---

For more detailed information, see:
- [CORS Configuration](./CORS_SETUP.md)
- [Security Best Practices](./SECURITY.md)
- [Error Handling Guide](./ERROR_HANDLING.md)
- [Environment Variables](./ENVIRONMENT.md)

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

