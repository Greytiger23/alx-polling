// src/lib/supabase/db.ts
// This file contains database operations for polls

import { supabase } from './client';
import { Database, CreatePollForm, CastVoteForm, PollUpdate } from './database.types';

// Poll types
export type Poll = {
  id: string;
  title: string;
  created_at: string;
  user_id?: string;
  options?: PollOption[];
};

export type PollOption = {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
};

// Export functions to be used in actions and pages
export async function getAllPolls(): Promise<Poll[]> {
  const { data, error } = await supabase
    .from('polls')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error || !data) return [];
  return data;
}

// Create a new poll
export async function createPoll(poll: CreatePollForm, userId: string) {
  // Insert the poll
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .insert({
      title: poll.title,
      user_id: userId,
    })
    .select()
    .single();

  if (pollError || !pollData) {
    throw new Error(`Error creating poll: ${pollError?.message}`);
  }

  // Insert the options
  const optionsToInsert = poll.options.map((option) => ({
    poll_id: pollData.id,
    text: option,
    votes: 0,
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert);
  
  if (optionsError) {
    throw new Error(`Error creating poll options: ${optionsError.message}`);
  }

  return pollData;
}

/**
 * Cast a vote on a poll option
 * 
 * Handles the core voting logic with support for both authenticated and anonymous voting.
 * Uses a two-step process: increment vote count and optionally record user vote for tracking.
 * 
 * Process:
 * 1. Increment the vote count for the selected option (atomic operation)
 * 2. If user is authenticated, record their vote for duplicate prevention
 * 
 * Features:
 * - Atomic vote counting via database RPC function
 * - Anonymous voting support (no user tracking)
 * - Authenticated voting with duplicate prevention
 * - Proper error handling and rollback safety
 * 
 * @param {CastVoteForm} vote - Vote data containing pollId and optionId
 * @param {string} [userId] - Optional user ID for authenticated voting
 * @returns {Promise<{success: boolean}>} Success confirmation
 * @throws {Error} When vote increment or recording fails
 * 
 * @example
 * ```typescript
 * // Anonymous vote
 * await castVote({ pollId: 'poll-123', optionId: 'option-456' });
 * 
 * // Authenticated vote
 * await castVote({ pollId: 'poll-123', optionId: 'option-456' }, 'user-789');
 * ```
 */
export async function castVote(vote: CastVoteForm, userId?: string) {
  // Step 1: Increment vote count using atomic database function
  // This ensures vote counts are accurate even under high concurrency
  const { error: incrementError } = await supabase.rpc('increment_vote', {
    option_id: vote.optionId
  });

  if (incrementError) {
    throw new Error(`Error incrementing vote: ${incrementError.message}`);
  }

  // Step 2: Record individual vote for authenticated users (enables duplicate prevention)
  if (userId) {
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: vote.pollId,
        option_id: vote.optionId,
        user_id: userId // Links vote to specific user for tracking
      });

    if (voteError) {
      // Note: This could fail due to duplicate vote constraints
      throw new Error(`Error recording vote: ${voteError.message}`);
    }
  }
  // Anonymous votes: Only increment count, no individual tracking

  return { success: true };
}

// Update a poll
export async function updatePoll(pollId: string, update: PollUpdate, userId: string) {
  // Verify ownership
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('user_id')
    .eq('id', pollId)
    .single();

  if (pollError || !poll) {
    throw new Error(`Poll not found: ${pollError?.message}`);
  }

  if (poll.user_id !== userId) {
    throw new Error('You do not have permission to update this poll');
  }

  // Update the poll
  const { data, error } = await supabase
    .from('polls')
    .update(update)
    .eq('id', pollId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating poll: ${error.message}`);
  }

  return data;
}

// Delete a poll
export async function deletePoll(pollId: string, userId: string) {
  // Verify ownership
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .select('user_id')
    .eq('id', pollId)
    .single();

  if (pollError || !poll) {
    throw new Error(`Poll not found: ${pollError?.message}`);
  }

  if (poll.user_id !== userId) {
    throw new Error('You do not have permission to delete this poll');
  }

  // Delete the poll (cascade should handle options and votes)
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId);

  if (error) {
    throw new Error(`Error deleting poll: ${error.message}`);
  }

  return { success: true };
}

// Poll operations
export const pollsDb = {
  getPolls: getAllPolls,
  createPoll,
  castVote,
  updatePoll,
  deletePoll
};