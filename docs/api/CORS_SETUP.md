# CORS Configuration Guide

Complete guide for setting up CORS (Cross-Origin Resource Sharing) between Flux frontend and backend.

## 🌐 What is CORS?

CORS is a security feature that allows or restricts resources on a web page to be requested from another domain. Since the Flux frontend and backend run on different origins (even localhost:3003 and localhost:8000 are different), CORS must be properly configured.

## ⚙️ Backend Configuration

### For FastAPI (Python)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Development origins
dev_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
]

# Production origin
prod_origins = [
    "https://flux.example.com",
    "https://www.flux.example.com",
]

# Combine based on environment
import os
environment = os.getenv("ENVIRONMENT", "development")
allowed_origins = dev_origins if environment == "development" else prod_origins + dev_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,  # CRITICAL: Required for cookies
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

@app.get("/")
def read_root():
    return {"message": "Flux API"}
```

### For Express (Node.js)

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Development origins
const devOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
];

// Production origins
const prodOrigins = [
  'https://flux.example.com',
  'https://www.flux.example.com',
];

// Combine based on environment
const environment = process.env.NODE_ENV || 'development';
const allowedOrigins = environment === 'production' 
  ? prodOrigins 
  : [...devOrigins, ...prodOrigins];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // CRITICAL: Required for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  maxAge: 3600,  // Cache preflight requests for 1 hour
}));

app.get('/', (req, res) => {
  res.json({ message: 'Flux API' });
});

app.listen(8000, () => {
  console.log('Server running on port 8000');
});
```

### For Django (Python)

Install django-cors-headers:
```bash
pip install django-cors-headers
```

Configure in `settings.py`:
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
    # ...
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top
    'django.middleware.common.CommonMiddleware',
    # ...
]

# Development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
]

# Production - add your production URLs
# CORS_ALLOWED_ORIGINS += [
#     "https://flux.example.com",
#     "https://www.flux.example.com",
# ]

# CRITICAL: Required for cookies
CORS_ALLOW_CREDENTIALS = True

# Additional settings
CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'OPTIONS',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-request-id',
]

CORS_EXPOSE_HEADERS = ['X-Request-ID']
CORS_PREFLIGHT_MAX_AGE = 3600
```

## 🔑 Critical CORS Settings

### 1. `allow_credentials: true`

**Required for cookies!** This allows the browser to send cookies with cross-origin requests.

```python
# Backend
allow_credentials=True
```

```typescript
// Frontend (already configured in axios.ts)
withCredentials: true
```

### 2. Specific Origins (No Wildcards)

When `credentials: true`, you CANNOT use `*` for origins:

❌ **WRONG:**
```python
allow_origins=["*"]  # Won't work with credentials
```

✅ **CORRECT:**
```python
allow_origins=[
    "http://localhost:3003",
    "https://flux.example.com"
]
```

### 3. Handle Preflight Requests

Browsers send an OPTIONS request before the actual request. Your backend must handle these:

```python
# FastAPI automatically handles OPTIONS
# Express needs explicit handling:

app.options('*', cors())  // Enable pre-flight across-the-board
```

## 🧪 Testing CORS

### 1. Using Browser DevTools

Open Network tab and check:
- Request headers show `Origin: http://localhost:3003`
- Response headers show `Access-Control-Allow-Origin: http://localhost:3003`
- Response headers show `Access-Control-Allow-Credentials: true`

### 2. Using cURL

```bash
# Test OPTIONS request (preflight)
curl -X OPTIONS http://localhost:8000/api/contests \
  -H "Origin: http://localhost:3003" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test GET request
curl -X GET http://localhost:8000/api/contests \
  -H "Origin: http://localhost:3003" \
  -H "Cookie: flux_jwt_session=your_token" \
  --cookie-jar cookies.txt \
  -v
```

### 3. Test Checklist

✅ Simple GET request works  
✅ POST request with JSON works  
✅ Cookies are sent with request  
✅ Cookies are received from response  
✅ Preflight OPTIONS request succeeds  
✅ Custom headers (Authorization) work  

## 🐛 Common CORS Errors

### Error 1: "No 'Access-Control-Allow-Origin' header"

**Cause**: CORS not configured on backend

**Solution**: Add CORS middleware as shown above

### Error 2: "Credentials flag is true, but Access-Control-Allow-Credentials is false"

**Cause**: `allow_credentials` not set to `true`

**Solution**: 
```python
allow_credentials=True
```

### Error 3: "Origin is not allowed"

**Cause**: Frontend origin not in allowed origins list

**Solution**: Add your frontend URL to `allow_origins`:
```python
allow_origins=["http://localhost:3003"]
```

### Error 4: "Preflight request failed"

**Cause**: OPTIONS requests not handled

**Solution**: Ensure OPTIONS method is allowed:
```python
allow_methods=["OPTIONS", "GET", "POST", "PUT", "DELETE"]
```

### Error 5: "Cookie not being sent"

**Causes**:
1. `withCredentials: true` not set on frontend ✅ (Already set in axios.ts)
2. `allow_credentials: true` not set on backend
3. Cookie domain mismatch
4. HTTPS/Secure flag issues

**Solutions**:
- Set `allow_credentials=True` on backend
- Use `localhost` (not `127.0.0.1`) consistently
- In production, use proper domain in `.env.production`

## 🔒 Security Considerations

### 1. Don't Use Wildcards in Production

```python
# ❌ NEVER DO THIS
allow_origins=["*"]  # Exposes your API to everyone
```

### 2. Validate Origins Dynamically

```python
def validate_origin(origin: str) -> bool:
    allowed = [
        "https://flux.example.com",
        "https://www.flux.example.com"
    ]
    if os.getenv("ENVIRONMENT") == "development":
        allowed.extend([
            "http://localhost:3000",
            "http://localhost:3003",
        ])
    return origin in allowed
```

### 3. Use Environment Variables

```python
import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3003").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
)
```

## 🌍 Production Deployment

### 1. Update Backend CORS

```python
# Production only
allow_origins=[
    "https://flux.example.com",
    "https://www.flux.example.com"
]
```

### 2. Update Frontend Environment

```env
# .env.production
VITE_API_BASE_URL=https://api.flux.example.com
VITE_COOKIE_DOMAIN=.flux.example.com  # Note the leading dot
VITE_COOKIE_SECURE=true
```

### 3. Enable HTTPS

- Backend must be served over HTTPS
- Frontend must be served over HTTPS
- Mixed content (HTTPS → HTTP) will be blocked by browsers

## 📚 Additional Resources

- [MDN Web Docs - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)
- [Express CORS Package](https://expressjs.com/en/resources/middleware/cors.html)

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

