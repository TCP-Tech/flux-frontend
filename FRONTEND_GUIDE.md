# FLUX - Frontend Development Guide

## Project Overview

**Flux** is a comprehensive competitive programming platform designed for managing coding contests, tournaments, problems, and automated submissions to external judges (like Codeforces). It's built with Go, PostgreSQL, and features a RESTful API architecture.

### Core Concept
Flux allows administrators/managers to:
- Create and manage competitive programming problems
- Organize contests with selected problems and registered users
- Structure tournaments with multiple rounds containing contests
- Automatically submit solutions to external platforms via bot accounts
- Track user scores, submissions, and leaderboards
- Control access through role-based permissions and lock mechanisms

---

## System Architecture

### Technology Stack
- **Backend**: Go 1.24.5
- **Database**: PostgreSQL with pgx/v5
- **Authentication**: JWT tokens (cookie-based)
- **Email**: SMTP (Gmail) for verification/reset password
- **Router**: Chi v5 with CORS support
- **API Version**: v1 (mounted at `/v1`)

### Base URL Structure
```
API_URL/v1/{endpoint}
```

---

## Authentication System

### JWT Cookie-Based Authentication
- **Cookie name**: `flux_jwt_session`
- **Security**: HttpOnly, Secure, SameSite=Lax
- **Claims**: Contains `user_id` (UUID) and `user_name` (string)
- **Usage**: Most endpoints require JWT authentication via middleware

### Auth Endpoints

#### 1. Sign Up (Email Verification Required)

**Step 1: Request Verification Email**
```http
GET /v1/auth/signup?email={email}
```

**Step 2: Complete Signup**
```http
POST /v1/auth/signup
Content-Type: application/json

{
  "first_name": "string (min 4 chars)",
  "last_name": "string (min 4 chars)",
  "roll_no": "string (exactly 8 digits)",
  "password": "string (7-20 chars)",
  "email": "valid email",
  "verification_token": "string (from email)"
}
```

**Response (201 Created):**
```json
{
  "user_name": "string",
  "roll_no": "string"
}
```

#### 2. Login

```http
POST /v1/auth/login
Content-Type: application/json

{
  "user_name": "string (optional, either this or roll_no)",
  "roll_no": "string (optional, either this or user_name)",
  "password": "string",
  "remember_for_month": boolean
}
```

**Response (200 OK):** Sets JWT cookie + returns user details

#### 3. Password Reset

**Step 1: Request Reset Email**
```http
GET /v1/auth/reset-password?email={email}
```

**Step 2: Reset Password**
```http
POST /v1/auth/reset-password
Content-Type: application/json

{
  "user_name": "string (optional)",
  "roll_no": "string (optional)",
  "password": "string",
  "token": "string (from email)"
}
```

#### 4. Get Current User

```http
GET /v1/me
Cookie: flux_jwt_session={jwt_token}
```

**Response (200 OK):** Current user details

---

## Core Entities

### 1. Users

```typescript
interface User {
  id: string; // UUID
  roll_no: string; // 8-digit unique identifier
  user_name: string; // unique
  first_name: string;
  last_name: string;
  email: string; // unique
  created_at: string; // ISO 8601 timestamp
  roles?: string[]; // e.g., ["role_manager", "role_user"]
}
```

**Key Constraints:**
- `roll_no`: Must be exactly 8 numeric digits, unique
- `user_name`: Automatically generated, unique
- `email`: Must be valid email format, unique

---

### 2. Locks (Access Control System)

Locks control visibility/access to problems, contests, and tournament rounds.

```typescript
interface Lock {
  lock_id: string; // UUID
  name: string; // min 4 chars
  created_by: string; // UUID
  created_at: string; // timestamp
  description: string;
  access: string; // role name (e.g., "role_manager")
  lock_type: "manual" | "timer";
  timeout?: string; // timestamp, required for "timer" type, null for "manual"
}
```

**Lock Types:**
- **manual**: Requires explicit unlock by administrator
- **timer**: Automatically unlocks after timeout timestamp

#### Lock Endpoints

