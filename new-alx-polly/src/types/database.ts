/**
 * Database Types for ALX Polly - Polling App with QR Code Sharing
 * Generated from Supabase schema
 */

// Base types for common fields
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

// User Profile Types
export interface Profile extends BaseEntity {
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface CreateProfileData {
  id: string; // References auth.users(id)
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

// Poll Types
export interface Poll extends BaseEntity {
  title: string;
  description?: string;
  creator_id: string;
  is_active: boolean;
  allow_multiple_votes: boolean;
  expires_at?: string;
}

export interface CreatePollData {
  title: string;
  description?: string;
  creator_id: string;
  is_active?: boolean;
  allow_multiple_votes?: boolean;
  expires_at?: string;
}

export interface UpdatePollData {
  title?: string;
  description?: string;
  is_active?: boolean;
  allow_multiple_votes?: boolean;
  expires_at?: string;
}

// Poll Option Types
export interface PollOption extends BaseEntity {
  poll_id: string;
  option_text: string;
  option_order: number;
}

export interface CreatePollOptionData {
  poll_id: string;
  option_text: string;
  option_order: number;
}

export interface UpdatePollOptionData {
  option_text?: string;
  option_order?: number;
}

// Vote Types
export interface Vote extends BaseEntity {
  poll_id: string;
  option_id: string;
  voter_id?: string; // Optional for anonymous voting
  voter_ip?: string; // For anonymous voting tracking
  voter_session?: string; // For anonymous voting session tracking
}

export interface CreateVoteData {
  poll_id: string;
  option_id: string;
  voter_id?: string;
  voter_ip?: string;
  voter_session?: string;
}

// Poll Analytics Types
export interface PollAnalytics extends BaseEntity {
  poll_id: string;
  total_votes: number;
  unique_voters: number;
  last_vote_at?: string;
}

export interface UpdatePollAnalyticsData {
  total_votes?: number;
  unique_voters?: number;
  last_vote_at?: string;
}

// Composite Types for API responses
export interface PollWithOptions extends Poll {
  options: PollOption[];
  creator?: Profile;
}

export interface PollWithResults extends PollWithOptions {
  votes: Vote[];
  analytics?: PollAnalytics;
}

export interface VoteResult {
  option_id: string;
  option_text: string;
  vote_count: number;
  percentage: number;
}

export interface PollResults {
  poll: Poll;
  options: PollOption[];
  results: VoteResult[];
  total_votes: number;
  unique_voters: number;
}

// Form Data Types
export interface CreatePollFormData {
  title: string;
  description?: string;
  options: string[];
  allow_multiple_votes?: boolean;
  expires_at?: string;
}

export interface VoteFormData {
  option_id: string;
  poll_id: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database Query Types
export interface PollFilters {
  creator_id?: string;
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface VoteFilters {
  poll_id?: string;
  voter_id?: string;
  option_id?: string;
  limit?: number;
  offset?: number;
}

// Supabase Database Type (for type-safe queries)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: CreateProfileData;
        Update: UpdateProfileData;
      };
      polls: {
        Row: Poll;
        Insert: CreatePollData;
        Update: UpdatePollData;
      };
      poll_options: {
        Row: PollOption;
        Insert: CreatePollOptionData;
        Update: UpdatePollOptionData;
      };
      votes: {
        Row: Vote;
        Insert: CreateVoteData;
        Update: never; // Votes shouldn't be updated
      };
      poll_analytics: {
        Row: PollAnalytics;
        Insert: Omit<PollAnalytics, 'id' | 'created_at' | 'updated_at'>;
        Update: UpdatePollAnalyticsData;
      };
    };
  };
}

// Type guards for runtime type checking
export function isPoll(obj: unknown): obj is Poll {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'title' in obj && typeof (obj as Record<string, unknown>).id === 'string' && typeof (obj as Record<string, unknown>).title === 'string';
}

export function isPollOption(obj: unknown): obj is PollOption {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'option_text' in obj && typeof (obj as Record<string, unknown>).id === 'string' && typeof (obj as Record<string, unknown>).option_text === 'string';
}

export function isVote(obj: unknown): obj is Vote {
  return obj !== null && typeof obj === 'object' && 'id' in obj && 'poll_id' in obj && 'option_id' in obj && typeof (obj as Record<string, unknown>).id === 'string' && typeof (obj as Record<string, unknown>).poll_id === 'string' && typeof (obj as Record<string, unknown>).option_id === 'string';
}

// Utility types
export type PollStatus = 'active' | 'expired' | 'inactive';
export type VotingMode = 'single' | 'multiple';
export type UserRole = 'creator' | 'voter' | 'anonymous';

// Error types
export interface DatabaseError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}