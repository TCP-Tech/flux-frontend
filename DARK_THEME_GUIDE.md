# Flux Dark Theme Guide

## 🎨 Overview

The Flux frontend features a **clean dark theme** with:
- Professional dark color palette
- Centralized theme constants
- Gradient text styling
- Consistent design system

## 🆕 What's Included

### 1. Dark Color Palette
- Deep neutral background (`neutral-950`)
- High contrast text colors
- Brand colors (Primary, Secondary, Accent)
- Semantic colors (Success, Warning, Error, Info)

### 2. Theme Constants System
- Centralized color definitions in `src/constants/theme.ts`
- Easy to maintain and update colors across the app
- TypeScript-safe with const assertions

### 3. Clean Homepage Design
- Logo in top-left corner
- Social media links in bottom-left (desktop only)
- Auth buttons in top-right
- Large gradient hero text
- Simple action buttons
- Feature cards with hover effects

## 📁 Files Structure

```
src/
├── constants/
│   ├── theme.ts           # Centralized theme constants
│   └── README.md          # Theme usage documentation
├── App.tsx                # Homepage component
└── index.css              # Global styles
```

## 🎨 Theme Constants

### Quick Access

```typescript
import { COLORS, GRADIENTS, THEME } from '@/constants/theme'
```

### Color Palette

#### Background Colors
```typescript
COLORS.background.primary    // #000103 - Main dark background
COLORS.background.secondary  // #0a0a0a
COLORS.background.card       // #1a1a1a
COLORS.background.elevated   // #262626
```

#### Text Colors
```typescript
COLORS.text.primary    // #fafafa - Main white text
COLORS.text.secondary  // #d4d4d4 - Light gray
COLORS.text.tertiary   // #a3a3a3 - Medium gray
COLORS.text.muted      // #737373 - Muted gray
```

#### Brand Colors
```typescript
COLORS.primary[500]    // #3b82f6 - Primary blue
COLORS.secondary[500]  // #6366f1 - Secondary indigo
COLORS.accent[500]     // #06b6d4 - Accent cyan
```

#### Semantic Colors
```typescript
COLORS.success.DEFAULT  // Green for success states
COLORS.warning.DEFAULT  // Yellow for warnings
COLORS.error.DEFAULT    // Red for errors
COLORS.info.DEFAULT     // Blue for info
```

### Gradients

```typescript
GRADIENTS.primary    // 'linear-gradient(to bottom, #fafafa, #a3a3a3)'
GRADIENTS.secondary  // 'linear-gradient(to right, #3b82f6, #6366f1)'
```

## 🎯 Common Patterns

### Gradient Text (Hero Style)

```tsx
<h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
  Your Title
</h1>
```

Or use the utility class:
```tsx
<h1 className="text-6xl font-bold gradient-text-primary">
  Your Title
</h1>
```

### Dark Card

```tsx
<div className="p-6 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-700 transition-colors">
  Card content
</div>
```

### Primary Button

```tsx
<button className="h-12 px-6 rounded-md border border-primary-600 bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors">
  Button Text
</button>
```

### Ghost Button (Auth Style)

```tsx
<button className="h-10 px-4 rounded-md border border-neutral-700 bg-transparent text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600 transition-all font-medium">
  Login
</button>
```

## 🔧 Usage Examples

### Using Theme Constants

```tsx
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: COLORS.background.card,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        border: `1px solid ${COLORS.border.DEFAULT}`,
        color: COLORS.text.primary,
      }}
    >
      Content
    </div>
  )
}
```

### With Tailwind (Preferred)

```tsx
function MyComponent() {
  return (
    <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 text-neutral-50">
      Content
    </div>
  )
}
```

## 🎨 Design Tokens

### Spacing Scale
- `xs`: 0.25rem (4px)
- `sm`: 0.5rem (8px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)
- `3xl`: 4rem (64px)
- `4xl`: 6rem (96px)

