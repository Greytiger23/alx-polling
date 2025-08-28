// src/lib/supabase/types.ts
// This file contains types for database models

// Poll type
export type Poll = {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  options: PollOption[];
};

// Poll option type
export type PollOption = {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
};

// Vote type
export type Vote = {
  id: string;
  poll_id: string;
  option_id: string;
  user_id: string;
  created_at: string;
};

// Database schema
export type Database = {
  public: {
    Tables: {
      polls: {
        Row: Poll;
        Insert: Omit<Poll, 'id' | 'created_at'>;
        Update: Partial<Omit<Poll, 'id' | 'created_at'>>;
      };
      poll_options: {
        Row: PollOption;
        Insert: Omit<PollOption, 'id'>;
        Update: Partial<Omit<PollOption, 'id'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'created_at'>>;
      };
    };
  };
};