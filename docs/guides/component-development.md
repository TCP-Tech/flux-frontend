# Component Development Guide

## Overview
This guide provides patterns and best practices for building UI components in the Flux frontend application.

## Component Structure

### Functional Component Pattern

```typescript
// MyComponent.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  description?: string;
  isActive?: boolean;
  onAction?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function MyComponent({
  title,
  description,
  isActive = false,
  onAction,
  className,
  children
}: MyComponentProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Side effects here
    console.log('Component mounted');
    
    return () => {
      // Cleanup
      console.log('Component unmounted');
    };
  }, []);
  
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-neutral-900 border-neutral-800",
      "hover:border-neutral-700 transition-colors",
      isActive && "border-primary-600",
      className
    )}>
      <h3 className="text-xl font-bold text-neutral-50">{title}</h3>
      
      {description && (
        <p className="mt-2 text-neutral-400">{description}</p>
      )}
      
      {children}
      
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white font-medium transition-colors"
        >
          Action
        </button>
      )}
    </div>
  );
}

export default MyComponent;
```

## Component Categories

### 1. Page Components

Located in `src/pages/`, these are top-level route components.

```typescript
// src/pages/DashboardPage.tsx
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';

function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-neutral-50">
          Welcome, {user?.user_name}
        </h1>
        {/* Page content */}
      </main>
    </div>
  );
}

export default DashboardPage;
```

### 2. Layout Components

Reusable layout structures.

```typescript
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Layout() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
```

### 3. UI Components

Reusable UI elements.

```typescript
// src/components/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white border border-primary-600",
    secondary: "bg-secondary-600 hover:bg-secondary-700 text-white border border-secondary-600",
    ghost: "bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-700 hover:border-neutral-600",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-600"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
```

### 4. Form Components

Input and form elements.

```typescript
// src/components/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 rounded-md",
            "bg-neutral-900 border border-neutral-700",
            "text-neutral-50 placeholder:text-neutral-500",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

## Custom Hooks

### useAuth Hook

```typescript
// src/hooks/useAuth.ts
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
}

export function useAuth() {
  const [cookies, , removeCookie] = useCookies(['flux_jwt_session']);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const isAuthenticated = !!cookies.flux_jwt_session;
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);
  
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    removeCookie('flux_jwt_session', { path: '/' });
    setUser(null);
    navigate('/login');
  };
  
  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false;
  };
  
  return {
    user,
    isAuthenticated,
    loading,
    logout,
    hasRole,
  };
}
```

### useAPI Hook

```typescript
// src/hooks/useAPI.ts
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

interface UseAPIOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAPI<T>(
  endpoint: string,
  options: UseAPIOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const execute = async (params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(endpoint, { params });
      setData(response.data);
      onSuccess?.(response.data);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.error || 'An error occurred';
      setError(message);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [endpoint, immediate]);
  
  return { data, loading, error, execute };
}
```

## Component Patterns

### Loading State

```typescript
function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }
  
  return <div>Content</div>;
}
```

### Error Boundary

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-50 mb-4">
              Something went wrong
            </h1>
            <p className="text-neutral-400 mb-6">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-md text-white"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### Conditional Rendering

```typescript
function MyComponent({ user }: { user: User | null }) {
  // Early return pattern
  if (!user) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      {/* Conditional with && */}
      {user.roles.includes('role_manager') && (
        <button>Manager Action</button>
      )}
      
      {/* Ternary operator */}
      {user.verified ? (
        <span className="text-green-500">Verified</span>
      ) : (
        <span className="text-yellow-500">Not Verified</span>
      )}
      
      {/* Optional chaining */}
      <p>{user.profile?.bio ?? 'No bio available'}</p>
    </div>
  );
}
```

## Styling Best Practices

### Using cn() Utility

```typescript
import { cn } from '@/lib/utils';

// Combine classes
<div className={cn("base-class", "another-class")} />

// Conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  isDisabled && "disabled-class"
)} />

// Override with props
<div className={cn("default-padding", className)} />

// Complex conditions
<div className={cn(
  "base",
  {
    "active": isActive,
    "disabled": isDisabled,
    "error": hasError
  }
)} />
```

### Responsive Design

```typescript
<div className={cn(
  // Mobile first
  "flex flex-col gap-4",
  // Tablet
  "md:flex-row md:gap-6",
  // Desktop
  "lg:gap-8 lg:max-w-7xl lg:mx-auto"
)}>
  Content
</div>
```

### Dark Theme Colors

```typescript
// Backgrounds
"bg-neutral-950"  // Page background
"bg-neutral-900"  // Card background
"bg-neutral-800"  // Elevated/hover background

// Text
"text-neutral-50"   // Primary text
"text-neutral-300"  // Secondary text
"text-neutral-400"  // Tertiary/muted text

// Borders
"border-neutral-800"  // Default border
"border-neutral-700"  // Hover border

// Actions
"bg-primary-600 hover:bg-primary-700"  // Primary button
"bg-secondary-600 hover:bg-secondary-700"  // Secondary button
```

## Testing Components (Future)

```typescript
// Example test with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('is disabled when loading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Best Practices

### 1. Component Organization
- One component per file
- Export default at the end
- Define interfaces above component
- Group related imports

### 2. Props
- Use TypeScript interfaces
- Provide default values
- Optional props with `?`
- Spread remaining props with `...props`

### 3. State Management
- Use `useState` for local state
- Use `useReducer` for complex state
- Lift state up when needed
- Use context for global state

### 4. Performance
- Use `React.memo` for expensive components
- Use `useCallback` for stable function references
- Use `useMemo` for expensive calculations
- Avoid inline object/array creation in render

### 5. Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Maintain proper heading hierarchy
- Provide alt text for images

---

**Last Updated**: October 2025  
**Related Docs**:
- [Dark Theme Guide](./DARK_THEME_GUIDE.md)
- [Routing Guide](../guides/ROUTING_GUIDE.md)

