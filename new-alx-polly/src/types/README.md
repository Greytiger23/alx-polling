# Database Types Documentation

This directory contains TypeScript type definitions for the ALX Polly polling application database schema.

## Files Overview

### `database.ts`
Comprehensive type definitions that mirror the database schema, including:
- Base entity interfaces
- Individual table types (Profile, Poll, PollOption, Vote, PollAnalytics)
- Form data types for client-side validation
- API response types
- Utility types and type guards

### `index.ts`
Central export point for all type definitions. Import types from here:

```typescript
import { Poll, PollWithOptions, CreatePollData } from '@/types'
```

## Database Schema Types

### Core Entity Types

#### Profile
```typescript
interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}
```

#### Poll
```typescript
interface Poll {
  id: string
  title: string
  description?: string
  creator_id: string
  is_active: boolean
  allow_multiple_votes: boolean
  expires_at?: string
  created_at: string
  updated_at?: string
}
```

#### PollOption
```typescript
interface PollOption {
  id: string
  poll_id: string
  option_text: string
  option_order: number
  created_at: string
}
```

#### Vote
```typescript
interface Vote {
  id: string
  poll_id: string
  option_id: string
  voter_id?: string // Optional for anonymous voting
  voter_ip?: string // For anonymous voting tracking
  voter_session?: string // For anonymous voting session tracking
  created_at: string
}
```

### Form Data Types

Use these types for form validation and API requests:

```typescript
// Creating a new poll
interface CreatePollFormData {
  title: string
  description?: string
  options: string[]
  allow_multiple_votes?: boolean
  expires_at?: string
}

// Casting a vote
interface VoteFormData {
  option_id: string
  poll_id: string
}
```

### Composite Types

For complex data structures returned by API endpoints:

```typescript
// Poll with its options included
interface PollWithOptions extends Poll {
  options: PollOption[]
  creator?: Profile
}

// Poll with complete results
interface PollWithResults extends PollWithOptions {
  votes: Vote[]
  analytics?: PollAnalytics
}

// Formatted poll results for display
interface PollResults {
  poll: Poll
  options: PollOption[]
  results: VoteResult[]
  total_votes: number
  unique_voters: number
}
```

### API Response Types

Standardized response formats:

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## Usage Examples

### In Server Actions

```typescript
import { CreatePollData, Poll } from '@/types'

export async function createPoll(data: CreatePollData): Promise<Poll> {
  // Implementation
}
```

### In API Routes

```typescript
import { ApiResponse, PollWithOptions } from '@/types'

export async function GET(): Promise<Response> {
  const response: ApiResponse<PollWithOptions[]> = {
    success: true,
    data: polls
  }
  return Response.json(response)
}
```

### In Components

```typescript
import { Poll, PollOption } from '@/types'

interface PollCardProps {
  poll: Poll
  options: PollOption[]
}

export function PollCard({ poll, options }: PollCardProps) {
  // Component implementation
}
```

### Type Guards

Use type guards for runtime type checking:

```typescript
import { isPoll, isPollOption } from '@/types'

function processPollData(data: unknown) {
  if (isPoll(data)) {
    // TypeScript now knows data is of type Poll
    console.log(data.title)
  }
}
```

## Best Practices

1. **Always use the provided types** instead of `any` or custom interfaces
2. **Import from the index file** (`@/types`) for consistency
3. **Use type guards** when dealing with unknown data
4. **Prefer composite types** (like `PollWithOptions`) for complex data structures
5. **Use form data types** for client-side validation and API requests

## Supabase Integration

The types in `src/lib/supabase/database.types.ts` are specifically designed to work with Supabase's type system and should be used for:

- Supabase client queries
- Database operations
- Server actions that interact with the database

The types in `src/types/database.ts` provide additional utility types and interfaces for application-level usage.