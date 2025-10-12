# Flux Frontend Documentation

Welcome to the comprehensive documentation for the Flux competitive programming platform frontend. This documentation is organized to help you understand, develop, and maintain the application.

## 📚 Documentation Structure

```
docs/
├── README.md                           # This file - Documentation index
├── architecture/                       # System architecture & design
│   ├── FRONTEND_GUIDE.md              # Complete API reference & specifications
│   └── system-overview.md             # High-level system architecture
├── features/                          # Feature-specific documentation
│   └── DARK_THEME_GUIDE.md            # Dark theme implementation guide
├── workflows/                         # Process flows & workflows
│   ├── authentication-flow.md         # Authentication workflows
│   └── contest-lifecycle.md           # Contest creation to completion
└── guides/                            # Getting started & how-to guides
    ├── QUICK_START.md                 # Quick start guide
    ├── ROUTING_GUIDE.md               # React Router setup & usage
    └── SETUP_SUMMARY.md               # Complete setup summary
```

## 🚀 Quick Links

### For New Developers
Start here to get up and running:
1. [Quick Start Guide](./guides/QUICK_START.md) - Get the app running in minutes
2. [Setup Summary](./guides/SETUP_SUMMARY.md) - Understand what's been configured
3. [System Overview](./architecture/system-overview.md) - Learn the architecture

### For Frontend Developers
Essential resources for building features:
1. [Frontend API Guide](./architecture/FRONTEND_GUIDE.md) - Complete API reference
2. [Routing Guide](./guides/ROUTING_GUIDE.md) - How to add new pages
3. [Dark Theme Guide](./features/DARK_THEME_GUIDE.md) - Styling guidelines

### For Understanding Workflows
Learn how the platform works:
1. [Authentication Flow](./workflows/authentication-flow.md) - User login, signup, password reset
2. [Contest Lifecycle](./workflows/contest-lifecycle.md) - Contest creation to completion

## 📖 Documentation Categories

### 🏗️ Architecture
Technical architecture and system design documentation.

- **[System Overview](./architecture/system-overview.md)**
  - Complete system architecture
  - Technology stack details
  - Data models and relationships
  - API structure
  - Security architecture
  - Deployment recommendations

- **[Frontend API Guide](./architecture/FRONTEND_GUIDE.md)**
  - Complete API endpoint reference
  - Request/response formats
  - Authentication details
  - Error handling
  - Best practices
  - Code examples

### ✨ Features
Feature-specific implementation guides and documentation.

- **[Dark Theme Guide](./features/DARK_THEME_GUIDE.md)**
  - Color palette and design tokens
  - Theme constants usage
  - Component patterns
  - Responsive design
  - Tailwind CSS integration
  - Common UI patterns

### 🔄 Workflows
Process flows and workflows for understanding how things work.

- **[Authentication Workflow](./workflows/authentication-flow.md)**
  - User registration flow
  - Login/logout process
  - Password reset workflow
  - JWT cookie management
  - Protected route implementation
  - Role-based access control

- **[Contest Lifecycle](./workflows/contest-lifecycle.md)**
  - Contest creation process
  - User registration and participation
  - Live contest management
  - Leaderboard updates
  - Contest editing and deletion
  - Access control implementation

### 📘 Guides
Step-by-step guides for common tasks.

- **[Quick Start](./guides/QUICK_START.md)**
  - Installation and setup
  - Available commands
  - Development workflow
  - Project structure
  - Next steps

- **[Routing Guide](./guides/ROUTING_GUIDE.md)**
  - React Router setup
  - Adding new routes
  - Protected routes
  - Navigation patterns
  - Layout components

- **[Setup Summary](./guides/SETUP_SUMMARY.md)**
  - What was created
  - Technology versions
  - Configuration highlights
  - Quality checks
  - Best practices included

## 🎯 Common Tasks

### I want to...

