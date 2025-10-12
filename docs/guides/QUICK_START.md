# Flux Frontend - Quick Start Guide

## ✅ Setup Complete!

Your production-ready React + Vite + Tailwind CSS application is ready to go!

## 🚀 What's Included

### Core Technologies
- **React 18** - Latest React with hooks and concurrent features
- **TypeScript** - Full type safety with strict mode
- **Vite 6** - Lightning-fast build tool with HMR
- **Tailwind CSS v3.4** - Production-ready utility-first CSS framework

### Code Quality Tools
- **ESLint 9** - Latest flat config with React & TypeScript rules
- **Prettier** - Consistent code formatting
- **TypeScript strict mode** - Maximum type safety

### Production Optimizations
- Code splitting with vendor chunks
- Lightning CSS for optimal CSS minification
- Tree shaking for smaller bundles
- Path aliases (`@/` for imports)
- SEO-friendly HTML meta tags
- Accessibility features (ARIA labels, semantic HTML)

## 🎯 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### 2. Build for Production
```bash
npm run build
```
Outputs to `./dist` directory

### 3. Preview Production Build
```bash
npm run preview
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is formatted |
| `npm run type-check` | Run TypeScript checks |
| `npm run check-all` | Run all checks before commit |

## 📝 Development Workflow

### Before Committing
Always run:
```bash
npm run check-all
```

This will:
1. ✅ Check TypeScript types
2. ✅ Lint your code
3. ✅ Verify formatting

### Auto-fix Issues
```bash
npm run lint:fix && npm run format
```

## 🎨 Using Tailwind CSS

### Utility Classes
```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click Me
</button>
```

### Responsive Design
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Responsive width
</div>
```

### Dark Mode
```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Auto dark mode support
</div>
```

### Custom Colors
Defined in `tailwind.config.js`:
```jsx
<div className="bg-primary-500 text-primary-50">
  Custom primary color
</div>
```

## 📁 Project Structure

```
src/
├── components/    # Reusable UI components (to be created)
├── pages/        # Page components (to be created)
├── hooks/        # Custom React hooks (to be created)
├── services/     # API service layer (to be created)
├── types/        # TypeScript type definitions (to be created)
├── utils/        # Utility functions (to be created)
├── App.tsx       # Main app component ✅
├── main.tsx      # App entry point ✅
└── index.css     # Global styles ✅
```

## 🔧 Configuration Files

- `vite.config.ts` - Vite with production optimizations
- `tailwind.config.js` - Tailwind theme and configuration
- `tsconfig.json` - TypeScript with strict mode + path aliases
- `eslint.config.js` - ESLint v9 flat config
- `.prettierrc.json` - Code formatting rules
- `postcss.config.js` - PostCSS with Tailwind & Autoprefixer

## 🌐 Environment Variables

Create a `.env` file:
```env
VITE_API_URL=http://localhost:8080/v1
VITE_API_TIMEOUT=30000
VITE_REFRESH_INTERVAL=5000
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## 📦 Next Steps

### 1. Add Routing
```bash
npm install react-router-dom
npm install -D @types/react-router-dom
```

### 2. Add HTTP Client
```bash
npm install axios
```

### 3. Add State Management
```bash
npm install zustand
# or
npm install @reduxjs/toolkit react-redux
```

### 4. Add Form Handling
```bash
npm install react-hook-form zod @hookform/resolvers
```

### 5. Add UI Components (Optional)
```bash
npm install @headlessui/react @heroicons/react
# or
npm install @radix-ui/react-*
```

## 🎓 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 📋 Checklist

Before starting development:
- [ ] Update `.env` with your backend API URL
- [ ] Review `FRONTEND_GUIDE.md` for API endpoints
- [ ] Plan your component structure
- [ ] Set up routing
- [ ] Create API service layer
- [ ] Implement authentication flow

## 🚨 Important Notes

1. **JWT Cookie Authentication**: The backend uses HttpOnly cookies - don't try to access JWT from JavaScript
2. **Roll Numbers**: Must be exactly 8 numeric digits
3. **All IDs**: Use UUID v4 format for contests, tournaments, locks
4. **Problem IDs**: Are integers starting from 1234
5. **Pagination**: Is 1-indexed (starts at 1, not 0)

## 🐛 Troubleshooting

### Dev Server Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Build Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type Errors
```bash
# Restart TypeScript server in your IDE
# or
npm run type-check
```

## ✨ Happy Coding!

Your Flux frontend is ready for development. Start building amazing features! 🚀

