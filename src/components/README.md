# Components

This directory contains reusable React components for the Flux frontend application.

## Components

### Header

The `Header` component displays the application logo and authentication controls.

**Features:**
- Logo with hover effects
- Conditional auth buttons (Login/Sign Up or Logout)
- Cookie-based authentication state management
- Modern glassmorphic design with backdrop blur
- Gradient effects on Sign Up button

**Usage:**
```tsx
import { Header } from '../components'

function MyPage() {
  return (
    <div>
      <Header />
      {/* page content */}
    </div>
  )
}
```

### Footer

The `Footer` component displays social media links, credits, and copyright information.

**Features:**
- Social media icons (Facebook, Twitter, Instagram, Discord) with vertical layout
- Gradient decorative lines above and below icons
- Hover effects with glow and scale transforms
- Full-width footer bar with glassmorphic design
- Credits to Skills and Mentorship Team
- Organization badge for Turing Club of Programmers, NIT Raipur
- Animated heart icon (pulsing red heart)
- Quick links (GitHub, About, Contact, Privacy)
- Copyright notice with dynamic year
- Hidden social media icons on mobile (md: breakpoint and up)
- Backdrop blur and border effects for modern look

**Usage:**
```tsx
import { Footer } from '../components'

function MyPage() {
  return (
    <div>
      {/* page content */}
      <Footer />
    </div>
  )
}
```

**Note:** The Footer has a height of approximately 120-140px. Make sure to add padding-bottom to your page container (e.g., `pb-32` or `pb-40`) to prevent content from being hidden behind the footer.

## Styling

All components use Tailwind CSS for styling with custom animations and utilities defined in `src/index.css`.

### Custom Animations Used:
- `animate-blob` - Floating blob animation
- `animate-fade-in-up` - Fade in from bottom animation
- `animate-gradient-x` - Horizontal gradient animation
- `animate-pulse` - Pulsing animation

### Theme Colors:
- Primary: Indigo/Blue tones
- Secondary: Purple/Violet tones  
- Accent: Pink/Rose tones
- Neutral: Gray scale for backgrounds and text

## Best Practices

1. **Reusability**: These components are designed to be reusable across different pages
2. **Absolute Positioning**: Both Header and Footer use absolute positioning, so they work best within a container with `relative` positioning
3. **Authentication**: Header manages its own auth state via cookies
4. **Responsive**: Components are responsive with mobile-first design approach