**Get Lock by ID**
```http
GET /v1/locks?lock_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

**Search Locks**
```http
POST /v1/locks/search
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "lock_name": "string (optional)",
  "creator_user_name": "string (optional)",
  "creator_roll_no": "string (optional)",
  "page_number": number, // min 1
  "page_size": number // 1-100
}
```

**Create Lock**
```http
POST /v1/locks
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "lock_type": "manual" | "timer",
  "timeout": "string (ISO timestamp, only if timer)",
  "access": "string (role name)"
}
```

**Update Lock**
```http
PUT /v1/locks
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "lock_id": "UUID",
  "name": "string",
  // ... other fields to update
}
```

**Delete Lock**
```http
DELETE /v1/locks?lock_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

---

### 3. Problems

Problems are competitive programming challenges that can be added to contests.

```typescript
interface Problem {
  id: number; // auto-generated starting from 1234
  title: string; // 4-100 chars
  difficulty: number; // 800-3000 (Codeforces scale)
  evaluator: "codeforces"; // platform for evaluation
  lock_id?: string; // UUID, optional
  created_by: string; // UUID
  last_updated_by: string; // UUID
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

interface StandardProblemData {
  problem_id: number;
  statement: string; // problem description
  input_format: string;
  output_format: string;
  function_definitions?: {
    [language: string]: string; // e.g., { "python": "def solve():", "cpp": "int solve() {" }
  };
  example_test_cases?: {
    num_test_cases?: number;
    examples: Array<{
      input: string;
      output: string;
    }>;
  };
  notes?: string;
  memory_limit_kb: number; // min 1024
  time_limit_ms: number; // min 500
  submission_link?: string; // URL to problem on external platform
  last_updated_by: string; // UUID
}
```

#### Problem Endpoints

**Get Problem by ID**
```http
GET /v1/problems/standard?problem_id={id}
Cookie: flux_jwt_session={jwt_token}
```

**Search Problems**
```http
POST /v1/problems/search
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "title": "string (optional)",
  "problem_ids": [number] (optional),
  "lock_id": "UUID (optional)",
  "evaluator": "string (optional)",
  "creator_user_name": "string (optional)",
  "creator_roll_number": "string (optional)",
  "page_number": number, // min 1
  "page_size": number // 0-10000
}
```

**Add New Problem**
```http
POST /v1/problems/standard
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "problem": {
    "title": "string",
    "difficulty": number,
    "evaluator": "codeforces",
    "lock_id": "UUID (optional)"
  },
  "problem_data": {
    "statement": "string",
    "input_format": "string",
    "output_format": "string",
    "function_definitions": {},
    "example_test_cases": {},
    "notes": "string",
    "memory_limit_kb": number,
    "time_limit_ms": number,
    "submission_link": "string (URL)"
  }
}
```

**Response (201 Created):**
```json
{
  "problem": { /* Problem object with generated ID */ },
  "problem_data": { /* StandardProblemData object */ }
}
```

**Update Problem**
```http
PUT /v1/problems
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "id": number,
  // ... fields to update
}
```

---

### 4. Contests

Contests are timed events with selected problems and registered users.

```typescript
interface Contest {
  contest_id: string; // UUID
  title: string; // 5-100 chars
  lock_id?: string; // UUID, optional
  start_time?: string; // ISO timestamp, optional
  end_time: string; // ISO timestamp, required
  is_published: boolean;
  created_by: string; // UUID
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

interface ContestProblem {
  problem_id: number;
  score: number; // min 0
}

interface ContestProblemResponse {
  problem: Problem; // full problem details
  score: number;
}

interface CreateContestRequest {
  contest_details: Contest;
  user_names: string[]; // usernames of registered users
  problems: ContestProblem[];
}
```

#### Contest Endpoints

**Get Contest by ID**
```http
GET /v1/contests?contest_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

**Get Contest Problems**
```http
GET /v1/contests/problems?contest_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

**Response:** Array of `ContestProblemResponse`

