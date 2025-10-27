# Backend Integration Summary

Complete production-ready API configuration has been implemented for the Flux frontend.

## ✅ What Was Created

### 📁 Environment Files (Root Directory)
```
.env.example        # Template with all variables
.env.development    # Local development config (backend on localhost:8000)
.env.production     # Production config (ready for deployment)
```

### 🔧 Configuration Files (`src/config/`)
```
env.ts             # Environment configuration with type safety
axios.ts           # Axios client with interceptors
                   - Request interceptor (adds auth token, request ID)
                   - Response interceptor (handles errors, token refresh)
```

### 🎯 API Services (`src/services/`)
```
auth.service.ts       # Authentication (login, signup, logout, refresh)
contest.service.ts    # Contests (get, register, leaderboard)
problem.service.ts    # Problems (get, submit, submissions)
user.service.ts       # Users (profile, update, avatar)
submission.service.ts # Submissions (get, status)
index.ts              # Central export point
```

### 🪝 React Hooks (`src/hooks/`)
```
useApi.ts             # Custom hooks for API calls
                      - useApi (fetch with loading/error states)
                      - useMutation (POST/PUT/DELETE operations)
                      - usePagination (paginated data)
                      - usePolling (real-time updates)
                      - useDebounce (search optimization)
                      - useInfiniteScroll (load more)
```

### 📝 TypeScript Types (`src/types/`)
```
api.types.ts          # Complete type definitions
                      - API responses (success, error, paginated)
                      - Auth types (User, LoginRequest, SignupRequest)
                      - Contest types
                      - Problem types
                      - Submission types
                      - Leaderboard types
```

### 📚 Documentation (`docs/api/`)
```
README.md            # API overview & quick start
CORS_SETUP.md        # CORS configuration (FastAPI, Express, Django)
ENVIRONMENT.md       # Environment variables guide
ERROR_HANDLING.md    # Error handling best practices
SECURITY.md          # Security guidelines & checklist
```

## 🚀 Key Features

### 1. Production-Ready Architecture
- ✅ Type-safe configuration
- ✅ Centralized error handling
- ✅ Automatic token refresh
- ✅ Request/response interceptors
- ✅ Environment-based configuration

### 2. Security
- ✅ HTTP-only cookies for tokens
- ✅ CSRF protection (SameSite cookies)
- ✅ Secure flag in production
- ✅ Request timeout (30s)
- ✅ Error message sanitization

### 3. Developer Experience
- ✅ Complete TypeScript types
- ✅ Reusable React hooks
- ✅ Consistent API patterns
- ✅ Debug logging in development
- ✅ Comprehensive documentation

### 4. Flexibility
- ✅ Easy migration from local to remote backend
- ✅ Environment-based configuration
- ✅ No code changes needed for deployment

## 📖 Usage Examples

### Authentication

```typescript
import { authService } from '@/services'

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
})

// Tokens automatically stored in cookies
console.log(response.user)
```

### Using React Hooks

```typescript
import { useApi } from '@/hooks/useApi'
import { contestService } from '@/services'

function ContestsPage() {
  const { data, loading, error, refetch } = useApi(
    () => contestService.getContests({ page: 1, limit: 10 }),
    []
  )

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />
  
  return <ContestList contests={data?.data} />
}
```

### Direct API Calls

```typescript
import { api } from '@/config/axios'

const response = await api.post('/problems/123/submit', {
  code: 'print("Hello")',
  language: 'python'
})
```

## 🔐 Authentication Flow

1. **Login/Signup** → Tokens stored in HTTP-only cookies
2. **API Request** → Token automatically attached via interceptor
3. **Token Expired** → Automatic refresh attempted
4. **Refresh Failed** → Redirect to login
5. **Logout** → Tokens cleared from cookies

## 🌐 CORS Configuration

### Backend Required Setup

Your backend must configure CORS to accept requests:

**FastAPI:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)
```

**Express:**
```javascript
app.use(cors({
  origin: 'http://localhost:3003',
  credentials: true,
}))
```

## 🚦 Getting Started

### 1. Install Dependencies

```bash
npm install axios react-cookie
```

### 2. Start Backend

```bash
# Your backend should run on port 8000
cd ../backend
# ... start your backend
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Test API Connection

```typescript
// Test in browser console
import { authService } from '@/services'
const isAuth = authService.isAuthenticated()
console.log('Authenticated:', isAuth)
```

## 🔄 Deployment

### When Backend is Deployed

1. Update `.env.production`:
```env
VITE_API_BASE_URL=https://api.flux.example.com
VITE_COOKIE_DOMAIN=.flux.example.com
VITE_COOKIE_SECURE=true
```

2. Update backend CORS to include production URL

3. Build and deploy:
```bash
npm run build
# Deploy dist/ folder
```

## 📝 Environment Variables

### Development
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false
VITE_ENABLE_DEBUG_MODE=true
```

### Production
```env
VITE_API_BASE_URL=https://api.flux.example.com
VITE_COOKIE_DOMAIN=.flux.example.com
VITE_COOKIE_SECURE=true
VITE_ENABLE_DEBUG_MODE=false
```

## 🛠️ API Endpoints

All endpoints are defined in `src/config/env.ts`:

```typescript
API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    // ...
  },
  CONTESTS: { /* ... */ },
  PROBLEMS: { /* ... */ },
  USERS: { /* ... */ },
  SUBMISSIONS: { /* ... */ },
}
```

## 🐛 Troubleshooting

### Common Issues

**CORS Error**: Backend CORS not configured → See `docs/api/CORS_SETUP.md`

**401 Unauthorized**: Token expired → Automatic refresh should handle this

**Network Error**: Backend not running or wrong URL → Check `VITE_API_BASE_URL`

**Cookies Not Sent**: `credentials: true` not set → Already configured in axios.ts

## 📚 Documentation

For detailed information, see:
- [API Overview](../docs/api/README.md)
- [CORS Setup](../docs/api/CORS_SETUP.md)
- [Environment Variables](../docs/api/ENVIRONMENT.md)
- [Error Handling](../docs/api/ERROR_HANDLING.md)
- [Security](../docs/api/SECURITY.md)

## ✨ Industry Standards Followed

- ✅ Separation of concerns (config, services, hooks, types)
- ✅ TypeScript for type safety
- ✅ Environment-based configuration
- ✅ Centralized error handling
- ✅ Request/response interceptors
- ✅ Secure token storage (HTTP-only cookies)
- ✅ CSRF protection
- ✅ Automatic token refresh
- ✅ Comprehensive documentation
- ✅ Production-ready architecture

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

