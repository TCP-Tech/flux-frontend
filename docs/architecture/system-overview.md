# Flux System Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Flux Platform                         │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────────┐         ┌─────────────────┐       │
│  │   Frontend      │◄───────►│   Backend API   │       │
│  │                 │         │                 │       │
│  │  React + Vite   │         │   Go + Chi      │       │
│  │  TypeScript     │         │   PostgreSQL    │       │
│  │  Tailwind CSS   │         │   JWT Auth      │       │
│  └─────────────────┘         └────────┬────────┘       │
│         │                              │                 │
│         │                              │                 │
│         │                    ┌─────────▼────────┐       │
│         │                    │                  │       │
│         │                    │   PostgreSQL     │       │
│         │                    │   Database       │       │
│         │                    │                  │       │
│         │                    └─────────┬────────┘       │
│         │                              │                 │
│         │                    ┌─────────▼────────┐       │
│         │                    │                  │       │
│         └───────────────────►│  External Judge  │       │
│                              │  (Codeforces)    │       │
│                              │                  │       │
│                              └──────────────────┘       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
```
┌────────────────────────────────────────┐
│           Frontend Stack               │
├────────────────────────────────────────┤
│                                        │
│  Framework:                            │
│  • React 18.3.1                        │
│  • TypeScript 5.7.3                    │
│                                        │
│  Build Tools:                          │
│  • Vite 6.3.6                          │
│  • ESLint 9.37.0                       │
│  • Prettier (latest)                   │
│                                        │
│  Styling:                              │
│  • Tailwind CSS 3.4.17                 │
│  • PostCSS 8.4.49                      │
│  • Lightning CSS 1.30.2                │
│                                        │
│  Routing:                              │
│  • React Router v6                     │
│                                        │
│  State Management:                     │
│  • React Hooks                         │
│  • React Cookie (JWT)                  │
│                                        │
│  HTTP Client:                          │
│  • Axios (configured)                  │
│                                        │
│  Icons:                                │
│  • Lucide React                        │
│  • React Icons                         │
│                                        │
└────────────────────────────────────────┘
```

### Backend
```
┌────────────────────────────────────────┐
│            Backend Stack               │
├────────────────────────────────────────┤
│                                        │
│  Language:                             │
│  • Go 1.24.5                           │
│                                        │
│  Framework:                            │
│  • Chi v5 (HTTP Router)                │
│  • pgx/v5 (PostgreSQL driver)          │
│                                        │
│  Database:                             │
│  • PostgreSQL                          │
│                                        │
│  Authentication:                       │
│  • JWT (golang-jwt/jwt)                │
│  • HttpOnly Cookies                    │
│                                        │
│  Email:                                │
│  • SMTP (Gmail)                        │
│  • Email verification                  │
│  • Password reset                      │
│                                        │
│  Background Jobs:                      │
│  • Task Scheduler                      │
│  • Email Worker Pool                   │
│                                        │
└────────────────────────────────────────┘
```

## Data Architecture

### Entity Relationship Diagram

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Users   │◄────────►│  Roles   │          │  Locks   │
└────┬─────┘          └──────────┘          └────┬─────┘
     │                                            │
     │                                            │
     ├────────────────────┬───────────────────────┤
     │                    │                       │
     ▼                    ▼                       ▼
┌──────────┐        ┌──────────┐          ┌──────────┐
│ Contests │◄──────►│ Problems │          │Tournament│
└────┬─────┘        └────┬─────┘          └────┬─────┘
     │                   │                      │
     │                   │                      │
     ├───────────────────┤                      │
     │                   │                      │
     ▼                   ▼                      ▼
┌──────────┐        ┌──────────┐          ┌──────────┐
│Submissions◄───────►│  Bots   │          │  Rounds  │
└────┬─────┘        └──────────┘          └────┬─────┘
     │                                          │
     │                                          │
     └────────────┬─────────────────────────────┘
                  ▼
            ┌──────────┐
            │  Scores  │
            └──────────┘