### Border Radius
- `sm`: 0.25rem
- `md`: 0.5rem
- `lg`: 0.75rem
- `xl`: 1rem
- `2xl`: 1.5rem
- `full`: 9999px

### Transitions
- `fast`: 150ms
- `base`: 200ms
- `slow`: 300ms
- `slower`: 500ms

## 📱 Responsive Design

The dark theme is fully responsive:

```tsx
// Mobile: vertical buttons, smaller text
<div className="flex flex-col sm:flex-row gap-4">
  <button>Button 1</button>
  <button>Button 2</button>
</div>

// Text scaling
<h1 className="text-4xl md:text-6xl lg:text-8xl">
  Responsive Text
</h1>

// Hide on mobile
<div className="hidden md:flex">
  Desktop only content
</div>
```

## 🔐 Authentication Integration

The app uses `react-cookie` for JWT session management:

```tsx
import { useCookies } from 'react-cookie'

function MyComponent() {
  const [cookies, , removeCookie] = useCookies(['flux_jwt_session'])
  
  const isAuthenticated = !!cookies.flux_jwt_session
  
  const handleLogout = () => {
    removeCookie('flux_jwt_session', { path: '/' })
  }
  
  return isAuthenticated ? (
    <button onClick={handleLogout}>Logout</button>
  ) : (
    <button onClick={handleLogin}>Login</button>
  )
}
```

## 🎨 Color Philosophy

### Dark Theme Principles
1. **Deep neutral background** (neutral-950) for comfortable viewing
2. **High contrast text** (neutral-50) for readability
3. **Subtle borders** (neutral-800) for subtle separation
4. **Vibrant accents** (blue/indigo) for important actions
5. **Gradient text** for hero elements

### When to Use Each Color

| Element | Color | Tailwind Class |
|---------|-------|----------------|
| Page background | neutral-950 | `bg-neutral-950` |
| Card background | neutral-900 | `bg-neutral-900` |
| Primary text | neutral-50 | `text-neutral-50` |
| Secondary text | neutral-300 | `text-neutral-300` |
| Muted text | neutral-400 | `text-neutral-400` |
| Borders | neutral-800 | `border-neutral-800` |
| Primary button | primary-600 | `bg-primary-600` |
| Hover state | primary-700 | `hover:bg-primary-700` |

## 📦 Package Dependencies

Packages used:
```json
{
  "react-icons": "^5.x",      // For icons (Fa*)
  "react-cookie": "^7.x"      // For cookie management
}
```

## 🚀 Getting Started

1. **View the design:**
```bash
npm run dev
```

2. **Customize colors:**
Edit `src/constants/theme.ts` and `tailwind.config.js`

3. **Create new components:**
Use the theme constants and follow the established patterns

4. **Check the documentation:**
See `src/constants/README.md` for detailed theme usage

## 📝 Best Practices

1. ✅ **Always use theme constants** instead of hardcoded colors
2. ✅ **Prefer Tailwind classes** for better performance
3. ✅ **Use semantic colors** for consistent states
4. ✅ **Add hover states** for interactive elements
5. ✅ **Use gradient text** for hero elements
6. ✅ **Add transitions** for smooth interactions
7. ✅ **Consider mobile** with responsive classes

## 🎯 Available Theme Colors

### Tailwind Classes

All colors from the theme are available as Tailwind classes:

```tsx
// Primary colors
<div className="bg-primary-500 text-primary-50">Primary</div>

// Secondary colors
<div className="bg-secondary-500 text-secondary-50">Secondary</div>

// Accent colors
<div className="bg-accent-500 text-accent-50">Accent</div>

// Neutral/Gray colors
<div className="bg-neutral-900 text-neutral-100">Neutral</div>
```

### Color Scale

All palettes follow the same 50-950 scale:
- **50**: Lightest shade
- **100-400**: Light shades
- **500**: Base color (most commonly used)
- **600-800**: Dark shades
- **900-950**: Darkest shades

---

**Clean dark design with a comprehensive color system.**

For theme customization, see `src/constants/theme.ts`  
For usage examples, see `src/constants/README.md`