**Get Contest Users**
```http
GET /v1/contests/users?contest_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

**Response:** Array of User objects

**Get User's Registered Contests**
```http
GET /v1/contests/user-registered
Cookie: flux_jwt_session={jwt_token}
```

**Search Contests**
```http
POST /v1/contests/search
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "contest_ids": ["UUID"] (optional),
  "is_published": boolean (optional),
  "lock_id": "UUID (optional)",
  "title": "string (optional)",
  "page_number": number, // 1-10000
  "page_size": number // 0-10000
}
```

**Create Contest**
```http
POST /v1/contests
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "contest_details": {
    "title": "string",
    "lock_id": "UUID (optional)",
    "start_time": "ISO timestamp (optional)",
    "end_time": "ISO timestamp",
    "is_published": boolean
  },
  "user_names": ["username1", "username2"],
  "problems": [
    { "problem_id": number, "score": number }
  ]
}
```

**Update Contest Details**
```http
PUT /v1/contests
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "contest_id": "UUID",
  "title": "string",
  // ... other fields to update
}
```

**Update Contest Users**
```http
PUT /v1/contests/users
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "contest_id": "UUID",
  "user_names": ["username1", "username2"]
}
```

**Update Contest Problems**
```http
PUT /v1/contests/problems
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "contest_id": "UUID",
  "problems": [
    { "problem_id": number, "score": number }
  ]
}
```

**Delete Contest**
```http
DELETE /v1/contests?contest_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

---

### 5. Tournaments

Tournaments organize multiple contests into structured rounds.

```typescript
interface Tournament {
  id: string; // UUID
  title: string; // 5-100 chars, unique
  is_published: boolean;
  created_by: string; // UUID
  created_at: string; // timestamp
  updated_at: string; // timestamp
  rounds: number; // total number of rounds
}

interface TournamentRound {
  id: string; // UUID
  tournament_id: string; // UUID
  title: string; // 5-100 chars
  round_no: number;
  lock_id?: string; // UUID, optional
  created_by: string; // UUID
  updated_at: string; // timestamp
}
```

#### Tournament Endpoints

**Get Tournament**
```http
GET /v1/tournaments?tournament_id={uuid}
Cookie: flux_jwt_session={jwt_token}
```

**Get Tournament Round**
```http
GET /v1/tournaments/rounds?tournament_id={uuid}&round_no={number}
Cookie: flux_jwt_session={jwt_token}
```

**Search Tournaments**
```http
POST /v1/tournaments/search
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "title": "string (optional)",
  "is_published": boolean (optional),
  "page_size": number, // 0-10000
  "page_number": number // 1-10000
}
```

**Create Tournament**
```http
POST /v1/tournaments
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "title": "string",
  "is_published": boolean
}
```

**Create Tournament Round**
```http
POST /v1/tournaments/rounds
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "tournament_id": "UUID",
  "title": "string",
  "round_no": number,
  "lock_id": "UUID (optional)"
}
```

**Change Round Contests**
```http
PUT /v1/tournaments/contests
Cookie: flux_jwt_session={jwt_token}
Content-Type: application/json

{
  "tournament_id": "UUID",
  "round_no": number,
  "contest_ids": ["UUID1", "UUID2"]
}
```

---

### 6. Submissions & Scores (Future Implementation)

The backend has infrastructure for:

```typescript
interface Submission {
  id: string; // UUID
  bot_account_id: string; // UUID
  website_data: any; // platform-specific data (JSON)
  submitted_by: string; // UUID
  contest_id?: string; // UUID, optional
  problem_id: number;
  language: string;
  solution: string; // code
  status?: string; // "Accepted", "Wrong Answer", etc.
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

interface Bot {
  id: string; // UUID
  account_name: string;
  platform: string; // "codeforces"
  website_data: any; // API keys, cookies, etc. (JSON)
  created_at: string;
  updated_at: string;
}

interface UserScore {
  user_id: string; // UUID
  contest_id: string; // UUID
  problem_id: number;
  score: number;
  updated_at: string; // timestamp
  submission_id: string; // UUID
}
```

**Note:** Submission endpoints are not yet exposed in the API but database schema exists.

---

## User Roles & Permissions

The system uses role-based access control:

### Roles
- **role_manager**: Can create/edit problems, contests, tournaments, locks
- **role_user**: Can view published content, participate in contests
- **role_admin**: Full system access (future)

