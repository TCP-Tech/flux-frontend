# Theme Constants

This directory contains centralized theme configuration for the Flux application.

## Usage

Import the constants in your components:

```typescript
import { COLORS, GRADIENTS, THEME } from '@/constants/theme'
```

## Available Constants

### Colors

All color palettes follow a consistent scale from 50 (lightest) to 950 (darkest).

#### Primary Colors (Blue)
```typescript
import { COLORS } from '@/constants/theme'

// Use in inline styles
style={{ color: COLORS.primary[500] }}

// Or use Tailwind classes: bg-primary-500, text-primary-600, etc.
```

#### Secondary Colors (Indigo)
```typescript
COLORS.secondary[500] // #6366f1
```

#### Accent Colors (Cyan)
```typescript
COLORS.accent[500] // #06b6d4
```

#### Neutral Colors (Gray)
```typescript
COLORS.neutral[400] // #a3a3a3
```

### Background Colors

For dark theme consistency:

```typescript
COLORS.background.primary    // #000103 - Main background
COLORS.background.secondary  // #0a0a0a - Secondary surfaces
COLORS.background.card       // #1a1a1a - Card backgrounds
COLORS.background.elevated   // #262626 - Elevated components
```

### Text Colors

```typescript
COLORS.text.primary    // #fafafa - Main text
COLORS.text.secondary  // #d4d4d4 - Secondary text
COLORS.text.muted      // #737373 - Muted text
```

### Semantic Colors

```typescript
COLORS.success.DEFAULT  // #22c55e
COLORS.warning.DEFAULT  // #f59e0b
COLORS.error.DEFAULT    // #ef4444
COLORS.info.DEFAULT     // #3b82f6
```

### Gradients

Pre-defined gradient configurations:

```typescript
import { GRADIENTS } from '@/constants/theme'

// Use in inline styles
style={{ background: GRADIENTS.primary }}

// Available gradients:
GRADIENTS.primary    // Neutral gradient for text
GRADIENTS.secondary  // Blue to Indigo
GRADIENTS.accent     // Cyan to Blue
GRADIENTS.shimmer    // Animated shimmer effect
GRADIENTS.hero       // Hero section gradient
```

### Spacing

Consistent spacing scale:

```typescript
import { SPACING } from '@/constants/theme'

style={{ padding: SPACING.md, margin: SPACING.lg }}

// Available: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
```

### Border Radius

```typescript
import { RADIUS } from '@/constants/theme'

style={{ borderRadius: RADIUS.lg }}

// Available: sm, md, lg, xl, 2xl, full
```

### Typography

```typescript
import { TYPOGRAPHY } from '@/constants/theme'

// Font families
style={{ fontFamily: TYPOGRAPHY.fontFamily.sans.join(', ') }}

// Font sizes
style={{ fontSize: TYPOGRAPHY.fontSize['2xl'] }}
```

### Transitions

```typescript
import { TRANSITIONS } from '@/constants/theme'

style={{ transition: `all ${TRANSITIONS.base}` }}

// Available: fast (150ms), base (200ms), slow (300ms), slower (500ms)
```

### Z-Index

Consistent layering:

```typescript
import { Z_INDEX } from '@/constants/theme'

style={{ zIndex: Z_INDEX.modal }}

// Available: dropdown, sticky, fixed, modalBackdrop, modal, popover, tooltip
```

## Examples

### Using with Tailwind Classes

Tailwind classes are pre-configured with these colors:

```tsx
<div className="bg-primary-500 text-white">
  Primary colored background
</div>

<div className="bg-neutral-900 text-neutral-300 border border-neutral-800">
  Dark theme card
</div>

<button className="bg-gradient-to-r from-primary-500 to-secondary-500">
  Gradient button
</button>
```

### Using with Inline Styles

```tsx
import { COLORS, SPACING, RADIUS } from '@/constants/theme'

<div
  style={{
    backgroundColor: COLORS.background.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    border: `1px solid ${COLORS.border.DEFAULT}`,
  }}
>
  Card content
</div>
```

### Using the Complete Theme Object

```typescript
import THEME from '@/constants/theme'

const styles = {
  container: {
    backgroundColor: THEME.colors.background.primary,
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    transition: `all ${THEME.transitions.base}`,
  },
}
```

## Customizing the Theme

To add or modify colors, edit `src/constants/theme.ts`:

```typescript
export const COLORS = {
  // Add your custom colors
  brand: {
    light: '#your-color',
    DEFAULT: '#your-color',
    dark: '#your-color',
  },
  // ... rest of the colors
}
```

Then update `tailwind.config.js` to make them available as Tailwind classes:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#your-color',
          DEFAULT: '#your-color',
          dark: '#your-color',
        },
      },
    },
  },
}
```

## Best Practices

1. **Use Tailwind classes** when possible for better performance and smaller bundle size
2. **Use constants for inline styles** when dynamic styling is needed
3. **Maintain consistency** by always using theme constants instead of hardcoded values
4. **Follow the scale** - use the number scale (50-950) for consistency
5. **Use semantic colors** for success, error, warning, and info states

## Dark Theme Specifics

This theme is optimized for dark mode:

- Background: `#000103` (near black with slight blue tint)
- Primary text: `#fafafa` (off-white)
- Secondary text: `#d4d4d4` (light gray)
- Borders: `#262626` to `#404040` (subtle grays)
- Use gradients for emphasis: `from-neutral-50 to-neutral-400`

## Quick Reference

| Use Case | Recommended Value |
|----------|-------------------|
| Main background | `bg-[#000103]` or `COLORS.background.primary` |
| Card background | `bg-neutral-900` or `COLORS.background.card` |
| Primary text | `text-neutral-50` or `COLORS.text.primary` |
| Secondary text | `text-neutral-300` or `COLORS.text.secondary` |
| Borders | `border-neutral-800` or `COLORS.border.DEFAULT` |
| Buttons (primary) | `bg-primary-600 hover:bg-primary-700` |
| Buttons (ghost) | `border-neutral-600 hover:bg-neutral-800` |
| Gradient text | `bg-gradient-to-b from-neutral-50 to-neutral-400` |

---

For more details, see `src/constants/theme.ts`

