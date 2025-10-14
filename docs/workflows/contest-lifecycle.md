# Contest Lifecycle Workflow

## Overview
This document describes the complete lifecycle of a contest in the Flux platform, from creation to completion and leaderboard finalization.

## Contest States

```
┌───────────┐    ┌──────────┐    ┌──────┐    ┌────────┐
│  Draft    │───▶│ Published│───▶│ Live │───▶│ Ended  │
└───────────┘    └──────────┘    └──────┘    └────────┘
     │                │              │            │
     └────────────────┴──────────────┴────────────┘
              (Can be deleted/edited)
```

### State Descriptions
- **Draft**: Contest created but not published (only creators/managers can see)
- **Published**: Contest visible to registered users, waiting to start
- **Live**: Contest is active, users can submit solutions
- **Ended**: Contest finished, final leaderboard calculated

## Contest Creation Workflow

### Manager Flow

```
┌─────────────┐
│  Manager    │
└──────┬──────┘
       │
       │ 1. Click "Create Contest"
       ▼
┌─────────────────────────┐
│ Contest Creation Form   │
│ Step 1: Basic Details   │
│  - Title                │
│  - Start Time (optional)│
│  - End Time (required)  │
│  - Lock (optional)      │
│  - Publish checkbox     │
└──────┬──────────────────┘
       │
       │ 2. Next Step
       ▼
┌─────────────────────────┐
│ Step 2: Select Problems │
│  - Search problems      │
│  - Add to contest       │
│  - Set score per problem│
└──────┬──────────────────┘
       │
       │ 3. Next Step
       ▼
┌─────────────────────────┐
│ Step 3: Register Users  │
│  - Search users         │
│  - Add to contest       │
└──────┬──────────────────┘
       │
       │ 4. Review & Create
       ▼
┌─────────────────────────┐
│ Step 4: Review          │
│  - Summary of all info  │
│  - Create button        │
└──────┬──────────────────┘
       │
       │ 5. POST /contests
       ▼
┌─────────────────────────┐
│ Contest Created         │
│ (Draft or Published)    │
└─────────────────────────┘
```

### API Call

```typescript
const createContest = async (contestData: CreateContestRequest) => {
  const response = await api.post('/contests', {
    contest_details: {
      title: "Monthly Contest #1",
      lock_id: "optional-uuid",
      start_time: "2025-11-01T10:00:00Z",
      end_time: "2025-11-01T13:00:00Z",
      is_published: true
    },
    user_names: ["user1", "user2", "user3"],
    problems: [
      { problem_id: 1234, score: 100 },
      { problem_id: 1235, score: 150 },
      { problem_id: 1236, score: 200 }
    ]
  });
  
  return response.data;
};
```

## Contest Participation Workflow

### User Registration Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Browse published contests
       ▼
┌─────────────────────────┐
│ Contest List Page       │
│  - Filter by status     │
│  - Search by title      │
└──────┬──────────────────┘
       │
       │ 2. View contest details
       ▼
┌─────────────────────────┐
│ Contest Detail Page     │
│  - Problems (if unlocked)│
│  - Timing info          │
│  - Register button      │
└──────┬──────────────────┘
       │
       │ 3. Click "Register"
       ▼
┌─────────────────────────┐
│ Registration Confirmed  │
│ (Manager adds user)     │
└──────┬──────────────────┘
       │
       │ 4. Wait for contest start
       ▼
┌─────────────────────────┐
│ Contest Live Notification│
└─────────────────────────┘
```

### During Contest

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Navigate to live contest
       ▼
┌─────────────────────────┐
│ Contest Page (Live)     │
│  - Timer (countdown)    │
│  - Problem list         │
│  - Leaderboard (live)   │
└──────┬──────────────────┘
       │
       │ 2. Select problem
       ▼
┌─────────────────────────┐
│ Problem Detail Page     │
│  - Statement            │
│  - Examples             │
│  - Code editor          │
│  - Submit button        │
└──────┬──────────────────┘
       │
       │ 3. Write solution
       ▼
┌─────────────────────────┐
│ Code Editor             │
│  - Language selector    │
│  - Syntax highlighting  │
└──────┬──────────────────┘
       │
       │ 4. Submit solution
       ▼
┌─────────────────────────┐
│ POST /submissions       │
│  (Future endpoint)      │
└──────┬──────────────────┘
       │
       │ 5. Bot submits to platform
       ▼
┌─────────────────────────┐
│ External Judge          │
│ (e.g., Codeforces)      │
└──────┬──────────────────┘
       │
       │ 6. Result callback
       ▼
┌─────────────────────────┐
│ Update Score            │
│ Update Leaderboard      │
└─────────────────────────┘
```