### Permission Model
- Locks reference role names in their `access` field
- Content with locks is only visible to users with the required role
- Timer locks automatically unlock after timeout
- Manual locks require explicit management

### Role Assignment
Users can have multiple roles via the `user_roles` join table.

---

## Frontend UI Requirements

### Pages Needed

#### 1. Authentication Pages

**Sign Up Page**
- Email input field
- "Send Verification Code" button
- After email sent: Form with:
  - First Name (min 4 chars)
  - Last Name (min 4 chars)
  - Roll Number (exactly 8 digits)
  - Password (7-20 chars)
  - Verification Token (from email)
- Submit button

**Login Page**
- Username OR Roll Number input
- Password input
- "Remember me for a month" checkbox
- Submit button
- Links to: Sign Up, Forgot Password

**Password Reset Page**
- Email input → Send Reset Link
- After email sent: Form with:
  - Username OR Roll Number
  - New Password
  - Reset Token
- Submit button

#### 2. Dashboard (Protected)

**User Dashboard**
- Welcome message with user name
- Quick stats:
  - Contests registered
  - Problems solved
  - Current rank
- Upcoming contests list
- Recent submissions

**Manager Dashboard** (role_manager)
- Same as user dashboard +
- Quick actions:
  - Create Problem
  - Create Contest
  - Create Tournament
  - Manage Locks
- Recent activity feed

#### 3. Problems Section

**Problem List Page** (All Users)
- Search bar (title)
- Filters:
  - Difficulty range (800-3000)
  - Evaluator
  - Creator
  - Lock status
- Sortable table:
  - ID
  - Title
  - Difficulty (with visual indicator)
  - Locked/Unlocked status
  - Actions (View)
- Pagination controls

**Problem Detail Page**
- Problem title and ID
- Difficulty badge
- Lock status indicator
- Problem statement (rich text/markdown)
- Input format
- Output format
- Example test cases (collapsible)
- Constraints (time, memory)
- Notes section
- Function definitions (per language, tabs)
- External link (if available)
- Edit button (managers only)

**Add/Edit Problem Page** (Managers)
- Form with tabs:
  - **Basic Info**: Title, Difficulty, Evaluator, Lock
  - **Statement**: Rich text editor
  - **Format**: Input/Output format
  - **Examples**: Dynamic list of test cases
  - **Constraints**: Time/Memory limits
  - **Links**: Submission link
- Preview pane
- Save/Update button

#### 4. Contests Section

**Contest List Page**
- Search bar (title)
- Filters:
  - Published/Unpublished
  - Date range
  - Lock status
- Contest cards showing:
  - Title
  - Start/End time
  - Status (Upcoming/Live/Ended)
  - Participant count
  - Problem count
  - Register button (if applicable)
- Sort: By date, participants, status

**Contest Detail Page**
- Contest title and ID
- Status indicator (Upcoming/Live/Ended)
- Timer/Countdown
- Start and end times
- Lock status
- Tabs:
  - **Problems**: List with scores
  - **Leaderboard**: Real-time standings
  - **My Submissions**: User's submission history
  - **Participants**: Registered users list
- Edit button (managers/creator only)

**Create/Edit Contest Page** (Managers)
- Multi-step wizard:
  1. **Contest Details**: Title, dates, lock, publish status
  2. **Select Problems**: Search and add problems, set scores
  3. **Register Users**: Search and add users
  4. **Review**: Summary before creation
- Save as Draft / Publish

#### 5. Tournaments Section

**Tournament List Page**
- Search bar (title)
- Filters: Published status
- Tournament cards:
  - Title
  - Round count
  - Status
  - Creator
- View button

**Tournament Detail Page**
- Tournament title
- Status
- Rounds list (expandable):
  - Round number and title
  - Lock status
  - Contests in round (click to view)
  - Standings for round
- Overall tournament standings
- Edit button (managers/creator)

**Create/Edit Tournament Page** (Managers)
- Tournament title
- Publish checkbox
- Rounds section:
  - Add Round button
  - For each round:
    - Title
    - Lock selection
    - Contest selection (multi-select)
- Save button

#### 6. Locks Management Page (Managers)