```

### Core Entities

#### User
```typescript
interface User {
  id: string;              // UUID
  roll_no: string;         // 8-digit unique
  user_name: string;       // Auto-generated, unique
  first_name: string;      // Min 4 chars
  last_name: string;       // Min 4 chars
  email: string;           // Unique, verified
  password_hash: string;   // bcrypt
  created_at: string;      // Timestamp
  roles: string[];         // role_user, role_manager, role_admin
}
```

#### Problem
```typescript
interface Problem {
  id: number;              // Auto-increment from 1234
  title: string;           // 4-100 chars
  difficulty: number;      // 800-3000 (Codeforces scale)
  evaluator: string;       // "codeforces"
  lock_id?: string;        // Optional UUID
  created_by: string;      // User UUID
  last_updated_by: string; // User UUID
  created_at: string;
  updated_at: string;
}

interface StandardProblemData {
  problem_id: number;
  statement: string;
  input_format: string;
  output_format: string;
  function_definitions: Record<string, string>;
  example_test_cases: ExampleTestCases;
  notes: string;
  memory_limit_kb: number;
  time_limit_ms: number;
  submission_link: string;
}
```

#### Contest
```typescript
interface Contest {
  contest_id: string;      // UUID
  title: string;           // 5-100 chars
  lock_id?: string;        // Optional UUID
  start_time?: string;     // ISO timestamp
  end_time: string;        // ISO timestamp (required)
  is_published: boolean;
  created_by: string;      // User UUID
  created_at: string;
  updated_at: string;
}
```

#### Tournament
```typescript
interface Tournament {
  id: string;              // UUID
  title: string;           // 5-100 chars, unique
  is_published: boolean;
  created_by: string;      // User UUID
  created_at: string;
  updated_at: string;
  rounds: number;          // Total rounds
}

interface TournamentRound {
  id: string;              // UUID
  tournament_id: string;
  title: string;
  round_no: number;
  lock_id?: string;
  created_by: string;
  updated_at: string;
}
```

#### Lock (Access Control)
```typescript
interface Lock {
  lock_id: string;         // UUID
  name: string;            // Min 4 chars
  created_by: string;      // User UUID
  created_at: string;
  description: string;
  access: string;          // Role name (e.g., "role_manager")
  lock_type: "manual" | "timer";
  timeout?: string;        // For timer locks
}
```

## API Architecture

### API Versioning
```
Base URL: http://localhost:8080/v1
Version: v1 (current)
```

### Endpoint Structure

```
/v1
├── /auth
│   ├── GET  /signup?email={email}
│   ├── POST /signup
│   ├── POST /login
│   ├── GET  /reset-password?email={email}
│   └── POST /reset-password
│
├── /me
│   └── GET  /me
│
├── /locks
│   ├── GET    /locks?lock_id={uuid}
│   ├── POST   /locks/search
│   ├── POST   /locks
│   ├── PUT    /locks
│   └── DELETE /locks?lock_id={uuid}
│
├── /problems
│   ├── GET  /problems/standard?problem_id={id}
│   ├── POST /problems/search
│   ├── POST /problems/standard
│   └── PUT  /problems
│
├── /contests
│   ├── GET    /contests?contest_id={uuid}
│   ├── GET    /contests/problems?contest_id={uuid}
│   ├── GET    /contests/users?contest_id={uuid}
│   ├── GET    /contests/user-registered
│   ├── POST   /contests/search
│   ├── POST   /contests
│   ├── PUT    /contests
│   ├── PUT    /contests/users
│   ├── PUT    /contests/problems
│   └── DELETE /contests?contest_id={uuid}
│
└── /tournaments
    ├── GET  /tournaments?tournament_id={uuid}
    ├── GET  /tournaments/rounds?tournament_id={uuid}&round_no={n}
    ├── POST /tournaments/search
    ├── POST /tournaments
    ├── POST /tournaments/rounds
    └── PUT  /tournaments/contests
```

### Request/Response Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. HTTP Request + JWT Cookie
     ▼
┌─────────────────┐
│  CORS Middleware│
└────┬────────────┘
     │
     │ 2. Validate Origin
     ▼
┌─────────────────┐
│  Auth Middleware│
└────┬────────────┘
     │
     │ 3. Verify JWT
     ▼
┌─────────────────┐
│  Route Handler  │
└────┬────────────┘
     │
     │ 4. Business Logic
     ▼
┌─────────────────┐
│  Database Layer │
└────┬────────────┘
     │
     │ 5. Query/Update
     ▼
┌─────────────────┐
│   PostgreSQL    │
└────┬────────────┘
     │
     │ 6. Return Data
     ▼
┌─────────────────┐
│  JSON Response  │
└────┬────────────┘
     │
     │ 7. Send to Client
     ▼
┌──────────┐
│  Client  │
└──────────┘
```