## Contest Timing

### Timeline

```
Before Start        │   During Contest    │   After End
────────────────────┼─────────────────────┼──────────────
                    │                     │
Registration Open   │   Live Submissions  │   Read-only
Show countdown      │   Update leaderboard│   Final standings
Problems may be     │   Real-time scoring │   Solutions visible
locked              │                     │   
```

### Timer Component Logic

```typescript
function ContestTimer({ startTime, endTime }: TimerProps) {
  const [status, setStatus] = useState<ContestStatus>('upcoming');
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      
      if (now < start) {
        setStatus('upcoming');
        setTimeLeft(formatDuration(start - now));
      } else if (now < end) {
        setStatus('live');
        setTimeLeft(formatDuration(end - now));
      } else {
        setStatus('ended');
        setTimeLeft('Contest ended');
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, endTime]);
  
  return (
    <div className={`timer status-${status}`}>
      {status === 'upcoming' && '🟡 Starts in: '}
      {status === 'live' && '🔴 Ends in: '}
      {status === 'ended' && '⚫ '}
      {timeLeft}
    </div>
  );
}
```

## Leaderboard Updates

### Real-time Scoring

```
┌─────────────────┐
│  Submission     │
│  Accepted       │
└────────┬────────┘
         │
         │ 1. Calculate score
         ▼
┌─────────────────┐
│  Update         │
│  user_scores    │
│  table          │
└────────┬────────┘
         │
         │ 2. Recalculate ranks
         ▼
┌─────────────────┐
│  Sort by:       │
│  1. Total score │
│  2. Time penalty│
│  3. Last submit │
└────────┬────────┘
         │
         │ 3. Push update to frontend
         ▼
┌─────────────────┐
│  Leaderboard    │
│  (Live update)  │
└─────────────────┘
```

### Leaderboard Query

```typescript
const fetchLeaderboard = async (contestId: string) => {
  const response = await api.get(`/contests/${contestId}/leaderboard`);
  
  // Expected response:
  // [
  //   {
  //     rank: 1,
  //     user_name: "user1",
  //     total_score: 450,
  //     problem_scores: {
  //       1234: 100,
  //       1235: 150,
  //       1236: 200
  //     },
  //     penalty_time: 0,
  //     last_submission: "2025-11-01T11:30:00Z"
  //   },
  //   ...
  // ]
  
  return response.data;
};

// Auto-refresh during live contest
useEffect(() => {
  if (contestStatus === 'live') {
    const interval = setInterval(() => {
      fetchLeaderboard(contestId);
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }
}, [contestStatus, contestId]);
```

## Contest Management

### Editing Contest

```
┌─────────────┐
│  Manager    │
└──────┬──────┘
       │
       │ 1. Navigate to contest
       ▼
┌─────────────────────────┐
│ Contest Detail Page     │
│  - Edit button (managers)│
└──────┬──────────────────┘
       │
       │ 2. Click "Edit"
       ▼
┌─────────────────────────┐
│ Edit Contest Form       │
│  - Update details       │
│  - Add/remove problems  │
│  - Add/remove users     │
└──────┬──────────────────┘
       │
       │ 3. Save changes
       ▼
┌─────────────────────────┐
│ PUT /contests           │
│ PUT /contests/problems  │
│ PUT /contests/users     │
└─────────────────────────┘
```

### Update Operations

```typescript
// Update contest details
const updateContestDetails = async (contestId: string, updates: Partial<Contest>) => {
  await api.put('/contests', {
    contest_id: contestId,
    ...updates
  });
};

// Update contest problems
const updateContestProblems = async (contestId: string, problems: ContestProblem[]) => {
  await api.put('/contests/problems', {
    contest_id: contestId,
    problems: problems
  });
};

// Update contest users
const updateContestUsers = async (contestId: string, userNames: string[]) => {
  await api.put('/contests/users', {
    contest_id: contestId,
    user_names: userNames
  });
};
```

