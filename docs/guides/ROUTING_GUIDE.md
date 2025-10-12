# React Router Setup Guide

## 🚀 Overview

Flux frontend is now configured with React Router v6 for client-side routing. This enables navigation between pages without full page reloads.

## 📦 Installed Packages

```json
{
  "react-router-dom": "^6.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x",
  "class-variance-authority": "^0.7.x",
  "lucide-react": "^0.400.x"
}
```

## 📁 Project Structure

```
src/
├── lib/
│   └── utils.ts              # Utility functions (cn, formatDate, etc.)
├── pages/
│   ├── auth/
│   │   ├── LoginPage.tsx     # Login page
│   │   └── SignupPage.tsx    # Signup page
│   ├── HomePage.tsx          # Landing page
│   └── NotFoundPage.tsx      # 404 page
├── App.tsx                   # Router configuration
└── main.tsx                  # Application entry
```

## 🔧 Current Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Landing page with hero section |
| `/login` | LoginPage | User login form |
| `/signup` | SignupPage | User registration form |
| `*` | NotFoundPage | 404 error page |

## 🎯 Adding New Routes

### Step 1: Create Page Component

Create a new file in `src/pages/`:

```tsx
// src/pages/ContestsPage.tsx
function ContestsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <h1 className="text-3xl font-bold text-neutral-50">Contests</h1>
      {/* Your content */}
    </div>
  )
}

export default ContestsPage
```

### Step 2: Add Route to App.tsx

```tsx
import ContestsPage from '@/pages/ContestsPage'

// In your Routes component:
<Route path="/contests" element={<ContestsPage />} />
```

## 🔐 Protected Routes (Coming Soon)

To protect routes that require authentication, you can create a ProtectedRoute wrapper:

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [cookies] = useCookies(['flux_jwt_session'])
  
  if (!cookies.flux_jwt_session) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Usage in App.tsx:
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## 🧰 Utility Functions

### cn() - Class Name Utility

Combines `clsx` and `tailwind-merge` for conditional classes:

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "p-4 rounded",
  isActive && "bg-primary-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)}>
  Content
</div>
```

### Date Formatting

```tsx
import { formatDate, formatDateTime, getRelativeTime } from '@/lib/utils'

formatDate(new Date())              // "Oct 12, 2025"
formatDateTime(new Date())          // "Oct 12, 2025, 9:30 PM"
getRelativeTime(new Date())         // "2 hours ago"
```

## 🎨 Navigation Examples

### Using Link Component

```tsx
import { Link } from 'react-router-dom'

<Link to="/contests" className="text-primary-500 hover:text-primary-400">
  View Contests
</Link>
```

### Programmatic Navigation

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate('/dashboard')
  }
  
  return <button onClick={handleClick}>Go to Dashboard</button>
}
```

### Navigate with State

```tsx
navigate('/contests', { 
  state: { from: 'homepage' } 
})

// In the target component:
import { useLocation } from 'react-router-dom'

function ContestsPage() {
  const location = useLocation()
  const from = location.state?.from
  
  return <div>Navigated from: {from}</div>
}
```

## 📄 Current Pages

### HomePage
- Landing page with hero section
- Features showcase
- Social media links
- Auth buttons (Login/Signup or Logout)

### LoginPage
- Email/username or roll number input
- Password field
- Remember me checkbox
- Forgot password link
- Sign up link

### SignupPage
- Email verification flow
- First name, last name
- Roll number (8 digits)
- Password
- Login link

### NotFoundPage
- 404 error display
- Home and back buttons
- Clean design matching theme

## 🎯 TODO: Pages to Create

Based on FRONTEND_GUIDE.md, you should create:

1. **Dashboard Pages**
   - `/dashboard` - User dashboard
   - `/dashboard/manager` - Manager dashboard (role-based)

2. **Problems**
   - `/problems` - Problem list with search/filters
   - `/problems/:id` - Problem detail page
   - `/problems/new` - Add problem (managers)
   - `/problems/:id/edit` - Edit problem (managers)

3. **Contests**
   - `/contests` - Contest list
   - `/contests/:id` - Contest detail with tabs
   - `/contests/new` - Create contest (managers)
   - `/contests/:id/edit` - Edit contest (managers)

4. **Tournaments**
   - `/tournaments` - Tournament list
   - `/tournaments/:id` - Tournament detail
   - `/tournaments/new` - Create tournament (managers)

5. **Locks**
   - `/locks` - Lock management (managers)
   - `/locks/new` - Create lock (managers)

6. **User**
   - `/profile` - User profile
   - `/profile/edit` - Edit profile
   - `/submissions` - Submission history
   - `/leaderboard` - Leaderboard page

7. **Auth**
   - `/reset-password` - Password reset page
   - `/verify-email` - Email verification page

## 🔒 Route Guards Pattern

```tsx
// src/lib/auth.ts
export function useAuth() {
  const [cookies] = useCookies(['flux_jwt_session'])
  const navigate = useNavigate()
  
  const isAuthenticated = !!cookies.flux_jwt_session
  const logout = () => {
    removeCookie('flux_jwt_session', { path: '/' })
    navigate('/login')
  }
  
  return { isAuthenticated, logout }
}

// Usage:
function ProtectedComponent() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <div>Protected Content</div>
}
```

## 📊 Layout Wrapper (Recommended)

Create a layout component for consistent navigation:

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  )
}

// In App.tsx:
<Route path="/" element={<Layout />}>
  <Route index element={<HomePage />} />
  <Route path="contests" element={<ContestsPage />} />
  <Route path="problems" element={<ProblemsPage />} />
</Route>
```

## 🚀 Best Practices

1. **Use Link for internal navigation** - Better performance than `<a>` tags
2. **Use useNavigate for programmatic** - After form submissions, etc.
3. **Lazy load routes** - For better initial load performance
4. **Protect sensitive routes** - Always check authentication
5. **Handle loading states** - Show loaders during navigation
6. **404 page** - Always have a catch-all route

## 🔄 Lazy Loading Routes (Optional)

For better performance with large applications:

```tsx
import { lazy, Suspense } from 'react'

const ContestsPage = lazy(() => import('@/pages/ContestsPage'))

<Route 
  path="/contests" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <ContestsPage />
    </Suspense>
  } 
/>
```

## 📚 Resources

- [React Router Docs](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) - API endpoints and requirements

---

**Happy routing! 🎯**

