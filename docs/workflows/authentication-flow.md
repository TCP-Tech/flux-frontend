# Authentication Workflow

## Overview
The Flux platform uses a secure JWT-based authentication system with email verification for user registration and password reset capabilities.

## Authentication Flow Diagrams

### 1. User Sign Up Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Enter email
       ▼
┌─────────────────────┐
│  Signup Page        │
│  GET /auth/signup   │
└──────┬──────────────┘
       │
       │ 2. Backend sends verification email
       ▼
┌─────────────────────┐
│   Email Inbox       │
│  (Verification Code)│
└──────┬──────────────┘
       │
       │ 3. User enters verification token + details
       ▼
┌─────────────────────┐
│  POST /auth/signup  │
│  - first_name       │
│  - last_name        │
│  - roll_no (8 digits)│
│  - password         │
│  - verification_token│
└──────┬──────────────┘
       │
       │ 4. Account created + JWT cookie set
       ▼
┌─────────────────────┐
│   Dashboard         │
│  (Authenticated)    │
└─────────────────────┘
```

### 2. User Login Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Enter credentials (username/roll_no + password)
       ▼
┌─────────────────────┐
│   Login Page        │
│  POST /auth/login   │
│  - user_name OR     │
│    roll_no          │
│  - password         │
│  - remember_for_month│
└──────┬──────────────┘
       │
       │ 2. Backend validates credentials
       ▼
┌─────────────────────┐
│  JWT Cookie Set     │
│  flux_jwt_session   │
│  (HttpOnly, Secure) │
└──────┬──────────────┘
       │
       │ 3. Redirect to dashboard
       ▼
┌─────────────────────┐
│   Dashboard         │
│  (Authenticated)    │
└─────────────────────┘
```

### 3. Password Reset Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Click "Forgot Password"
       ▼
┌─────────────────────────┐
│  Password Reset Page    │
│  GET /auth/reset-password│
│  ?email={email}         │
└──────┬──────────────────┘
       │
       │ 2. Backend sends reset email
       ▼
┌─────────────────────┐
│   Email Inbox       │
│   (Reset Token)     │
└──────┬──────────────┘
       │
       │ 3. User enters token + new password
       ▼
┌─────────────────────────┐
│  POST /auth/reset-password│
│  - user_name OR roll_no │
│  - password (new)       │
│  - token                │
└──────┬──────────────────┘
       │
       │ 4. Password updated
       ▼
┌─────────────────────┐
│   Login Page        │
│ (with success msg)  │
└─────────────────────┘
```

### 4. Protected Route Access

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Navigate to protected route
       ▼
┌─────────────────────┐
│  Route Guard        │
│  Check JWT Cookie   │
└──────┬──────────────┘
       │
       ├─── Valid JWT ─────┐
       │                   ▼
       │            ┌─────────────────┐
       │            │ Protected Page  │
       │            │ (Render content)│
       │            └─────────────────┘
       │
       └─── No/Invalid JWT ──┐
                              ▼
                       ┌─────────────────┐
                       │  Login Page     │
                       │ (Redirect)      │
                       └─────────────────┘
```

## Authentication States

### User States
1. **Unauthenticated**: No JWT cookie present
2. **Authenticated**: Valid JWT cookie present
3. **Role-Based**: User has specific roles (role_user, role_manager, role_admin)

## JWT Cookie Details

### Cookie Configuration
- **Name**: `flux_jwt_session`
- **Attributes**:
  - `HttpOnly`: true (prevents JavaScript access)
  - `Secure`: true (HTTPS only in production)
  - `SameSite`: Lax (CSRF protection)
  - `Path`: /
  - **Expiry**: Based on `remember_for_month` flag
    - Default: Session cookie (browser close)
    - Remember: 30 days

### JWT Claims
```json
{
  "user_id": "uuid",
  "user_name": "string",
  "exp": "timestamp",
  "iat": "timestamp"
}
```

## Frontend Implementation

### 1. HTTP Client Configuration

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Important: Send cookies
  timeout: 30000,
});

// Response interceptor for 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any client state
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 2. Protected Route Component

```typescript
import { Navigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function ProtectedRoute({ children, requiredRole }: { 
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const [cookies] = useCookies(['flux_jwt_session']);
  
  if (!cookies.flux_jwt_session) {
    return <Navigate to="/login" replace />;
  }
  
  // Optional: Role-based access check
  if (requiredRole) {
    // Fetch user data and check roles
    // This would require a /me endpoint call
  }
  
  return <>{children}</>;
}
```

### 3. Authentication Hook