## Access Control

### Lock-Based Access

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       │ 1. Try to view contest
       ▼
┌─────────────────────────┐
│ Check Contest Lock      │
└──────┬──────────────────┘
       │
       ├─── No Lock ────────────┐
       │                        ▼
       │                 ┌─────────────┐
       │                 │ Show Contest│
       │                 └─────────────┘
       │
       ├─── Has Lock ───────────┐
       │                        ▼
       │                 ┌─────────────────┐
       │                 │ Check User Role │
       │                 └────────┬────────┘
       │                          │
       │                ┌─────────┴─────────┐
       │                │                   │
       │           Has Role          No Role
       │                │                   │
       │                ▼                   ▼
       │         ┌─────────────┐    ┌─────────────┐
       │         │ Show Contest│    │ Show Locked │
       │         └─────────────┘    │   Message   │
       │                            └─────────────┘
       │
       └─── Timer Lock ─────────────┐
                                    ▼
                            ┌─────────────────┐
                            │ Check Timeout   │
                            └────────┬────────┘
                                     │
                           ┌─────────┴─────────┐
                           │                   │
                      Expired              Active
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐
                    │ Show Contest│    │ Show Timer  │
                    └─────────────┘    │  + Locked   │
                                       └─────────────┘
```

## Contest Deletion

```
┌─────────────┐
│  Manager    │
└──────┬──────┘
       │
       │ 1. Select contest
       ▼
┌─────────────────────────┐
│ Contest Detail Page     │
│  - Delete button        │
└──────┬──────────────────┘
       │
       │ 2. Click "Delete"
       ▼
┌─────────────────────────┐
│ Confirmation Dialog     │
│  "Are you sure?"        │
└──────┬──────────────────┘
       │
       │ 3. Confirm
       ▼
┌─────────────────────────┐
│ DELETE /contests        │
│  ?contest_id={uuid}     │
└──────┬──────────────────┘
       │
       │ 4. Cascade delete
       ▼
┌─────────────────────────┐
│ Delete:                 │
│  - Contest record       │
│  - User registrations   │
│  - Problem associations │
│  - Submissions (keep?)  │
│  - Scores (keep?)       │
└─────────────────────────┘
```

## UI Components

### Contest Card Component

```typescript
interface ContestCardProps {
  contest: Contest;
  onRegister?: (contestId: string) => void;
}

function ContestCard({ contest, onRegister }: ContestCardProps) {
  const status = getContestStatus(contest.start_time, contest.end_time);
  const isRegistered = useIsRegistered(contest.contest_id);
  
  return (
    <div className="contest-card">
      <h3>{contest.title}</h3>
      <ContestStatus status={status} />
      <ContestTimer 
        startTime={contest.start_time} 
        endTime={contest.end_time} 
      />
      <div className="contest-meta">
        <span>Problems: {contest.problem_count}</span>
        <span>Participants: {contest.user_count}</span>
      </div>
      {!isRegistered && status === 'upcoming' && (
        <button onClick={() => onRegister?.(contest.contest_id)}>
          Register
        </button>
      )}
      {isRegistered && <span className="badge">Registered</span>}
    </div>
  );
}
```

## Best Practices

### For Managers
1. ✅ **Test contest setup** before publishing
2. ✅ **Set realistic time limits** for problems
3. ✅ **Register users** before contest starts
4. ✅ **Use locks** to control visibility
5. ✅ **Monitor leaderboard** during contest
6. ✅ **Keep backup** of problem statements

### For Users
1. ✅ **Register early** for contests
2. ✅ **Read all problems** before starting
3. ✅ **Check time remaining** frequently
4. ✅ **Test solutions** locally first
5. ✅ **Monitor leaderboard** for motivation
6. ✅ **Submit multiple times** if needed

---

**Last Updated**: October 2025  
**Related Docs**:
- [Authentication Workflow](./authentication-flow.md)
- [API Architecture](../architecture/FRONTEND_GUIDE.md)