**Lock List Page**
- Search bar (name)
- Filters: Type, Creator
- Table:
  - Name
  - Type (manual/timer)
  - Timeout (if timer)
  - Access role
  - Status (Active/Expired)
  - Actions (Edit, Delete)
- Create Lock button

**Create/Edit Lock Page**
- Lock name
- Description
- Type selector (manual/timer)
- If timer: DateTime picker for timeout
- Access role selector
- Save button

#### 7. User Views

**Browse Published Contests**
- Similar to contest list but filtered to published only
- Register button for each contest
- Shows "Registered" badge if already registered

**Active Contest View**
- Problem list (if unlocked and contest is live)
- Submit solution:
  - Language selector
  - Code editor (Monaco/CodeMirror)
  - Submit button
- Live leaderboard
- Timer

**Submission History**
- Table:
  - Problem title
  - Contest name
  - Language
  - Status
  - Time submitted
  - Score awarded
  - View code button

**Leaderboard Page**
- Real-time standings table:
  - Rank
  - User name
  - Total score
  - Problem-wise scores
  - Penalty time
  - Last submission time
- Auto-refresh toggle
- Export button

#### 8. Profile Page

**User Profile**
- Avatar (future)
- User details:
  - Name
  - Username
  - Roll number
  - Email
  - Roles (badges)
  - Joined date
- Statistics:
  - Problems solved
  - Contests participated
  - Best rank
  - Total score
- Recent activity
- Settings (future)

---

## Key Features to Implement

### 1. Access Control UI

**Lock Status Indicators**
- 🔒 Locked icon with tooltip showing unlock condition
- 🔓 Unlocked icon
- ⏱️ Timer icon with countdown for timer locks

**Role Badges**
- Visual badges for user roles (Manager, User, Admin)
- Role-specific UI elements (hide/show based on role)

**Locked Content Display**
- "This content is locked" message
- Display lock reason (timer with countdown or manual)
- "Required role: X" indicator

### 2. Contest Timer

**Countdown Timer**
- Before contest starts: "Starts in X hours Y minutes"
- During contest: "Ends in X hours Y minutes" (prominent)
- After contest: "Ended X hours ago"
- Visual progress bar

**Live Status Indicator**
- 🔴 Live (green pulse animation)
- 🟡 Upcoming (yellow)
- ⚫ Ended (gray)

### 3. Problem Display

**Rich Text Support**
- Markdown rendering for problem statements
- LaTeX support for mathematical notation
- Syntax highlighting for code blocks
- Images/diagrams (future)

**Example Test Cases**
- Collapsible sections
- Copy button for inputs/outputs
- Side-by-side view

**Constraint Tags**
- Time limit chip (e.g., "⏱️ 2000ms")
- Memory limit chip (e.g., "💾 256MB")
- Difficulty badge with color coding:
  - 800-1200: Green (Easy)
  - 1200-1800: Yellow (Medium)
  - 1800-2400: Orange (Hard)
  - 2400+: Red (Expert)

### 4. Submission Interface

**Code Editor**
- Syntax highlighting
- Auto-completion
- Theme toggle (light/dark)
- Font size adjustment
- Line numbers
- Language selector dropdown

**Submit Button**
- Confirmation dialog before submit
- Show estimated time
- Disable during submission processing

**Status Polling**
- After submit, poll for status updates
- Status indicators:
  - ⏳ Queued (gray)
  - 🔄 Running (blue pulse)
  - ✅ Accepted (green)
  - ❌ Wrong Answer (red)
  - ⚠️ Time Limit Exceeded (orange)
  - 💥 Runtime Error (red)

### 5. Leaderboard

**Real-time Updates**
- WebSocket connection (future) or polling
- Smooth rank transitions with animations
- Highlight current user's row

**Problem Breakdown**
- Columns for each problem showing:
  - Score on that problem
  - ✅ if solved
  - ❌ if attempted but not solved
  - — if not attempted

**Penalty Calculation**
- Display penalty time
- Tooltip explaining penalty calculation

**Rank Calculation**
- Tie-breaking logic display
- Rank change indicators (▲▼)

### 6. Search & Filters

**Search Functionality**
- Debounced search input
- Search as you type
- Clear button

