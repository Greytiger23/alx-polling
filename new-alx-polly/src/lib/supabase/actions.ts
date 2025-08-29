// src/lib/supabase/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPollInDb as createPoll, updatePollInDb as updatePoll } from './db';
import { supabaseServer } from './client';

type CreatePollData = {
  title: string;
  description?: string;
  options: string[];
};

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Create a new poll
export async function createPollFromObject(data: CreatePollData): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to create a poll' };
    }

    const poll = await createPoll({
      title: data.title,
      description: data.description,
      options: data.options,
      created_by: user.id
    });

    if (!poll) {
      return { success: false, error: 'Failed to create poll' };
    }

    revalidatePath('/polls');
    return { success: true, data: poll };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Create poll from form data (for form actions)
export async function createPollAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const options = formData.getAll('option') as string[];

  const result = await createPollFromObject({
    title,
    description: description || undefined,
    options: options.filter(option => option.trim() !== '')
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to create poll');
  }

  redirect('/polls');
}

// Update an existing poll
export async function updatePollAction(pollId: string, data: Partial<CreatePollData>): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to update a poll' };
    }

    const poll = await updatePoll(pollId, {
      title: data.title,
      description: data.description,
      options: data.options
    });

    if (!poll) {
      return { success: false, error: 'Failed to update poll or poll not found' };
    }

    revalidatePath('/polls');
    revalidatePath(`/polls/${pollId}`);
    return { success: true, data: poll };
  } catch (error) {
    console.error('Error updating poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Delete a poll
export async function deletePollAction(pollId: string): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to delete a poll' };
    }

    const success = await deletePoll(pollId);

    if (!success) {
      return { success: false, error: 'Failed to delete poll or poll not found' };
    }

    revalidatePath('/polls');
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Cast a vote
export async function castVoteAction(pollId: string, optionId: string): Promise<ActionResult> {
  try {
    const supabase = supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: 'You must be logged in to vote' };
    }

    const { data: vote } = await supabase.from('votes').insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    });

    if (!vote) {
      return { success: false, error: 'Failed to cast vote' };
    }

    revalidatePath(`/polls/${pollId}`);
    return { success: true, data: vote };
  } catch (error) {
    console.error('Error casting vote:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Cast vote from form data
export async function castVoteFormAction(formData: FormData) {
  const pollId = formData.get('pollId') as string;
  const optionId = formData.get('optionId') as string;

  const result = await castVoteAction(pollId, optionId);

  if (!result.success) {
    throw new Error(result.error || 'Failed to cast vote');
  }

  revalidatePath(`/polls/${pollId}`);
}

// Authentication actions (placeholders)
export async function signInAction(formData: FormData) {
  // TODO: Implement sign in logic
  throw new Error('Sign in not implemented yet');
}

export async function signUpAction(formData: FormData) {
  // TODO: Implement sign up logic
  throw new Error('Sign up not implemented yet');
}

export async function signOutAction() {
  // TODO: Implement sign out logic
  throw new Error('Sign out not implemented yet');
}