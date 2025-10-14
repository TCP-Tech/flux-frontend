# Flux Frontend

A modern, production-ready React application for the Flux competitive programming platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit http://localhost:3000 to see the application.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

### 🎯 New to the Project?
Start here:
- **[Quick Start Guide](./docs/guides/QUICK_START.md)** - Get up and running in minutes
- **[Setup Summary](./docs/guides/SETUP_SUMMARY.md)** - Understand what's been configured
- **[Documentation Index](./docs/README.md)** - Complete documentation overview

### 🏗️ Architecture & Design
- **[System Overview](./docs/architecture/system-overview.md)** - Complete system architecture
- **[Frontend API Guide](./docs/architecture/FRONTEND_GUIDE.md)** - Complete API reference

### ✨ Features
- **[Dark Theme Guide](./docs/features/DARK_THEME_GUIDE.md)** - Styling and theming guide

### 🔄 Workflows
- **[Authentication Flow](./docs/workflows/authentication-flow.md)** - User auth workflows
- **[Contest Lifecycle](./docs/workflows/contest-lifecycle.md)** - Contest management

### 📘 How-To Guides
- **[Routing Guide](./docs/guides/ROUTING_GUIDE.md)** - Adding new pages and routes

## ✨ What's Included

### Technology Stack
- **React 18** with TypeScript
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS** - Production-ready styling
- **React Router v6** - Client-side routing
- **ESLint 9** - Code quality
- **Axios** - HTTP client

### Features
- ✅ JWT Authentication (HttpOnly cookies)
- ✅ Dark theme with modern design
- ✅ Responsive layout
- ✅ Type-safe development
- ✅ Production optimizations
- ✅ Code splitting & lazy loading
- ✅ Path aliases (`@/` imports)

## 📦 Project Structure

```
flux-frontend/
├── docs/                          # 📚 Complete documentation
│   ├── README.md                  # Documentation index
│   ├── architecture/              # System architecture docs
│   ├── features/                  # Feature-specific guides
│   ├── workflows/                 # Process workflows
│   └── guides/                    # Getting started guides
├── src/
│   ├── pages/                     # Page components
│   │   ├── auth/                  # Auth pages (Login, Signup)
│   │   ├── HomePage.tsx           # Landing page
│   │   └── NotFoundPage.tsx       # 404 page
│   ├── lib/                       # Utilities
│   │   └── utils.ts               # Helper functions
│   ├── constants/                 # App constants
│   │   └── theme.ts               # Theme constants
│   ├── App.tsx                    # Router configuration
│   └── main.tsx                   # Application entry
├── public/                        # Static assets
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies & scripts
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at :3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix lint errors |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Run TypeScript checks |
| `npm run check-all` | Run all checks (recommended before commit) |

## 🎨 Dark Theme

The application features a professional dark theme with:
- Deep neutral backgrounds
- High contrast text
- Vibrant accent colors
- Gradient text effects
- Hover animations

See [Dark Theme Guide](./docs/features/DARK_THEME_GUIDE.md) for details.

## 🔐 Authentication

JWT-based authentication using HttpOnly cookies:
- Email verification for signup
- Secure login/logout
- Password reset functionality
- Role-based access control

See [Authentication Workflow](./docs/workflows/authentication-flow.md) for implementation details.

## 🌐 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080/v1
VITE_API_TIMEOUT=30000
VITE_REFRESH_INTERVAL=5000
```

## 📝 Development Workflow

### Before Committing
Always run the quality checks:
```bash
npm run check-all
```

This ensures:
- ✅ TypeScript compilation passes
- ✅ Code follows linting rules
- ✅ Formatting is consistent

### Adding New Features

1. **Add a new page**: See [Routing Guide](./docs/guides/ROUTING_GUIDE.md)
2. **Style components**: See [Dark Theme Guide](./docs/features/DARK_THEME_GUIDE.md)
3. **Call APIs**: See [Frontend API Guide](./docs/architecture/FRONTEND_GUIDE.md)
4. **Understand workflows**: See [Workflows](./docs/workflows/)

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │◄───────►│   Backend API   │
│                 │         │                 │
│  React + Vite   │         │   Go + Chi      │
│  TypeScript     │         │   PostgreSQL    │
│  Tailwind CSS   │         │   JWT Auth      │
└─────────────────┘         └─────────────────┘
```

See [System Overview](./docs/architecture/system-overview.md) for complete architecture.

## 🎯 Core Features

### Implemented
- ✅ Landing page with hero section
- ✅ User authentication (Login/Signup)
- ✅ 404 error page
- ✅ Dark theme with gradients
- ✅ Responsive design
- ✅ JWT cookie management

### In Progress
- 🚧 Problem management pages
- 🚧 Contest management pages
- 🚧 Tournament pages
- 🚧 Leaderboard
- 🚧 User profiles

### Planned
- 📋 Code editor integration
- 📋 Submission system
- 📋 Real-time updates
- 📋 Analytics dashboard

## 🔒 Security

### Frontend Security
- HttpOnly cookies for JWT storage
- XSS protection via React
- CSRF protection via SameSite cookies
- Input validation
- Secure HTTPS in production

### Best Practices
- Never store JWT in localStorage
- Always validate user input
- Use `withCredentials: true` for API calls
- Handle 401 errors globally

## 📚 API Reference

Base URL: `http://localhost:8080/v1`

### Key Endpoints
- `POST /v1/auth/login` - User login
- `POST /v1/auth/signup` - User registration
- `GET /v1/me` - Get current user
- `POST /v1/problems/search` - Search problems
- `POST /v1/contests/search` - Search contests

See [Frontend API Guide](./docs/architecture/FRONTEND_GUIDE.md) for complete API documentation.

## 🐛 Troubleshooting

### Dev Server Issues
```bash
rm -rf node_modules/.vite
npm run dev
```

### Build Issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Issues
- Verify backend is running at `http://localhost:8080`
- Check `.env` file has correct `VITE_API_URL`
- Ensure `withCredentials: true` in Axios config
- Check browser console for CORS errors

## 📖 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 🤝 Contributing

1. Read the [documentation](./docs/README.md)
2. Follow existing code patterns
3. Run `npm run check-all` before committing
4. Use TypeScript strictly
5. Write semantic HTML
6. Use Tailwind for styling

## 📄 License

This project is part of the Flux competitive programming platform.

## 🎉 Getting Help

1. **Check Documentation**: Start with [docs/README.md](./docs/README.md)
2. **API Reference**: See [Frontend Guide](./docs/architecture/FRONTEND_GUIDE.md)
3. **Workflows**: Check [workflow docs](./docs/workflows/)
4. **Guides**: Read [getting started guides](./docs/guides/)

---

**Built with** ❤️ **using React, TypeScript, Vite, and Tailwind CSS**

**Version**: 1.0.0  
**Last Updated**: October 2025

---

## Quick Links

- 📚 [Complete Documentation](./docs/README.md)
- 🚀 [Quick Start Guide](./docs/guides/QUICK_START.md)
- 🏗️ [System Architecture](./docs/architecture/system-overview.md)
- 🔐 [Authentication Workflow](./docs/workflows/authentication-flow.md)
- 🎨 [Dark Theme Guide](./docs/features/DARK_THEME_GUIDE.md)