**Filter Panels**
- Collapsible filter sidebar
- Multi-select for categories
- Date range pickers
- Reset filters button

**Pagination**
- Page number input
- Page size selector (10, 25, 50, 100)
- First/Previous/Next/Last buttons
- Total results count

**Sort Options**
- Sortable table headers
- Sort direction indicators (▲▼)
- Multi-column sort (future)

### 7. Notifications (Future)

**Toast Notifications**
- Success (green)
- Error (red)
- Warning (yellow)
- Info (blue)

**Real-time Updates**
- Contest starting soon
- New submission result
- Rank change

---

## Technical Considerations

### Request/Response Patterns

**Standard Response Codes**
- `200 OK`: Successful GET/PUT
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation error or malformed request
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: Valid JWT but insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server-side error

**Error Response Format**
```json
{
  "error": "Descriptive error message"
}
```

**Validation Errors**
- Return field-specific errors
- Example: "first_name must be at least 4 characters"

### Date/Time Handling

**Backend Format**
- All timestamps are PostgreSQL `TIMESTAMP WITH TIME ZONE`
- JSON serialization: ISO 8601 format (`2025-10-11T10:30:00Z`)

**Frontend Considerations**
- Parse ISO strings to Date objects
- Display in user's local timezone
- Use libraries like `date-fns` or `dayjs` for formatting
- Show relative times ("2 hours ago") for recent dates
- Show countdown timers for upcoming events

### Pagination

**Request Parameters**
- `page_number`: 1-indexed (default: 1)
- `page_size`: Items per page (default varies by endpoint)

**Response Handling**
- Calculate total pages: `Math.ceil(totalItems / pageSize)`
- Disable previous on page 1
- Disable next on last page

### UUID Format

**Standard UUID v4**
- Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Always use strings in API requests
- Validate format before sending

### Cookie Management

**JWT Cookie**
- Automatically sent by browser on same-origin requests
- For cross-origin: Set `withCredentials: true` in Axios/Fetch
- Cookie expires based on `remember_for_month` in login

**Example (Axios)**
```javascript
axios.defaults.withCredentials = true;
```

**Example (Fetch)**
```javascript
fetch(url, {
  credentials: 'include'
})
```

---

## Security Best Practices

### Client-Side

1. **Never store JWT in localStorage** - It's already in HttpOnly cookie
2. **Validate user input** before sending to API
3. **Sanitize HTML** when displaying user-generated content
4. **Use HTTPS** in production
5. **Implement CSRF protection** (SameSite cookie provides some protection)
6. **Rate limit** submission attempts (UI-level)

### API Communication

1. **Always include credentials** (cookies) in requests
2. **Handle 401 errors** by redirecting to login
3. **Implement request timeouts**
4. **Retry logic** for network failures
5. **Log errors** to monitoring service

---

## Environment Configuration

### Frontend Environment Variables

```env
# Required
VITE_API_URL=http://localhost:8080/v1  # or your backend URL

# Optional
VITE_ENABLE_MOCK_API=false
VITE_API_TIMEOUT=30000
VITE_REFRESH_INTERVAL=5000  # for leaderboard polling
```

### Backend CORS Configuration

The backend allows:
- **Origins**: `https://*`, `http://*`
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: All (`*`)
- **Credentials**: Allowed

---

## Suggested Frontend Tech Stack

### Core Framework
- **React** with TypeScript (recommended)
  - Next.js for SSR/SSG
  - Vite for fast dev experience
- **Vue 3** with TypeScript
  - Nuxt 3 for SSR
- **Angular** 16+

### State Management
- **React**: Zustand, Redux Toolkit, or Jotai
- **Vue**: Pinia
- **Angular**: NgRx

### HTTP Client
- **Axios** (recommended for interceptors)
- **Fetch API** with wrapper
- **React Query** / **TanStack Query** (for data fetching and caching)

### UI Component Library
- **Material-UI** (MUI) - comprehensive, well-documented
- **Ant Design** - enterprise-ready
- **Chakra UI** - accessible, customizable
- **shadcn/ui** - modern, Tailwind-based

