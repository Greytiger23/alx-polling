// TypeScript types for Supabase database schema
// Auto-generated types based on the database schema

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
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "polls_creator_id_fkey"
            columns: ["creator_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_option_id_fkey"
            columns: ["option_id"]
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      poll_analytics: {
        Row: {
          id: string
          poll_id: string
          total_votes: number
          unique_voters: number
          last_vote_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          total_votes?: number
          unique_voters?: number
          last_vote_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          total_votes?: number
          unique_voters?: number
          last_vote_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_analytics_poll_id_fkey"
            columns: ["poll_id"]
            referencedRelation: "polls"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      poll_results: {
        Row: {
          poll_id: string
          title: string
          description: string | null
          creator_id: string
          creator_name: string | null
          created_at: string
          is_active: boolean
          option_id: string | null
          option_text: string | null
          option_order: number | null
          vote_count: number
          total_poll_votes: number
          vote_percentage: number
        }
        Relationships: []
      }
      poll_summary: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          creator_name: string | null
          created_at: string
          updated_at: string
          is_active: boolean
          expires_at: string | null
          option_count: number
          total_votes: number
          unique_voters: number
          last_vote_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type Vote = Database['public']['Tables']['votes']['Row']
export type PollAnalytics = Database['public']['Tables']['poll_analytics']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type PollAnalyticsInsert = Database['public']['Tables']['poll_analytics']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type PollUpdate = Database['public']['Tables']['polls']['Update']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']
export type PollAnalyticsUpdate = Database['public']['Tables']['poll_analytics']['Update']

// View types
export type PollResult = Database['public']['Views']['poll_results']['Row']
export type PollSummary = Database['public']['Views']['poll_summary']['Row']

// Extended types for application use
export interface PollWithOptions extends Poll {
  poll_options: PollOption[]
  creator?: Profile
  analytics?: PollAnalytics
}

export interface PollWithResults extends Poll {
  poll_options: (PollOption & {
    vote_count: number
    vote_percentage: number
  })[]
  total_votes: number
  unique_voters: number
  creator?: Profile
}

export interface VoteWithDetails extends Vote {
  poll: Poll
  option: PollOption
  voter?: Profile
}

// Form types for creating/updating
export interface CreatePollForm {
  title: string
  description?: string
  options: string[]
  allow_multiple_votes?: boolean
  expires_at?: string
}

export interface UpdatePollForm {
  title?: string
  description?: string
  is_active?: boolean
  expires_at?: string
}

export interface CastVoteForm {
  poll_id: string
  option_id: string
  voter_session?: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Error types
export interface DatabaseError {
  message: string
  details?: string
  hint?: string
  code?: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  profile?: Profile
}

// Utility types
export type SortOrder = 'asc' | 'desc'
export type PollStatus = 'active' | 'inactive' | 'expired'

export interface PollFilters {
  creator_id?: string
  is_active?: boolean
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'total_votes'
  sort_order?: SortOrder
  limit?: number
  offset?: number
}

export interface VoteFilters {
  poll_id?: string
  voter_id?: string
  created_after?: string
  created_before?: string
  limit?: number
  offset?: number
}