# Backend Integration Configuration Summary

The frontend has been configured to connect to the Go backend.

## ✅ What's Configured

### Environment
- **Backend URL**: `http://localhost:8080/v1` (port 8080 with /v1 prefix)
- **Cookie Name**: `jwt_session` (matches backend middleware)
- **Debug Mode**: Enabled for development

### API Endpoints Mapped
- ✅ Authentication (`/auth/login`, `/auth/signup`, `/auth/reset-password`)
- ✅ User Profile (`/me`)
- ✅ Contests (search, register, leaderboard, problems)
- ✅ Problems (search, submit, testcases)
- ✅ Tournaments (with rounds)
- ✅ Locks (admin operations)

### Types Updated
- ✅ Login uses `user_name` or `roll_no` instead of email
- ✅ Signup requires `roll_no` (8-digit), `first_name`, `last_name`
- ✅ User object matches backend structure (`user_name`, `roll_no`, etc.)
- ✅ Backend sets JWT in HTTP-only cookie (no Authorization header needed)

## ⚠️ Backend CORS Issue

**IMPORTANT**: The backend has `AllowCredentials: false` in CORS configuration, which will prevent cookies from being sent. This needs to be fixed on the backend, but per your instructions, I have not edited the backend.

### Current Backend CORS (line 166 in cmd/main.go):
```go
AllowedOrigins:   []string{"https://*", "http://*"},
AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
AllowedHeaders:   []string{"*"},
AllowCredentials: false,  // ❌ THIS MUST BE TRUE
```

### Required Backend CORS Fix:
```go
AllowedOrigins:   []string{"http://localhost:3003"},  // Specific origin required
AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
AllowedHeaders:   []string{"*"},
AllowCredentials: true,  // ✅ MUST BE TRUE for cookies
```

**Note**: When `AllowCredentials: true`, you CANNOT use wildcards in `AllowedOrigins`. You must specify exact origins.

## 🧪 Testing

### 1. Start Backend
```bash
cd flux-backend
# Make sure .env has DB_URL and other required vars
go run cmd/main.go
```

### 2. Start Frontend
```bash
cd flux-frontend
npm install axios  # If not already installed
npm run dev
```

### 3. Test Login
Open browser console and test:
```javascript
// Test API connection
fetch('http://localhost:8080/v1/healthz')
  .then(r => r.text())
  .then(console.log)

// Test login (after fixing CORS)
fetch('http://localhost:8080/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',  // Important for cookies
  body: JSON.stringify({
    roll_no: '12345678',
    password: 'yourpassword'
  })
}).then(r => r.json()).then(console.log)
```

## 📝 Backend Endpoints Used

```
GET  /v1/healthz                    - Health check
GET  /v1/me                         - Get current user (requires auth)
POST /v1/auth/login                 - Login
POST /v1/auth/signup                - Signup  
GET  /v1/auth/signup                - Send signup email
GET  /v1/auth/reset-password        - Send reset email
POST /v1/auth/reset-password        - Reset password
GET  /v1/contests                   - Get contest by ID (query param)
POST /v1/contests/search            - Search contests
GET  /v1/contests/problems          - Get contest problems
GET  /v1/contests/users             - Get contest users
PUT  /v1/contests/users             - Register for contest
GET  /v1/contests/user-registered   - User's registered contests
GET  /v1/problems/standard          - Get problem by ID
POST /v1/problems/search            - Search problems
GET  /v1/tournaments                - Get tournament
POST /v1/tournaments/search         - Search tournaments
GET  /v1/tournaments/rounds         - Get tournament round
```

## 🔐 Authentication Flow

1. **Login** → Backend sets `jwt_session` cookie (HTTP-only)
2. **Subsequent Requests** → Cookie automatically sent by browser
3. **Session Expired (401)** → Frontend redirects to login
4. **Logout** → Backend clears cookie

## 🚀 Usage Example

```typescript
import { authService } from '@/services'

// Login
const response = await authService.login({
  roll_no: '12345678',
  password: 'mypassword',
  remember_for_month: true
})

console.log('Logged in as:', response.user_name)

// Get current user
const user = await authService.getCurrentUser()
console.log('User:', user)
```

## 🔧 Next Steps

1. **Fix Backend CORS** (required for cookies to work):
   ```go
   AllowCredentials: true,
   AllowedOrigins: []string{"http://localhost:3003"},
   ```

2. **Test Authentication**:
   - Try logging in from the frontend
   - Check browser DevTools → Network → Cookies
   - Verify `jwt_session` cookie is set

3. **Update Production Config**:
   - Update `.env.production` with production backend URL
   - Update backend CORS to include production frontend URL

## 📚 Documentation

- [API Documentation](./docs/api/README.md)
- [CORS Setup Guide](./docs/api/CORS_SETUP.md)
- [Environment Variables](./docs/api/ENVIRONMENT.md)

---

**Note**: Remember to fix the CORS configuration in the backend before deploying to production!

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