### Code Editor
- **Monaco Editor** (VSCode engine) - feature-rich
- **CodeMirror 6** - lightweight, extensible

### Form Handling
- **React Hook Form** - performant, easy validation
- **Formik** - battle-tested
- **Vee-Validate** (Vue)

### Date/Time
- **date-fns** - modular, tree-shakeable
- **Day.js** - lightweight Moment.js alternative

### Markdown Rendering
- **react-markdown** with **remark-gfm**
- **markdown-it**

### Charts & Visualization
- **Recharts** - React-friendly
- **Chart.js** - versatile
- **Apache ECharts** - powerful

### Styling
- **Tailwind CSS** - utility-first
- **Styled-components** / **Emotion** - CSS-in-JS
- **SCSS** - traditional approach

### Testing
- **Vitest** - fast Vite-native testing
- **Jest** - battle-tested
- **React Testing Library** / **Vue Testing Library**
- **Cypress** / **Playwright** - E2E testing

---

## Development Roadmap

### Phase 1: Foundation (Weeks 1-2)
1. ✅ Set up project structure
2. ✅ Configure routing
3. ✅ Implement authentication flow
   - Sign up with email verification
   - Login with cookie handling
   - Password reset
4. ✅ Create layout components
   - Header with user menu
   - Sidebar navigation
   - Footer
5. ✅ Implement user dashboard
6. ✅ Set up HTTP client with interceptors

### Phase 2: Core Features (Weeks 3-4)
1. ✅ Problem module
   - List view with search/filter
   - Detail view
   - Create/Edit forms (managers)
2. ✅ Contest module
   - List view with filters
   - Detail view with tabs
   - Create/Edit wizard (managers)
3. ✅ Lock management (managers)

### Phase 3: Advanced Features (Weeks 5-6)
1. ✅ Tournament module
   - List and detail views
   - Create/Edit with rounds
2. ✅ Leaderboard
   - Real-time updates
   - Sorting and filtering
3. ✅ User profile
   - View statistics
   - Edit profile

### Phase 4: Submissions (Weeks 7-8)
*Note: Backend APIs for submissions not yet exposed*
1. ⏳ Code editor integration
2. ⏳ Submission interface
3. ⏳ Status polling
4. ⏳ Submission history

### Phase 5: Polish (Weeks 9-10)
1. ⏳ Responsive design refinements
2. ⏳ Loading states and skeletons
3. ⏳ Error boundaries
4. ⏳ Performance optimization
5. ⏳ Accessibility improvements
6. ⏳ Unit and E2E tests

### Phase 6: Future Enhancements
1. ⏳ WebSocket for real-time updates
2. ⏳ Notifications system
3. ⏳ Advanced analytics dashboard
4. ⏳ User avatars and profiles
5. ⏳ Discussion forums
6. ⏳ Editorial solutions
7. ⏳ Practice mode

---

## API Quick Reference

### Authentication
- `GET /v1/auth/signup?email={email}` - Send verification email
- `POST /v1/auth/signup` - Complete signup
- `POST /v1/auth/login` - Login
- `GET /v1/auth/reset-password?email={email}` - Send reset email
- `POST /v1/auth/reset-password` - Reset password
- `GET /v1/me` - Get current user

### Locks
- `GET /v1/locks?lock_id={uuid}` - Get lock
- `POST /v1/locks/search` - Search locks
- `POST /v1/locks` - Create lock
- `PUT /v1/locks` - Update lock
- `DELETE /v1/locks?lock_id={uuid}` - Delete lock

### Problems
- `GET /v1/problems/standard?problem_id={id}` - Get problem
- `POST /v1/problems/search` - Search problems
- `POST /v1/problems/standard` - Create problem
- `PUT /v1/problems` - Update problem

### Contests
- `GET /v1/contests?contest_id={uuid}` - Get contest
- `GET /v1/contests/problems?contest_id={uuid}` - Get contest problems
- `GET /v1/contests/users?contest_id={uuid}` - Get contest users
- `GET /v1/contests/user-registered` - Get user's contests
- `POST /v1/contests/search` - Search contests
- `POST /v1/contests` - Create contest
- `PUT /v1/contests` - Update contest
- `PUT /v1/contests/users` - Update contest users
- `PUT /v1/contests/problems` - Update contest problems
- `DELETE /v1/contests?contest_id={uuid}` - Delete contest

