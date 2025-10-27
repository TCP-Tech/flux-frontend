# Environment Variables Guide

Complete guide for configuring environment variables in the Flux frontend application.

## 📁 Environment Files

The project uses three environment files:

- `.env.example` - Template with all available variables
- `.env.development` - Local development configuration
- `.env.production` - Production deployment configuration

## 🔧 Available Variables

### API Configuration

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:8000

# API request timeout in milliseconds
VITE_API_TIMEOUT=30000
```

### Environment

```env
# Current environment: development, production, or test
VITE_ENV=development
```

### Feature Flags

```env
# Enable mock API for development without backend
VITE_ENABLE_MOCK_API=false

# Enable debug logging in console
VITE_ENABLE_DEBUG_MODE=true
```

### Cookie Configuration

```env
# Domain for storing cookies
# Use 'localhost' for local development
# Use '.flux.example.com' for production (note the leading dot)
VITE_COOKIE_DOMAIN=localhost

# Enable secure flag on cookies (HTTPS only)
# false for local development, true for production
VITE_COOKIE_SECURE=false
```

### App Information

```env
# Application name
VITE_APP_NAME=Flux

# Application version
VITE_APP_VERSION=1.0.0
```

## 🏠 Local Development Setup

### 1. Create .env.development

This file is already created for you with:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENV=development
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_DEBUG_MODE=true
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false
VITE_APP_NAME=Flux
VITE_APP_VERSION=1.0.0
```

### 2. Start Your Backend

Ensure your backend is running on the port specified in `VITE_API_BASE_URL`:

```bash
# Example for Python/FastAPI backend
cd ../flux-backend
uvicorn main:app --reload --port 8000
```

### 3. Start Frontend

```bash
npm run dev
```

The frontend will automatically use `.env.development` when running in development mode.

## 🚀 Production Deployment

### 1. Update .env.production

```env
VITE_API_BASE_URL=https://api.flux.example.com
VITE_API_TIMEOUT=30000
VITE_ENV=production
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_DEBUG_MODE=false
VITE_COOKIE_DOMAIN=.flux.example.com
VITE_COOKIE_SECURE=true
VITE_APP_NAME=Flux
VITE_APP_VERSION=1.0.0
```

### 2. Build for Production

```bash
npm run build
```

Vite will automatically use `.env.production` when building for production.

### 3. Deploy

Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

## 🔐 Security Best Practices

### 1. Never Commit Sensitive Data

❌ **DON'T:**
```env
VITE_API_KEY=super_secret_key_123
VITE_DATABASE_URL=postgresql://user:pass@host/db
```

✅ **DO:**
```env
# Use only non-sensitive configuration
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Use Server-Side Variables for Secrets

Sensitive data should NEVER be in frontend environment variables. They are exposed to the browser!

**Frontend** (Public, exposed to browser):
- API URLs
- Feature flags
- Public configuration

**Backend** (Private, server-only):
- API keys
- Database credentials
- JWT secrets
- Third-party service credentials

### 3. Different Configs for Different Environments

Always use separate configurations:

```env
# Development - More logging, less security
VITE_ENABLE_DEBUG_MODE=true
VITE_COOKIE_SECURE=false

# Production - Less logging, more security
VITE_ENABLE_DEBUG_MODE=false
VITE_COOKIE_SECURE=true
```

## 📝 Accessing Variables in Code

### In TypeScript/React

Environment variables are accessed via the config file:

```typescript
import { config } from '@/config/env'

// Access variables
const apiUrl = config.apiBaseUrl
const isDebug = config.enableDebugMode

// Or use helper functions
import { isDevelopment, isProduction } from '@/config/env'

if (isDevelopment()) {
  console.log('Running in development mode')
}
```

### Type Safety

All variables are typed in `src/config/env.ts`:

```typescript
interface EnvConfig {
  apiBaseUrl: string
  apiTimeout: number
  env: 'development' | 'production' | 'test'
  enableMockApi: boolean
  enableDebugMode: boolean
  cookieDomain: string
  cookieSecure: boolean
  appName: string
  appVersion: string
}
```

## 🧪 Testing Different Configurations

### Temporary Override

You can temporarily override variables:

```bash
# Linux/Mac
VITE_API_BASE_URL=http://localhost:9000 npm run dev

# Windows (PowerShell)
$env:VITE_API_BASE_URL="http://localhost:9000"; npm run dev
```

### Multiple Backend Instances

Create custom environment files:

```bash
# .env.development.team1
VITE_API_BASE_URL=http://localhost:8000

# .env.development.team2
VITE_API_BASE_URL=http://localhost:9000
```

Load specific file:

```bash
npm run dev -- --mode development.team1
```

## 🔍 Debugging Environment Issues

### 1. Check Which File is Loaded

```typescript
// Add to src/main.tsx temporarily
console.log('Environment:', import.meta.env.MODE)
console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
```

### 2. Verify Build Output

After building:

```bash
npm run build
cat dist/assets/index-*.js | grep VITE_
```

### 3. Common Issues

**Issue**: Changes not reflected

**Solution**: Restart dev server after changing .env files

```bash
# Stop server (Ctrl+C)
npm run dev
```

**Issue**: Variables undefined

**Solution**: Ensure variable names start with `VITE_`

```env
# ❌ Won't work
API_BASE_URL=http://localhost:8000

# ✅ Works
VITE_API_BASE_URL=http://localhost:8000
```

**Issue**: Wrong environment file used

**Solution**: Check the build command

```json
// package.json
{
  "scripts": {
    "dev": "vite",  // Uses .env.development
    "build": "vite build",  // Uses .env.production
    "build:dev": "vite build --mode development"  // Uses .env.development
  }
}
```

## 📦 Environment Variables in CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Create .env.production
        run: |
          echo "VITE_API_BASE_URL=${{ secrets.API_BASE_URL }}" >> .env.production
          echo "VITE_COOKIE_DOMAIN=${{ secrets.COOKIE_DOMAIN }}" >> .env.production
          echo "VITE_COOKIE_SECURE=true" >> .env.production
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        run: # ... deployment steps
```

### Vercel

Set environment variables in Vercel dashboard:

1. Go to Project Settings
2. Navigate to Environment Variables
3. Add variables:
   - `VITE_API_BASE_URL` = `https://api.flux.example.com`
   - `VITE_COOKIE_DOMAIN` = `.flux.example.com`
   - `VITE_COOKIE_SECURE` = `true`

### Netlify

Create `netlify.toml`:

```toml
[build.environment]
  VITE_API_BASE_URL = "https://api.flux.example.com"
  VITE_COOKIE_DOMAIN = ".flux.example.com"
  VITE_COOKIE_SECURE = "true"
```

Or set in Netlify dashboard under Site settings → Build & deploy → Environment

## ✅ Checklist

Before deploying:

- [ ] `.env.production` created with production values
- [ ] `VITE_API_BASE_URL` points to production API
- [ ] `VITE_COOKIE_SECURE` set to `true`
- [ ] `VITE_COOKIE_DOMAIN` matches production domain
- [ ] `VITE_ENABLE_DEBUG_MODE` set to `false`
- [ ] No sensitive data in environment files
- [ ] Backend CORS configured for production URL
- [ ] SSL/HTTPS enabled on both frontend and backend

---

**Built with ❤️ by Skills and Mentorship Team**  
**Turing Club of Programmers, NIT Raipur**