#### Start Development
1. Read [Quick Start Guide](./guides/QUICK_START.md)
2. Run `npm run dev`
3. Open http://localhost:3000

#### Add a New Page
1. Read [Routing Guide](./guides/ROUTING_GUIDE.md)
2. Create component in `src/pages/`
3. Add route in `src/App.tsx`

#### Call a Backend API
1. Check [Frontend API Guide](./architecture/FRONTEND_GUIDE.md)
2. Find the endpoint you need
3. Use Axios with `withCredentials: true`

#### Style a Component
1. Read [Dark Theme Guide](./features/DARK_THEME_GUIDE.md)
2. Use Tailwind utility classes
3. Reference theme constants

#### Implement Authentication
1. Read [Authentication Workflow](./workflows/authentication-flow.md)
2. Check example code in the workflow doc
3. Follow JWT cookie patterns

#### Create a Contest Feature
1. Read [Contest Lifecycle](./workflows/contest-lifecycle.md)
2. Check API endpoints in [Frontend Guide](./architecture/FRONTEND_GUIDE.md)
3. Implement UI components

## 📊 Project Overview

### What is Flux?
Flux is a comprehensive competitive programming platform designed for:
- Managing coding contests and tournaments
- Organizing programming problems
- Automated submissions to external judges (like Codeforces)
- Real-time leaderboards and scoring
- Role-based access control

### Technology Stack

#### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.7.3** - Type safety
- **Vite 6.3.6** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **React Router v6** - Navigation
- **Axios** - HTTP client

#### Backend (API)
- **Go 1.24.5** - Server language
- **Chi v5** - HTTP router
- **PostgreSQL** - Database
- **JWT** - Authentication
- **SMTP** - Email verification

## 🔑 Key Concepts

### Authentication
- JWT tokens stored in HttpOnly cookies
- Email verification required for signup
- Role-based access control (user, manager, admin)
- Session management with cookie expiration

### Access Control (Locks)
- Content visibility control mechanism
- Two types: Manual and Timer locks
- Role-based access checks
- Automatic unlock for timer locks

### Entity Hierarchy
```
Users
  └─ Roles (user, manager, admin)

Problems
  └─ Locks (optional access control)
  └─ Standard Problem Data

Contests
  └─ Problems (with scores)
  └─ Registered Users
  └─ Locks (optional)
  └─ Submissions & Scores

Tournaments
  └─ Rounds
      └─ Contests
          └─ Locks (optional)
```

## 🛠️ Development Resources

### Commands
```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues
npm run format           # Format code
npm run type-check       # TypeScript checks
npm run check-all        # Run all checks
```

### Environment Variables
```env
VITE_API_URL=http://localhost:8080/v1
VITE_API_TIMEOUT=30000
VITE_REFRESH_INTERVAL=5000
```

### Path Aliases
```typescript
import Component from '@/components/Component'
import { api } from '@/services/api'
import { formatDate } from '@/lib/utils'
```

## 📝 API Quick Reference

### Base URL
```
http://localhost:8080/v1
```

### Authentication
- `POST /v1/auth/signup` - User registration
- `POST /v1/auth/login` - User login
- `GET /v1/me` - Get current user

### Core Resources
- `POST /v1/problems/search` - Search problems
- `POST /v1/contests/search` - Search contests
- `POST /v1/tournaments/search` - Search tournaments
- `POST /v1/locks/search` - Search locks

See [Frontend API Guide](./architecture/FRONTEND_GUIDE.md) for complete details.

## 🎨 UI/UX Guidelines

### Design Principles
1. **Dark Theme First** - Professional dark color palette
2. **Responsive Design** - Mobile-first approach
3. **Accessibility** - ARIA labels, semantic HTML
4. **Performance** - Code splitting, lazy loading
5. **Consistency** - Use theme constants and patterns