### Tournaments
- `GET /v1/tournaments?tournament_id={uuid}` - Get tournament
- `GET /v1/tournaments/rounds?tournament_id={uuid}&round_no={n}` - Get round
- `POST /v1/tournaments/search` - Search tournaments
- `POST /v1/tournaments` - Create tournament
- `POST /v1/tournaments/rounds` - Create round
- `PUT /v1/tournaments/contests` - Update round contests

---

## Common Patterns

### API Request with Error Handling

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Example usage
async function fetchProblems(filters: ProblemFilters) {
  try {
    const response = await api.post('/problems/search', filters);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    throw error;
  }
}
```

### Pagination Hook (React)

```typescript
function usePagination(initialPage = 1, initialPageSize = 25) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));
  const goToPage = (n: number) => setPage(n);

  return {
    page,
    pageSize,
    setPageSize,
    nextPage,
    prevPage,
    goToPage,
  };
}
```

### Contest Timer Component

```typescript
function ContestTimer({ startTime, endTime }: { startTime: string, endTime: string }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [status, setStatus] = useState<'upcoming' | 'live' | 'ended'>('upcoming');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();

      if (now < start) {
        setStatus('upcoming');
        setTimeLeft(formatTimeLeft(start - now));
      } else if (now < end) {
        setStatus('live');
        setTimeLeft(formatTimeLeft(end - now));
      } else {
        setStatus('ended');
        setTimeLeft('Contest ended');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  return (
    <div className={`status-${status}`}>
      {status === 'upcoming' && '🟡 Starts in: '}
      {status === 'live' && '🔴 Ends in: '}
      {status === 'ended' && '⚫ '}
      {timeLeft}
    </div>
  );
}
```

---

## Support & Resources

### Backend Information
- **Language**: Go 1.24.5
- **Framework**: Chi router
- **Database**: PostgreSQL
- **Email**: SMTP via Gmail

### Key Backend Features
- Email verification for signup/password reset
- JWT session management
- Role-based access control
- Lock system for content visibility
- Transaction support for atomic operations
- Task scheduler for background jobs
- Email worker pool

---

## Notes for Developers

1. **User names are auto-generated** by the backend - don't provide them in signup
2. **Roll numbers must be exactly 8 numeric digits**
3. **Password constraints**: 7-20 characters
4. **JWT is HttpOnly cookie** - don't try to access it from JavaScript
5. **All protected endpoints** require the JWT cookie
6. **Locks are role-based** - check user roles to show/hide locked content
7. **Timer locks auto-unlock** - implement countdown timers in UI
8. **Problem IDs are integers** starting from 1234
9. **Contest/Tournament IDs are UUIDs**
10. **Pagination is 1-indexed** (page_number starts at 1, not 0)

---

## Troubleshooting

### Common Issues

**Issue**: "Authentication required: JWT cookie not found"
- **Solution**: Ensure `withCredentials: true` is set in HTTP client

**Issue**: CORS errors
- **Solution**: Backend allows all origins; check if credentials are being sent

**Issue**: "Invalid request payload" errors
- **Solution**: Check field names match exactly (use json tags from models)

**Issue**: Email verification not received
- **Solution**: Check spam folder; backend uses Gmail SMTP

**Issue**: Locks not working as expected
- **Solution**: Verify user has correct role; check lock timeout hasn't expired

---

## Glossary

- **Roll Number**: 8-digit unique identifier for users (like student ID)
- **Lock**: Access control mechanism for problems/contests/rounds
- **Evaluator**: External platform (like Codeforces) that judges submissions
- **SPD**: Standard Problem Data - detailed problem information
- **Bot**: Automated account for submitting to external platforms
- **Tournament Round**: Container for multiple contests within a tournament
- **Timer Lock**: Lock that automatically unlocks after a timeout
- **Manual Lock**: Lock that requires explicit unlock action

---

*Last Updated: October 11, 2025*
*Backend Version: v1*
*API Base Path: `/v1`*

