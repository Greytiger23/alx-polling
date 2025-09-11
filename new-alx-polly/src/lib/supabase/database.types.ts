/**
 * TypeScript types for Supabase database schema
 * Updated to match the actual database schema from supabase-schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          is_active: boolean
          allow_multiple_votes: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          is_active?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          is_active?: boolean
          allow_multiple_votes?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          option_order: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          option_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          option_order?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          voter_id: string | null
          voter_ip: string | null
          voter_session: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          voter_id?: string | null
          voter_ip?: string | null
          voter_session?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          voter_id?: string | null
          voter_ip?: string | null
          voter_session?: string | null
          created_at?: string
        }
      }
      poll_analytics: {
        Row: {
          id: string
          poll_id: string
          total_votes: number
          unique_voters: number
          last_vote_at: string | null
          updated_at: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          total_votes?: number
          unique_voters?: number
          last_vote_at?: string | null
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          total_votes?: number
          unique_voters?: number
          last_vote_at?: string | null
          updated_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_vote: {
        Args: {
          option_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Form types for client-side validation and server actions
export type CreatePollForm = {
  title: string
  description?: string
  options: string[]
  allow_multiple_votes?: boolean
  expires_at?: string
}

export type CastVoteForm = {
  pollId: string
  optionId: string
}

export type PollUpdate = {
  title?: string
  description?: string
  is_active?: boolean
  allow_multiple_votes?: boolean
  expires_at?: string
}

// Additional helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type PollAnalytics = Database['public']['Tables']['poll_analytics']['Row']

export type CreateProfile = Database['public']['Tables']['profiles']['Insert']
export type CreatePoll = Database['public']['Tables']['polls']['Insert']
export type CreatePollOption = Database['public']['Tables']['poll_options']['Insert']
export type CreateVote = Database['public']['Tables']['votes']['Insert']
export type CreatePollAnalytics = Database['public']['Tables']['poll_analytics']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdatePoll = Database['public']['Tables']['polls']['Update']
export type UpdatePollOption = Database['public']['Tables']['poll_options']['Update']
export type UpdateVote = Database['public']['Tables']['votes']['Update']
export type UpdatePollAnalytics = Database['public']['Tables']['poll_analytics']['Update']

// Composite types for API responses
export interface PollWithOptions extends Poll {
  options: PollOption[]
  creator?: Profile
}

export interface PollWithResults extends PollWithOptions {
  votes: Vote[]
  analytics?: PollAnalytics
}

export interface VoteResult {
  option_id: string
  option_text: string
  vote_count: number
  percentage: number
}

export interface PollResults {
  poll: Poll
  options: PollOption[]
  results: VoteResult[]
  total_votes: number
  unique_voters: number
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Query filter types
export interface PollFilters {
  creator_id?: string
  is_active?: boolean
  search?: string
  limit?: number
  offset?: number
}

export interface VoteFilters {
  poll_id?: string
  voter_id?: string
  option_id?: string
  limit?: number
  offset?: number
}

// Utility types
export type PollStatus = 'active' | 'expired' | 'inactive'
export type VotingMode = 'single' | 'multiple'
export type UserRole = 'creator' | 'voter' | 'anonymous'

// Error types
export interface DatabaseError {
  code: string
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

// Type guards for runtime type checking
export function isPoll(obj: any): obj is Poll {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string'
}

export function isPollOption(obj: any): obj is PollOption {
  return obj && typeof obj.id === 'string' && typeof obj.option_text === 'string'
}

export function isVote(obj: any): obj is Vote {
  return obj && typeof obj.id === 'string' && typeof obj.poll_id === 'string' && typeof obj.option_id === 'string'
}