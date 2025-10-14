# Security Best Practices

Complete security guide for the Flux frontend application.

## 🔐 Implemented Security Features

### 1. Secure Token Storage

✅ **HTTP-Only Cookies** for JWT tokens
- Tokens stored in HTTP-only cookies (not localStorage)
- Protected from XSS attacks
- Automatic inclusion in requests

```typescript
// Configured in auth.service.ts
cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
  path: '/',
  domain: config.cookieDomain,
  secure: config.cookieSecure,  // HTTPS only in production
  sameSite: 'lax',              // CSRF protection
  maxAge: 15 * 60,              // 15 minutes
})
```

### 2. CSRF Protection

✅ **SameSite Cookies**
- `sameSite: 'lax'` prevents cross-site request forgery
- Cookies only sent on same-site requests or safe cross-site requests

### 3. Automatic Token Refresh

✅ **Transparent Token Renewal**
- Expired tokens automatically refreshed
- No user interaction required
- Fallback to login if refresh fails

```typescript
// Implemented in axios.ts interceptor
if (error.response?.status === 401 && !originalRequest._retry) {
  // Attempt token refresh
  const newToken = await refreshToken()
  // Retry request with new token
}
```

### 4. Request Timeout

✅ **30-Second Timeout**
- Prevents hanging requests
- Configurable via environment variables

### 5. HTTPS Enforcement (Production)

✅ **Secure Flag on Cookies**
```env
# Production only
VITE_COOKIE_SECURE=true
```

## 🛡️ Frontend Security Best Practices

### 1. Input Validation

Always validate user input on frontend AND backend:

```typescript
// Example validation
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

function validatePassword(password: string): boolean {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password)
}
```

### 2. XSS Prevention

❌ **NEVER use `dangerouslySetInnerHTML`**

```typescript
// ❌ BAD - Vulnerable to XSS
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ GOOD - React escapes by default
<div>{userInput}</div>
```

If you must render HTML, sanitize it:

```typescript
import DOMPurify from 'dompurify'

<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 3. Sensitive Data Handling

❌ **DON'T Store Secrets in Frontend**

```typescript
// ❌ NEVER DO THIS
const API_KEY = 'sk_live_abc123'  // Exposed to users!
const JWT_SECRET = 'secret123'     // Anyone can decode JWTs!
```

✅ **DO Keep Secrets on Backend**

```typescript
// ✅ Frontend only stores non-sensitive config
const API_URL = config.apiBaseUrl
const isDebug = config.enableDebugMode
```

### 4. Avoid Exposing User Data

```typescript
// ❌ BAD - Logs sensitive data
console.log('User data:', userData)

// ✅ GOOD - Only log necessary info
if (isDevelopment()) {
  console.log('User ID:', userData.id)
}
```

### 5. Rate Limiting (Backend Required)

Frontend should handle rate limit responses:

```typescript
if (error.response?.status === 429) {
  const retryAfter = error.response.headers['retry-after']
  toast.error(`Too many requests. Try again in ${retryAfter} seconds`)
}
```

## 🔒 Authentication Security

### 1. Password Requirements

Enforce strong passwords:

```typescript
const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false,
}

function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`)
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Must contain an uppercase letter')
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Must contain a lowercase letter')
  }

  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Must contain a number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
```

### 2. Session Management

```typescript
// Clear session on logout
const handleLogout = async () => {
  await authService.logout()
  
  // Clear all local data
  localStorage.clear()
  sessionStorage.clear()
  
  // Redirect to login
  navigate('/login')
}
```

### 3. Idle Timeout

Implement automatic logout after inactivity:

```typescript
import { useEffect } from 'react'

function useIdleTimeout(timeoutMs: number = 15 * 60 * 1000) {
  useEffect(() => {
    let timeout: NodeJS.Timeout

    const resetTimeout = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        // Auto logout
        authService.logout()
        window.location.href = '/login?reason=idle'
      }, timeoutMs)
    }

    // Reset on user activity
    window.addEventListener('mousemove', resetTimeout)
    window.addEventListener('keypress', resetTimeout)
    window.addEventListener('click', resetTimeout)
    window.addEventListener('scroll', resetTimeout)

    resetTimeout()

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('mousemove', resetTimeout)
      window.removeEventListener('keypress', resetTimeout)
      window.removeEventListener('click', resetTimeout)
      window.removeEventListener('scroll', resetTimeout)
    }
  }, [timeoutMs])
}
```

## 🚫 Content Security Policy (CSP)

Add CSP headers to prevent XSS:

```html
<!-- In index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' data:;
    connect-src 'self' http://localhost:8000 https://api.flux.example.com;
    frame-ancestors 'none';
  "
/>
```

Or configure in Vite:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; ..."
    }
  }
})
```

## 🔍 Security Audit Checklist

### Authentication
- [ ] Passwords hashed on backend (bcrypt/argon2)
- [ ] JWT tokens have expiration
- [ ] Refresh tokens implemented
- [ ] HTTP-only cookies used for tokens
- [ ] HTTPS enforced in production
- [ ] Password reset flow secure (time-limited tokens)
- [ ] Email verification implemented
- [ ] Account lockout after failed attempts (backend)

### Authorization
- [ ] Role-based access control (RBAC) on backend
- [ ] API endpoints validate permissions
- [ ] Frontend hides unauthorized UI elements
- [ ] Direct object references protected (backend)

### Data Protection
- [ ] Sensitive data never logged
- [ ] PII encrypted in transit (HTTPS)
- [ ] PII encrypted at rest (backend)
- [ ] User data minimization
- [ ] GDPR compliance (if applicable)

### CORS & Origin
- [ ] CORS configured correctly
- [ ] Allowed origins whitelist (not *)
- [ ] Credentials enabled properly
- [ ] Preflight requests handled

### Input Validation
- [ ] Client-side validation
- [ ] Server-side validation (critical!)
- [ ] SQL injection prevention (backend)
- [ ] XSS prevention
- [ ] CSRF protection

### Dependencies
- [ ] Regular dependency updates
- [ ] No known vulnerabilities (`npm audit`)
- [ ] Dependabot enabled
- [ ] Lock file committed

## 🐛 Security Testing

### 1. Automated Security Scan

```bash
# Check for known vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check specific package
npm audit --package=axios
```

### 2. Manual Testing

#### Test XSS Protection
1. Input: `<script>alert('XSS')</script>`
2. Expected: Text displayed, not executed

#### Test CSRF Protection
1. Create malicious site with form
2. Try to submit to your API
3. Expected: Request blocked by CORS/SameSite

#### Test Authentication
1. Try accessing protected routes without token
2. Expected: Redirect to login

#### Test Authorization
1. Try accessing admin routes as regular user
2. Expected: 403 Forbidden

### 3. Penetration Testing Tools

- **OWASP ZAP**: Automated security scanner
- **Burp Suite**: Manual security testing
- **npm audit**: Vulnerability scanning

## 📋 Security Incident Response

### If a Security Issue is Found

1. **Assess Severity**
   - Critical: Data breach, authentication bypass
   - High: XSS, CSRF vulnerability
   - Medium: Information disclosure
   - Low: Minor configuration issue

2. **Immediate Actions**
   - For critical issues: Take service offline if needed
   - Revoke all active tokens
   - Force password reset if auth compromised
   - Notify affected users

3. **Fix and Deploy**
   - Patch vulnerability
   - Test thoroughly
   - Deploy fix immediately
   - Update dependencies

4. **Post-Incident**
   - Document incident
   - Review security practices
   - Conduct security training
   - Implement additional safeguards

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