```typescript
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [cookies, setCookie, removeCookie] = useCookies(['flux_jwt_session']);
  const navigate = useNavigate();
  
  const isAuthenticated = !!cookies.flux_jwt_session;
  
  const logout = () => {
    removeCookie('flux_jwt_session', { path: '/' });
    navigate('/login');
  };
  
  return { isAuthenticated, logout };
}
```

## Security Best Practices

### Client-Side
1. ✅ **Never store JWT in localStorage** - Use HttpOnly cookies
2. ✅ **Always use HTTPS in production**
3. ✅ **Validate user input** before sending to API
4. ✅ **Implement CSRF protection** (SameSite cookie helps)
5. ✅ **Handle 401 errors** globally with interceptors
6. ✅ **Clear sensitive data** on logout

### Server-Side (Backend)
1. ✅ Password hashing with bcrypt
2. ✅ Email verification required
3. ✅ JWT expiration enforced
4. ✅ HttpOnly cookies prevent XSS
5. ✅ CORS configured properly
6. ✅ Rate limiting on auth endpoints

## Error Handling

### Common Error Responses

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | "Invalid request payload" | Missing or malformed data |
| 401 | "Authentication required" | JWT missing or expired |
| 403 | "Forbidden" | Valid JWT but insufficient permissions |
| 409 | "User already exists" | Duplicate email/username/roll_no |
| 404 | "User not found" | Invalid credentials |
| 500 | "Internal server error" | Backend issue |

### Frontend Error Display

```typescript
async function handleLogin(credentials: LoginCredentials) {
  try {
    await api.post('/auth/login', credentials);
    navigate('/dashboard');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || 'Login failed';
      showToast(message, 'error');
    }
  }
}
```

## User Roles & Permissions

### Role Hierarchy
1. **role_user** (Default)
   - View published contests
   - Participate in contests
   - View problems
   - Submit solutions

2. **role_manager**
   - All user permissions
   - Create/edit problems
   - Create/edit contests
   - Create/edit tournaments
   - Manage locks

3. **role_admin** (Future)
   - All manager permissions
   - User management
   - System settings

### Role-Based UI Elements

```typescript
function ManagerOnlyButton({ userRoles }: { userRoles: string[] }) {
  if (!userRoles.includes('role_manager')) {
    return null; // Hide button
  }
  
  return <button>Create Problem</button>;
}
```

## Session Management

### Session Duration
- **Default Session**: Until browser closes
- **Remember Me**: 30 days
- **Automatic Refresh**: Not implemented (requires refresh token)

### Logout Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Click "Logout"
       ▼
┌─────────────────────┐
│  Client-side        │
│  Remove JWT Cookie  │
└──────┬──────────────┘
       │
       │ 2. Clear client state
       ▼
┌─────────────────────┐
│  Redirect to Login  │
└─────────────────────┘
```

## Testing Authentication

### Manual Testing Steps

1. **Sign Up Flow**
   ```bash
   # Step 1: Request verification
   curl -X GET "http://localhost:8080/v1/auth/signup?email=test@example.com"
   
   # Step 2: Check email for token
   
   # Step 3: Complete signup
   curl -X POST "http://localhost:8080/v1/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{
       "first_name": "Test",
       "last_name": "User",
       "roll_no": "12345678",
       "password": "testpass",
       "email": "test@example.com",
       "verification_token": "TOKEN_FROM_EMAIL"
     }'
   ```

2. **Login**
   ```bash
   curl -X POST "http://localhost:8080/v1/auth/login" \
     -H "Content-Type: application/json" \
     -c cookies.txt \
     -d '{
       "user_name": "test_user",
       "password": "testpass",
       "remember_for_month": false
     }'
   ```

3. **Access Protected Route**
   ```bash
   curl -X GET "http://localhost:8080/v1/me" \
     -b cookies.txt
   ```

## Troubleshooting

### Common Issues

**Issue**: "JWT cookie not found"
- **Solution**: Ensure `withCredentials: true` in HTTP client
- **Check**: CORS allows credentials

**Issue**: Cookie not being set
- **Solution**: Check CORS configuration
- **Check**: Ensure same-origin or proper CORS headers

**Issue**: 401 after successful login
- **Solution**: Verify cookie is being sent with requests
- **Check**: Browser dev tools → Application → Cookies

**Issue**: Login works but protected routes fail
- **Solution**: Check JWT expiration
- **Solution**: Ensure cookie path is `/`

---

**Last Updated**: October 2025  
**Related Docs**: 
- [API Architecture](../architecture/FRONTEND_GUIDE.md)
- [Frontend Guide](../guides/QUICK_START.md)

