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

// Cast a vote on a poll
export async function castVote(vote: CastVoteForm, userId?: string) {
  // First, increment the vote count for the option
  const { error: incrementError } = await supabase.rpc('increment_vote', {
    p_option_id: vote.optionId
  });

  if (incrementError) {
    throw new Error(`Error incrementing vote: ${incrementError.message}`);
  }

  // If user is logged in, record their vote
  if (userId) {
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: vote.pollId,
        option_id: vote.optionId,
        user_id: userId
      });

    if (voteError) {
      throw new Error(`Error recording vote: ${voteError.message}`);
    }
  }

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
    .update({ title: update.title })
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
       .single();
     
     if (error || !data) return null;
     
   // Get poll options
     const { data: optionsData } = await supabase
       .from('poll_options')
       .select('*')
       .eq('poll_id', id);
     
     return {
       ...data,
       options: optionsData || [],
     };
     
    // Placeholder implementation
    const polls = await pollsDb.getPolls();
    return polls.find(poll => poll.id === id) || null;
  },

  // Delete a poll
  deletePoll: async (pollId: string): Promise<boolean> => {
    // This would be implemented with actual Supabase client
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);
    
    return !error;
  },
  
  // Create a new poll
  createPoll: async (title: string, options: string[], userId: string): Promise<Poll | null> => {
    // This would be implemented with actual Supabase client
    const { data: pollData, error: pollError } = await supabase
       .from('polls')
       .insert({
       title,
       user_id: userId,
   })
     .select()
     .single();
 
   if (pollError || !pollData) return null;
 
   // Create poll options
   const pollOptions = options.map(text => ({
     poll_id: pollData.id,
     text,
     votes: 0,
   }));
     
   const { data: optionsData, error: optionsError } = await supabase
       .from('poll_options')
       .insert(pollOptions)
       .select();
     
     if (optionsError) return null;
     
     return {
       ...pollData,
       options: optionsData || [],
     };
    
    // Placeholder implementation
    return {
      id: Math.random().toString(36).substring(2, 9),
      title,
      created_at: new Date().toISOString(),
      user_id: userId,
      options: options.map((text) => ({
        id: Math.random().toString(36).substring(2, 9),
        poll_id: '0',
        text,
        votes: 0,
      })),
    };
  },
  
  // Vote on a poll option
  vote: async (pollId: string, optionId: string, userId: string): Promise<boolean> => {
    // This would be implemented with actual Supabase client
    // // Check if user has already voted
     const { data: existingVote } = await supabase
       .from('votes')
       .select('*')
       .eq('poll_id', pollId)
       .eq('user_id', userId)
       .single();
     
     if (existingVote) return false;
     
     // Create vote
     const { error: voteError } = await supabase
       .from('votes')
       .insert({
         poll_id: pollId,
         option_id: optionId,
         user_id: userId,
       });
     
     if (voteError) return false;
     
     // Increment vote count
     const { error: updateError } = await supabase.rpc('increment_vote', {
       option_id_param: optionId,
     });
     
     return !updateError;
    
    // Placeholder implementation to use pollId and avoid unused variable error
    if (!pollId || !optionId || !userId) {
      return false;
    }
    return true;
  },
};