### Color Usage
- **Background**: `neutral-950` (deep dark)
- **Cards**: `neutral-900`
- **Text**: `neutral-50` (high contrast)
- **Primary Actions**: `primary-600` (blue)
- **Borders**: `neutral-800` (subtle)

See [Dark Theme Guide](./features/DARK_THEME_GUIDE.md) for complete palette.

## 🔒 Security Considerations

### Frontend Security
- ✅ HttpOnly cookies (no localStorage)
- ✅ XSS protection (React escaping)
- ✅ CSRF protection (SameSite cookies)
- ✅ Input validation
- ✅ Secure HTTPS in production

### Best Practices
1. Never store JWT in localStorage
2. Always validate user input
3. Sanitize HTML content
4. Use HTTPS in production
5. Handle 401 errors globally
6. Implement rate limiting (UI-level)

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)

### Tools
- [ESLint](https://eslint.org)
- [Prettier](https://prettier.io)
- [Axios](https://axios-http.com)

## 🤝 Contributing Guidelines

### Before Committing
Always run:
```bash
npm run check-all
```

This ensures:
- ✅ TypeScript type checking passes
- ✅ ESLint rules are followed
- ✅ Code is properly formatted

### Code Style
- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Use Tailwind classes for styling
- Follow the existing project structure
- Add comments for complex logic
- Write semantic HTML

### Component Patterns
```typescript
// Good component pattern
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-neutral-900 rounded-lg">
      <h2 className="text-xl font-bold text-neutral-50">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="btn-primary">
          Action
        </button>
      )}
    </div>
  );
}

export default MyComponent;
```

## 🐛 Troubleshooting

### Common Issues

**Dev server not starting**
```bash
rm -rf node_modules/.vite
npm run dev
```

**Build errors**
```bash
npm run type-check  # Check TypeScript errors
npm run lint        # Check linting errors
```

**API calls failing**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Verify `withCredentials: true` in Axios config
- Check browser console for CORS errors

**Styling not applying**
```bash
# Rebuild Tailwind
npm run build
```

## 📞 Support

### Getting Help
1. Check this documentation first
2. Review relevant workflow documentation
3. Check the API guide for endpoint details
4. Review example code in guides

### Reporting Issues
When reporting issues, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Relevant error messages
- Screenshots (if applicable)

## 🎯 Roadmap

### Current Features (Implemented)
- ✅ Authentication system
- ✅ Dark theme
- ✅ Routing setup
- ✅ Base pages (Home, Login, Signup, 404)

### Planned Features
- ⏳ Problem management pages
- ⏳ Contest management pages
- ⏳ Tournament management pages
- ⏳ Leaderboard pages
- ⏳ User profile pages
- ⏳ Submission system
- ⏳ Real-time updates (WebSocket)
- ⏳ Code editor integration

### Future Enhancements
- 🔮 Advanced analytics dashboard
- 🔮 Discussion forums
- 🔮 Editorial solutions
- 🔮 Practice mode
- 🔮 User avatars
- 🔮 Notification system

## 📄 Document Status

| Document | Status | Last Updated |
|----------|--------|--------------|
| System Overview | ✅ Complete | Oct 2025 |
| Frontend API Guide | ✅ Complete | Oct 2025 |
| Authentication Flow | ✅ Complete | Oct 2025 |
| Contest Lifecycle | ✅ Complete | Oct 2025 |
| Dark Theme Guide | ✅ Complete | Oct 2025 |
| Routing Guide | ✅ Complete | Oct 2025 |
| Quick Start | ✅ Complete | Oct 2025 |
| Setup Summary | ✅ Complete | Oct 2025 |

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintained By**: Flux Development Team

---

## Quick Navigation

- [⬆️ Back to Top](#flux-frontend-documentation)
- [🏗️ Architecture](#-architecture)
- [✨ Features](#-features)
- [🔄 Workflows](#-workflows)
- [📘 Guides](#-guides)
- [🎯 Common Tasks](#-common-tasks)

