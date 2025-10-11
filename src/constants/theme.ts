/**
 * Theme Constants for Flux Application
 * Centralized color palette and design tokens
 */

export const COLORS = {
  // Primary Colors - Blue palette
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Secondary Colors - Indigo palette
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Accent/Tint Colors - Cyan palette
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },

  // Neutral/Gray Colors - For dark theme
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Semantic Colors
  success: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
  },
  error: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },

  // Background Colors for Dark Theme
  background: {
    primary: '#000103', // Very dark, almost black
    secondary: '#0a0a0a',
    tertiary: '#171717',
    card: '#1a1a1a',
    elevated: '#262626',
  },

  // Text Colors
  text: {
    primary: '#fafafa',
    secondary: '#d4d4d4',
    tertiary: '#a3a3a3',
    muted: '#737373',
    inverse: '#0a0a0a',
  },

  // Border Colors
  border: {
    light: '#404040',
    DEFAULT: '#262626',
    dark: '#171717',
  },
} as const

// Gradient Configurations
export const GRADIENTS = {
  primary: 'linear-gradient(to bottom, #fafafa, #a3a3a3)',
  secondary: 'linear-gradient(to right, #3b82f6, #6366f1)',
  accent: 'linear-gradient(to right, #06b6d4, #3b82f6)',
  shimmer: 'linear-gradient(110deg, #000103 0%, #1e2631 45%, #000103 100%)',
  hero: 'linear-gradient(to bottom, #fafafa, #a3a3a3)',
} as const

// Spacing Scale
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const

// Border Radius
export const RADIUS = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
    mono: ['Monaco', 'Courier New', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
  },
} as const

// Transitions
export const TRANSITIONS = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
} as const

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const

// Breakpoints (for reference, Tailwind handles these)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Animation Timings
export const ANIMATION = {
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// Export default theme object
export const THEME = {
  colors: COLORS,
  gradients: GRADIENTS,
  spacing: SPACING,
  radius: RADIUS,
  typography: TYPOGRAPHY,
  transitions: TRANSITIONS,
  zIndex: Z_INDEX,
  breakpoints: BREAKPOINTS,
  animation: ANIMATION,
} as const

export default THEME