## Authentication & Authorization

### JWT Flow

```
┌──────────┐
│  Login   │
└────┬─────┘
     │
     │ 1. POST /auth/login
     ▼
┌─────────────────┐
│ Validate        │
│ Credentials     │
└────┬────────────┘
     │
     │ 2. Generate JWT
     ▼
┌─────────────────┐
│  Set HttpOnly   │
│  Cookie         │
└────┬────────────┘
     │
     │ 3. Return User Data
     ▼
┌──────────┐
│  Client  │
│ (Logged) │
└────┬─────┘
     │
     │ 4. Subsequent requests
     ▼
┌─────────────────┐
│ Cookie sent     │
│ automatically   │
└────┬────────────┘
     │
     │ 5. JWT validated
     ▼
┌─────────────────┐
│ Access granted  │
└─────────────────┘
```

### Role-Based Access Control

```
User Roles:
  └─ role_user (default)
       └─ View published content
       └─ Participate in contests
       └─ Submit solutions
  
  └─ role_manager
       └─ All user permissions
       └─ Create/edit problems
       └─ Create/edit contests
       └─ Manage locks
       └─ Create tournaments
  
  └─ role_admin (future)
       └─ All manager permissions
       └─ User management
       └─ System settings
```

## Performance Considerations

### Frontend Optimizations
- ✅ Code splitting (React vendor chunk)
- ✅ Tree shaking
- ✅ Lightning CSS minification
- ✅ Lazy loading routes (recommended)
- ✅ Image optimization
- ✅ Service Worker (future)

### Backend Optimizations
- ✅ Database connection pooling (pgx)
- ✅ Query optimization with indexes
- ✅ Transaction management
- ✅ Background job processing
- ✅ Email worker pool
- ✅ Prepared statements

### Database Design
- ✅ Proper indexing on foreign keys
- ✅ UUID primary keys for distributed systems
- ✅ Timestamps with timezone
- ✅ Cascade deletes where appropriate
- ✅ Unique constraints on business keys

## Security Architecture

### Frontend Security
1. **HttpOnly Cookies**: Prevents XSS attacks
2. **No localStorage JWT**: Safer than client-side storage
3. **CSRF Protection**: SameSite cookie attribute
4. **Input Validation**: Client-side before API calls
5. **XSS Prevention**: React's built-in escaping

### Backend Security
1. **Password Hashing**: bcrypt with salt
2. **JWT Expiration**: Enforced on all requests
3. **Role-Based Access**: Middleware enforcement
4. **Email Verification**: Required for signup
5. **Rate Limiting**: (Recommended to implement)
6. **CORS Configuration**: Proper origin validation
7. **SQL Injection**: Parameterized queries (pgx)

## Deployment Architecture (Recommended)

```
┌────────────────────────────────────────────┐
│             Production Setup               │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────┐                         │
│  │   CDN        │                         │
│  │  (Frontend)  │                         │
│  └──────┬───────┘                         │
│         │                                  │
│         ▼                                  │
│  ┌──────────────┐     ┌──────────────┐   │
│  │  Load        │────►│  Backend     │   │
│  │  Balancer    │     │  Server(s)   │   │
│  └──────────────┘     └──────┬───────┘   │
│                              │            │
│                              ▼            │
│                       ┌──────────────┐   │
│                       │  PostgreSQL  │   │
│                       │  (Primary)   │   │
│                       └──────┬───────┘   │
│                              │            │
│                              ▼            │
│                       ┌──────────────┐   │
│                       │  PostgreSQL  │   │
│                       │  (Replica)   │   │
│                       └──────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

## Monitoring & Logging (Future)

### Recommended Tools
- **Frontend**: Sentry for error tracking
- **Backend**: Structured logging with logrus
- **Database**: pg_stat_statements
- **Metrics**: Prometheus + Grafana
- **Alerts**: PagerDuty or similar

---

**Last Updated**: October 2025  
**Related Docs**:
- [API Details](./FRONTEND_GUIDE.md)
- [Authentication Flow](../workflows/authentication-flow.md)
- [Contest Lifecycle](../workflows/contest-lifecycle.md)

